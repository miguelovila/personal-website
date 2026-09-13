import {
  getSiteContent,
  entryPath,
  translationsOf,
  tagGroups,
  selectedProjects,
  type Alternate,
  type Entry,
  type Post,
  type Project,
} from "./content";
import { languages, localePath, pageSize, type Language } from "./publishing";
import { getFeatureFlags, shouldBuildSearch } from "./feature-flags";

type Base = {
  path: string;
  language: Language;
  alternates: Alternate[];
  group?: string;
  lastmod?: Date;
};
export type SitePage = Base &
  (
    | { kind: "home"; posts: Post[]; projects: Project[] }
    | { kind: "posts"; posts: Post[]; page: number; totalPages: number }
    | { kind: "projects"; projects: Project[] }
    | { kind: "about" }
    | { kind: "search"; hasContent: boolean }
    | { kind: "tags"; groups: ReturnType<typeof tagGroups> }
    | { kind: "tag"; tag: string; slug: string; entries: Entry[]; page: number; totalPages: number }
    | { kind: "entry"; entry: Entry; relatedPosts: Post[]; relatedProjects: Project[] }
  );

export async function getPages(): Promise<SitePage[]> {
  const flags = getFeatureFlags();
  const content = await getSiteContent({ posts: flags.blog, projects: flags.projects });
  const visiblePosts = flags.blog ? content.posts : [];
  const visibleProjects = flags.projects ? content.projects : [];
  const entries: Entry[] = [...visiblePosts, ...visibleProjects];
  const pages: SitePage[] = [];
  for (const language of languages) {
    const posts = visiblePosts.filter((entry) => entry.data.language === language);
    const projects = visibleProjects.filter((entry) => entry.data.language === language);
    const base = (path: string, group: string) => ({
      language,
      path: localePath(language, path),
      group,
      alternates: [],
    });
    pages.push({
      ...base("/", "home"),
      kind: "home",
      posts: posts.slice(0, 5),
      projects: selectedProjects(visibleProjects, language),
    });
    if (flags.projects) {
      pages.push({ ...base("projects", "projects"), kind: "projects", projects });
    }
    if (flags.about) {
      pages.push({ ...base("about", "about"), kind: "about" });
    }
    if (shouldBuildSearch(flags)) {
      pages.push({
        ...base("search", "search"),
        kind: "search",
        hasContent: posts.length + projects.length > 0,
      });
    }
    if (flags.blog) {
      const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
      for (let page = 1; page <= totalPages; page++) {
        pages.push({
          ...base(page === 1 ? "posts" : `posts/page/${page}`, `posts:${page}`),
          kind: "posts",
          page,
          totalPages,
          posts: posts.slice((page - 1) * pageSize, page * pageSize),
        });
      }
    }
    if (flags.blog || flags.projects) {
      const groups = tagGroups(entries, language);
      pages.push({ ...base("tags", "tags"), kind: "tags", groups });
      for (const group of groups) {
        const count = Math.ceil(group.entries.length / pageSize);
        for (let page = 1; page <= count; page++) {
          const path = `tags/${group.slug}${page > 1 ? `/page/${page}` : ""}`;
          // Topic labels are author-defined; don't infer translation relationships.
          pages.push({
            ...base(path, `${language}:${path}`),
            kind: "tag",
            tag: group.label,
            slug: group.slug,
            entries: group.entries.slice((page - 1) * pageSize, page * pageSize),
            page,
            totalPages: count,
          });
        }
      }
    }
  }
  for (const entry of entries) {
    const sameLanguage = visiblePosts.filter(
      (post) =>
        post.data.language === entry.data.language &&
        (entry.collection !== "posts" || post.id !== entry.id)
    );
    const relatedPosts =
      entry.collection === "projects" && flags.blog
        ? sameLanguage.filter((post) =>
            post.data.relatedProjects.some((project) => project.id === entry.id)
          )
        : flags.blog
          ? sameLanguage
              .filter((post) => post.data.tags.some((tag) => entry.data.tags.includes(tag)))
              .slice(0, 3)
          : [];
    const relatedProjects =
      entry.collection === "posts" && flags.projects
        ? visibleProjects.filter((project) =>
            entry.data.relatedProjects.some((ref) => ref.id === project.id)
          )
        : [];
    pages.push({
      kind: "entry",
      path: entryPath(entry),
      language: entry.data.language,
      entry,
      alternates: translationsOf(entry, entries),
      relatedPosts,
      relatedProjects,
      lastmod: entry.data.updatedDate ?? entry.data.publishedDate,
    });
  }
  for (const page of pages.filter((page) => page.group)) {
    page.alternates = pages
      .filter((other) => other.group === page.group)
      .map((other) => ({ language: other.language, href: other.path }));
  }
  return pages;
}
