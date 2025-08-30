// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://miguelovila.pt",
  integrations: [react(), sitemap({
    changefreq: "weekly",
    priority: 0.7,
    lastmod: new Date(),
  }), icon()],

  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "Fira Code",
        cssVariable: "--font-sans",
      },
      {
        provider: fontProviders.fontsource(),
        name: "Fira Code",
        cssVariable: "--font-mono",
      },
    ],
  },
});