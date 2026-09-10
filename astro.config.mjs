// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import icon from "astro-icon";
import rehypeSlug from "rehype-slug";
import rehypePermalinks from "./scripts/rehype-permalinks.mjs";

const isTestContent = process.env.SITE_TEST_CONTENT === "1";
const testOutDir = process.env.SITE_TEST_OUT_DIR ?? "./.test-dist";

export default defineConfig({
  outDir: isTestContent ? testOutDir : "./dist",
  cacheDir: isTestContent ? "./.astro-test" : "./node_modules/.astro",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://miguelovila.pt",
  integrations: [react(), mdx(), icon()],

  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
    rehypePlugins: [rehypeSlug, rehypePermalinks],
  },
});
