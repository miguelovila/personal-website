import assert from "node:assert/strict";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { load } from "cheerio";

const root = path.resolve(".test-dist");
const landingRoot = path.resolve(".test-dist-landing");
const origin = "https://miguelovila.pt";
const run = (args, env = {}) => {
  const result = spawnSync("bun", args, { stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`bun ${args.join(" ")} failed`);
};
await rm(".test-content", { recursive: true, force: true });
await rm(landingRoot, { recursive: true, force: true });
await cp("tests/fixtures", ".test-content", { recursive: true });
for (let index = 1; index <= 12; index++) {
  const slug = index === 1 ? "reading-tool" : `archive-${index}`;
  const projectReference = index === 1 ? "relatedProjects: [en/reading-tool]\n" : "";
  await writeFile(
    `.test-content/posts/en/${slug}.md`,
    `---\ntitle: Archive fixture ${index}\ndescription: Pagination and related-topic test content.\nlanguage: en\ndraft: false\npublishedDate: 2024-01-${String(index).padStart(2, "0")}\ntags: [Software]\n${projectReference}---\n\nA pagination fixture.\n\n## Context\n\nA first section.\n\n### Detail\n\nA subsection.\n\n## Outcome\n\nA final section.\n`
  );
}
run(["run", "astro", "build"], { SITE_TEST_CONTENT: "1" });
run(["x", "--no-install", "pagefind", "--site", ".test-dist"]);

async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...(await files(itemPath)));
    else result.push(itemPath);
  }
  return result;
}
const paths = await files(root);
const documents = new Map();
for (const file of paths.filter((file) => file.endsWith(".html"))) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  const url =
    relative === "index.html"
      ? "/"
      : relative.endsWith("/index.html")
        ? `/${relative.slice(0, -10)}`
        : `/${relative}`;
  const html = await readFile(file, "utf8");
  const $ = load(html);
  documents.set(url, $);
  assert.equal($("h1").length, 1, `${url}: exactly one page heading`);
  assert.equal($("main").length, 1, `${url}: exactly one main landmark`);
  assert.equal($("a button, a a, button a").length, 0, `${url}: nested interactive controls`);
  assert.ok($("title").text().length > 5, `${url}: missing title`);
  assert.ok($("meta[name=description]").attr("content"), `${url}: missing description`);
  assert.ok($("link[rel=canonical]").attr("href")?.startsWith(origin), `${url}: invalid canonical`);
  assert.equal($("html").attr("lang"), url.startsWith("/pt/") ? "pt-PT" : "en");
  assert.ok(!/NEVER_PUBLISH_/.test(html), `${url}: leaked private content`);
  const ids = new Set();
  $("[id]").each((_, node) => {
    const id = $(node).attr("id");
    assert.ok(!ids.has(id), `${url}: duplicate ID ${id}`);
    ids.add(id);
  });
  $("script[type='application/ld+json']").each((_, node) => JSON.parse($(node).text()));
}
for (const [url, $] of documents) {
  for (const node of $(
    "a[href], img[src], script[src], link[rel=stylesheet], link[rel=alternate], meta[property='og:image']"
  ).toArray()) {
    const value = $(node).attr("href") ?? $(node).attr("src") ?? $(node).attr("content");
    if (!value || /^(mailto:|tel:|data:)/.test(value)) continue;
    const target = new URL(value, origin + url);
    if (target.origin !== origin) continue;
    const pathname = decodeURIComponent(target.pathname);
    const targetDocument = documents.get(pathname);
    if (target.hash && targetDocument)
      assert.ok(
        targetDocument(`[id="${decodeURIComponent(target.hash.slice(1))}"]`).length,
        `${url}: broken anchor ${value}`
      );
    if (targetDocument) continue;
    const asset = path.resolve(root, `.${pathname}`);
    assert.ok(asset.startsWith(root + path.sep), `Unsafe local URL ${value}`);
    assert.ok(paths.includes(asset), `${url}: missing local target ${value}`);
  }
  for (const alternate of $("link[hreflang]").toArray()) {
    const href = $(alternate).attr("href");
    const target = documents.get(new URL(href).pathname);
    assert.ok(target, `${url}: missing language alternate ${href}`);
    assert.ok(
      target("link[hreflang]")
        .toArray()
        .some((node) => target(node).attr("href") === $("link[rel=canonical]").attr("href")),
      `${url}: non-reciprocal language link`
    );
  }
}
assert.equal(documents.get("/posts/")(".post-row").length, 12);
assert.equal(documents.get("/posts/page/2/")(".post-row").length, 1);
assert.equal(documents.get("/pt/posts/")(".post-row").length, 1);
assert.ok(!documents.has("/pt/posts/page/2/"));
assert.equal(documents.get("/")(".post-row").length, 5, "Latest writing includes unfeatured posts");
assert.equal(
  documents.get("/")(".project-preview h3 a").first().attr("href"),
  "/projects/text-project/"
);
assert.equal(
  documents.get("/projects/")(".project-preview").length,
  2,
  "No duplicated featured projects"
);
assert.equal(
  documents.get("/projects/text-project/")("link[hreflang]").length,
  2,
  "Untranslated entry links only itself and x-default"
);
assert.ok(documents.get("/projects/text-project/")("a[href='/pt/projects/']").length);
assert.equal(documents.get("/posts/field-notes/")(".table-of-contents").length, 1);
assert.equal(documents.get("/posts/reading-tool/")(".table-of-contents").length, 1);
assert.ok(
  documents.get("/projects/reading-tool/")(".related-section a[href='/posts/reading-tool/']")
    .length,
  "A project and its related article can share a slug"
);
const topicDates = ["/tags/software/", "/tags/software/page/2/"].flatMap((url) =>
  documents
    .get(url)(".post-row time")
    .toArray()
    .map((node) => documents.get(url)(node).attr("datetime"))
);
assert.deepEqual(
  topicDates,
  [...topicDates].sort().reverse(),
  "Topics sort both collections by date"
);
assert.equal(documents.get("/posts/field-notes/")(".prose .heading-anchor").length, 5);
assert.equal(
  documents.get("/pt/posts/notas-de-campo/")(".heading-anchor").first().attr("aria-label"),
  "Ligação para esta secção"
);
assert.ok(
  documents.get("/posts/field-notes/")(".related-section a[href='/projects/reading-tool/']").length
);
assert.equal(
  documents.get("/posts/field-notes/")(".related-section a[href='/projects/draft-project/']")
    .length,
  0
);

const sitemap = load(await readFile(path.join(root, "sitemap-0.xml"), "utf8"), { xmlMode: true });
const locations = sitemap("url > loc")
  .toArray()
  .map((node) => new URL(sitemap(node).text()).pathname);
for (const url of locations) {
  assert.ok(documents.has(url), `Sitemap references absent URL ${url}`);
  assert.ok(
    !documents.get(url)("meta[name=robots][content^=noindex]").length,
    `Noindex URL in sitemap ${url}`
  );
}
assert.ok(locations.includes("/pt/posts/notas-de-campo/"));
assert.equal(
  sitemap("url")
    .filter((_, node) => sitemap(node).find("loc").text().endsWith("/projects/reading-tool/"))
    .find("lastmod")
    .text(),
  "2024-02-20T00:00:00.000Z"
);
for (const language of ["en", "pt"]) {
  const feedPath = language === "pt" ? "pt/rss.xml" : "rss.xml";
  const feed = load(await readFile(path.join(root, feedPath), "utf8"), { xmlMode: true });
  assert.equal(feed("item").length, language === "pt" ? 1 : 13);
  feed("item link").each((_, node) => {
    const url = new URL(feed(node).text()).pathname;
    assert.ok(documents.has(url));
    assert.equal(url.startsWith("/pt/"), language === "pt");
  });
}
for (const forbidden of [
  "private-draft",
  "future-post",
  "draft-project",
  "colors",
  "prototyping",
  "coming-soon",
]) {
  assert.ok(
    !paths.some((file) => file.split(path.sep).includes(forbidden)),
    `${forbidden} was built`
  );
}

run(["run", "astro", "build"], {
  SITE_TEST_CONTENT: "1",
  SITE_TEST_OUT_DIR: ".test-dist-landing",
  TEST_FEATURE_FLAGS: "1",
  FEATURE_FLAGS: "landing",
  FEATURE_BLOG: "",
  FEATURE_PROJECTS: "",
  FEATURE_ABOUT: "",
  FEATURE_SEARCH: "",
  PUBLIC_FEATURE_FLAGS: "",
  PUBLIC_FEATURE_BLOG: "",
  PUBLIC_FEATURE_PROJECTS: "",
  PUBLIC_FEATURE_ABOUT: "",
  PUBLIC_FEATURE_SEARCH: "",
});
run(["scripts/build-search.mjs", ".test-dist-landing"]);

const landingPaths = await files(landingRoot);
const landingDocuments = new Map();
for (const file of landingPaths.filter((file) => file.endsWith(".html"))) {
  const relative = path.relative(landingRoot, file).split(path.sep).join("/");
  const url =
    relative === "index.html"
      ? "/"
      : relative.endsWith("/index.html")
        ? `/${relative.slice(0, -10)}`
        : `/${relative}`;
  landingDocuments.set(url, load(await readFile(file, "utf8")));
}
assert.deepEqual([...landingDocuments.keys()].sort(), ["/", "/404.html", "/pt/", "/pt/404/"]);
for (const absent of [
  "rss.xml",
  "pt/rss.xml",
  "posts",
  "projects",
  "tags",
  "search",
  "search-panel",
  "header-navigation-with-search",
  "project-filter",
  "seed-architecture-flow",
  "seed-reading-tool",
]) {
  assert.ok(
    !landingPaths.some((file) => file.split(path.sep).includes(absent) || file.includes(absent)),
    `Landing build should not emit ${absent}`
  );
}
const landingSitemap = load(await readFile(path.join(landingRoot, "sitemap-0.xml"), "utf8"), {
  xmlMode: true,
});
assert.deepEqual(
  landingSitemap("url > loc")
    .toArray()
    .map((node) => new URL(landingSitemap(node).text()).pathname)
    .sort(),
  ["/", "/pt/"]
);
for (const [url, $] of landingDocuments) {
  assert.equal($("footer").length, 0, `${url}: home-only footer should be hidden`);
  if (!["/", "/pt/"].includes(url)) continue;
  assert.equal($("main.hero-only-main").length, 1, `${url}: hero-only main class missing`);
  assert.equal($(".home-hero-only .hero").length, 1, `${url}: hero-only home wrapper missing`);
  assert.equal($("a[href*='/posts']").length, 0, `${url}: posts link leaked`);
  assert.equal($("a[href*='/projects']").length, 0, `${url}: projects link leaked`);
  assert.equal($("a[href*='/search']").length, 0, `${url}: search link leaked`);
  assert.equal($("a[href*='/tags']").length, 0, `${url}: tags link leaked`);
  assert.equal($("link[href$='rss.xml']").length, 0, `${url}: RSS discovery leaked`);
  assert.equal($("[data-open-search]").length, 0, `${url}: search trigger leaked`);
  assert.equal($(".mobile-nav-trigger").length, 0, `${url}: landing menu trigger leaked`);
  const bodyText = $("body").text();
  assert.ok(
    !/\b(Blog|Projects|Posts|RSS|Search|Artigos|Projetos|Pesquisar|Feed RSS)\b/.test(bodyText),
    `${url}: disabled feature text leaked`
  );
}

// Browser-only audit dependency, placed exclusively in the isolated test output.
await mkdir(path.join(root, "_test"), { recursive: true });
await cp("node_modules/axe-core/axe.min.js", path.join(root, "_test/axe.min.js"));
console.log(
  `Verified ${documents.size} rendered pages plus landing mode: links, metadata, locales, pagination, publication rules, feeds, headings, and sitemap.`
);
