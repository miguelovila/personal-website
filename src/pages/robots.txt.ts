import { siteURL } from "@/lib/content";
export const GET = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteURL}/sitemap-index.xml\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
