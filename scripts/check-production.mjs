import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

// Check the real build as well as the synthetic fixtures in test-site.mjs.
const root = path.resolve(process.argv[2] ?? "dist");
const origin = "https://miguelovila.pt";
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const file = path.join(directory, entry.name);
        return entry.isDirectory() ? files(file) : file;
      })
    )
  ).flat();
}
const paths = await files(root);
const assets = new Set(paths);
const documents = new Map();
let references = 0;
let fragments = 0;
let diagrams = 0;
let tables = 0;

for (const file of paths.filter((file) => file.endsWith(".html"))) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/index\.html$/, "")}`;
  const html = await readFile(file, "utf8");
  documents.set(route, load(html));
  assert.ok(!/NEVER_PUBLISH_|seed-/.test(html), `${route}: fixture or template content leaked`);
}
assert.ok(documents.has("/"), "The build must contain the homepage");

function checkURL(value, route) {
  if (!value || /^(?:data:|mailto:|tel:|blob:)/.test(value)) return;
  assert.ok(!/^javascript:/i.test(value), `${route}: executable URL`);
  const url = new URL(value, origin + route);
  if (url.origin !== origin) return;
  references++;
  const pathname = decodeURIComponent(url.pathname);
  const target = documents.get(pathname) ?? documents.get(`${pathname}/`);
  if (target) {
    if (url.hash) {
      fragments++;
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(
        target("[id],a[name]")
          .toArray()
          .some((node) => target(node).attr("id") === id || target(node).attr("name") === id),
        `${route}: missing fragment ${value}`
      );
    }
  } else {
    const asset = path.resolve(root, `.${pathname}`);
    assert.ok(asset.startsWith(`${root}${path.sep}`), `${route}: unsafe path ${value}`);
    assert.ok(assets.has(asset), `${route}: missing local target ${value}`);
  }
}

function checkDiagram($, svg, route) {
  const id = svg.attr("id");
  const ids = new Set(
    svg
      .find("[id]")
      .addBack()
      .map((_, node) => $(node).attr("id"))
      .get()
  );
  assert.ok(id && svg.attr("viewBox"), `${route}: diagram needs an ID and viewBox`);
  svg
    .find("*")
    .addBack()
    .each((_, node) => {
      for (const value of Object.values(node.attribs ?? {})) {
        for (const match of value.matchAll(/url\(#([^)]+)\)/g)) {
          assert.ok(ids.has(match[1]), `${route}: missing SVG marker ${match[1]}`);
        }
      }
    });
  const style = svg.find("style").text();
  assert.ok(!/@import|fonts\.googleapis/.test(style), `${route}: remote diagram font`);
  for (const match of style.matchAll(/(?:^|\})\s*([^{}]+)\{/g)) {
    assert.ok(match[1].trim().startsWith(`#${id}`), `${route}: unscoped diagram CSS`);
  }
}

for (const [route, $] of documents) {
  for (const tag of ["h1", "main", "head > title", "meta[name=description]"]) {
    assert.equal($(tag).length, 1, `${route}: expected one ${tag}`);
  }
  assert.ok($("meta[name=description]").attr("content")?.trim(), `${route}: empty description`);
  assert.equal($("html").attr("lang"), route.startsWith("/pt/") ? "pt-PT" : "en");
  assert.equal($("link[rel=canonical]").attr("href"), origin + route, `${route}: canonical URL`);
  assert.equal($("a a,a button,button a,button button").length, 0, `${route}: nested controls`);
  const ids = new Set();
  $("[id]").each((_, node) => {
    const id = $(node).attr("id");
    assert.ok(!ids.has(id), `${route}: duplicate ID ${id}`);
    ids.add(id);
  });
  $("script[type='application/ld+json']").each((_, node) => JSON.parse($(node).text()));
  const attributes = ["href", "src", "poster", "action", "component-url", "renderer-url"];
  $(attributes.map((attribute) => `[${attribute}]`).join(",")).each((_, node) => {
    for (const attribute of attributes) checkURL($(node).attr(attribute), route);
  });
  $("meta[property='og:image'],meta[name='twitter:image']").each((_, node) =>
    checkURL($(node).attr("content"), route)
  );
  $("[srcset]").each((_, node) => {
    for (const candidate of $(node).attr("srcset").split(",")) {
      checkURL(candidate.trim().split(/\s+/)[0], route);
    }
  });
  $("img").each((_, node) => {
    assert.notEqual($(node).attr("alt"), undefined, `${route}: image without alt`);
  });
  $("iframe").each((_, node) => {
    assert.ok($(node).attr("title"), `${route}: iframe without a title`);
  });
  $("link[hreflang]").each((_, node) => {
    const target = documents.get(new URL($(node).attr("href")).pathname);
    assert.ok(target, `${route}: missing language alternate`);
    assert.ok(
      target("link[hreflang]")
        .toArray()
        .some((link) => target(link).attr("href") === origin + route),
      `${route}: language alternate does not link back`
    );
  });
  $(".prose table").each((_, node) => {
    tables++;
    const wrapper = $(node).parent();
    assert.ok(wrapper.hasClass("table-scroll"), `${route}: missing table scroll wrapper`);
    assert.equal(wrapper.attr("tabindex"), "0", `${route}: table not keyboard scrollable`);
    assert.equal(wrapper.attr("role"), "region");
    assert.ok(wrapper.attr("aria-label"), `${route}: unnamed table region`);
    $(node)
      .find("th")
      .each((_, heading) => assert.equal($(heading).attr("scope"), "col"));
  });
  $(".mermaid-figure").each((_, node) => {
    diagrams++;
    checkDiagram($, $(node).find("svg"), route);
    const download = $(node).find("a.diagram-download");
    if (!download.length) return;
    const href = download.attr("href");
    assert.ok(download.attr("download") && href?.startsWith("data:image/svg+xml;charset=utf-8,"));
    const xml = decodeURIComponent(href.slice(href.indexOf(",") + 1));
    assert.ok(!/var\(--(?:paper|ink)\)/.test(xml), `${route}: diagram download depends on theme`);
    const standalone = load(xml, { xmlMode: true });
    checkDiagram(standalone, standalone("svg"), route);
  });
}

for (const file of paths.filter((file) => file.endsWith(".css"))) {
  const route = `/${path.relative(root, file).split(path.sep).join("/")}`;
  const css = await readFile(file, "utf8");
  for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))
    checkURL(match[1], route);
}
const sitemapRoutes = new Set();
for (const file of paths.filter((file) => /sitemap.*\.xml$/.test(file))) {
  const $ = load(await readFile(file, "utf8"), { xmlMode: true });
  $("loc").each((_, node) => {
    const value = $(node).text();
    checkURL(value, "/");
    sitemapRoutes.add(new URL(value).pathname);
  });
}
for (const [route, $] of documents) {
  if ($("meta[name=robots]").attr("content")?.includes("noindex")) {
    assert.ok(!sitemapRoutes.has(route), `${route}: noindex page in sitemap`);
  } else {
    assert.ok(sitemapRoutes.has(route), `${route}: public page missing from sitemap`);
  }
}
console.log(
  `Verified production: ${documents.size} pages, ${references} local references, ${fragments} fragments, ${tables} tables and ${diagrams} diagrams.`
);
