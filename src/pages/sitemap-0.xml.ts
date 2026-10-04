import { getPages } from "@/lib/routes";
import { siteURL } from "@/lib/content";
import { htmlLanguage } from "@/lib/i18n";
import { isPublished } from "@/lib/publishing";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET() {
  const pages = (await getPages()).filter(
    (page) => page.kind !== "search" && (page.kind !== "entry" || isPublished(page.entry.data))
  );
  const urls = pages
    .map((page) => {
      const alternates = page.alternates
        .map(
          (alternate) =>
            `<xhtml:link rel="alternate" hreflang="${escapeXml(htmlLanguage(alternate.language))}" href="${escapeXml(new URL(alternate.href, siteURL).href)}" />`
        )
        .join("");
      const defaultAlternate = page.alternates.find((alternate) => alternate.language === "en");
      const xDefault = defaultAlternate
        ? `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(new URL(defaultAlternate.href, siteURL).href)}" />`
        : "";

      return `<url><loc>${escapeXml(new URL(page.path, siteURL).href)}</loc>${page.lastmod ? `<lastmod>${page.lastmod.toISOString()}</lastmod>` : ""}${alternates}${xDefault}</url>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
