import rss from "@astrojs/rss";
import { getSiteContent, entryPath, siteURL } from "./content";
import { copy, htmlLanguage } from "./i18n";
import { isPublished, localePath, type Language } from "./publishing";
import { isFeatureEnabled } from "./feature-flags";
export async function feed(language: Language) {
  if (!isFeatureEnabled("blog")) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  const { posts } = await getSiteContent({ posts: true, projects: false });
  return rss({
    title: `Miguel Vila — ${copy[language].blog}`,
    description: copy[language].blogDescription,
    site: new URL(localePath(language), siteURL).href,
    items: posts
      .filter((post) => post.data.language === language && isPublished(post.data))
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishedDate,
        link: entryPath(post),
        categories: post.data.tags,
      })),
    customData: `<language>${htmlLanguage(language)}</language>`,
  });
}
