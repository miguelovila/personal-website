import { getPages } from "@/lib/routes";
import { siteURL } from "@/lib/content";
import { isPublished } from "@/lib/publishing";
export async function GET() {
  const pages = (await getPages()).filter(
    (page) => page.kind !== "search" && (page.kind !== "entry" || isPublished(page.entry.data))
  );
  const urls = pages
    .map(
      (page) =>
        `<url><loc>${new URL(page.path, siteURL).href}</loc>${page.lastmod ? `<lastmod>${page.lastmod.toISOString()}</lastmod>` : ""}</url>`
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
