import { readdir, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const directory = process.argv[2] ?? "dist";
async function files(root) {
  const result = [];
  for (const item of await readdir(root, { withFileTypes: true })) {
    const file = path.join(root, item.name);
    if (item.isDirectory()) result.push(...(await files(file)));
    else result.push(file);
  }
  return result;
}
async function hasArticles(root) {
  for (const file of await files(root)) {
    if (file.endsWith(".html") && (await readFile(file, "utf8")).includes("data-pagefind-body")) {
      return true;
    }
  }
  return false;
}
async function pruneUnreferencedAstroAssets(root) {
  const astroRoot = path.join(root, "_astro");
  let allFiles;
  try {
    allFiles = await files(astroRoot);
  } catch {
    return;
  }

  const byName = new Map(allFiles.map((file) => [path.basename(file), file]));
  const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
  const marked = new Set();
  const markReferencedAssets = (text) => {
    for (const name of byName.keys()) {
      if (text.includes(`/_astro/${name}`) || text.includes(`./${name}`)) marked.add(name);
    }
  };

  for (const file of await files(root)) {
    if (file.startsWith(astroRoot + path.sep)) continue;
    if (!textExtensions.has(path.extname(file))) continue;
    markReferencedAssets(await readFile(file, "utf8"));
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const name of [...marked]) {
      const file = byName.get(name);
      if (!file || !textExtensions.has(path.extname(file))) continue;
      const before = marked.size;
      markReferencedAssets(await readFile(file, "utf8"));
      if (marked.size !== before) changed = true;
    }
  }

  let removed = 0;
  for (const [name, file] of byName) {
    if (marked.has(name)) continue;
    await rm(file, { force: true });
    removed++;
  }
  if (removed) console.log(`Removed ${removed} unreferenced Astro asset(s).`);
}
if (await hasArticles(directory)) {
  const result = spawnSync("bun", ["x", "--no-install", "pagefind", "--site", directory], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
} else {
  await pruneUnreferencedAstroAssets(directory);
  console.log("No published entries yet; search displays the empty archive state.");
}
