import { getCollection, type CollectionEntry } from "astro:content";
import {
  chronological,
  entrySlug,
  isPublished,
  localePath,
  tagSlug,
  type Language,
} from "./publishing";

export type Post = CollectionEntry<"posts">;
export type Project = CollectionEntry<"projects">;
export type Entry = Post | Project;
export interface Alternate {
  language: Language;
  href: string;
}
export const siteURL = "https://miguelovila.pt";

interface SiteContentOptions {
  posts?: boolean;
  projects?: boolean;
}

export const entryPath = (entry: Entry) =>
  localePath(entry.data.language, `${entry.collection}/${entrySlug(entry.id)}`);

export async function getSiteContent(options: SiteContentOptions = {}) {
  const includePosts = options.posts ?? true;
  const includeProjects = options.projects ?? true;
  const [allPosts, allProjects] = await Promise.all([
    includePosts ? getCollection("posts") : Promise.resolve([] as Post[]),
    includeProjects ? getCollection("projects") : Promise.resolve([] as Project[]),
  ]);
  const translations = new Set<string>();
  for (const entry of [...allPosts, ...allProjects]) {
    entrySlug(entry.id);
    if (!entry.id.startsWith(`${entry.data.language}/`)) {
      throw new Error(`${entry.id}: language must match its directory.`);
    }
    entry.data.tags.forEach(tagSlug);
    if (entry.data.translationKey) {
      const key = `${entry.collection}:${entry.data.language}:${entry.data.translationKey}`;
      if (translations.has(key)) throw new Error(`Duplicate translation: ${key}`);
      translations.add(key);
    }
  }
  const visible = (entry: Entry) => import.meta.env.DEV || isPublished(entry.data);
  return {
    posts: allPosts.filter(visible).sort(chronological),
    projects: allProjects.filter(visible).sort(chronological),
  };
}

export function translationsOf(entry: Entry, entries: Entry[]): Alternate[] {
  return entries
    .filter(
      (other) =>
        other.collection === entry.collection &&
        (other.id === entry.id ||
          (entry.data.translationKey && other.data.translationKey === entry.data.translationKey))
    )
    .map((other) => ({ language: other.data.language, href: entryPath(other) }));
}

export function selectedProjects(projects: Project[], language: Language) {
  return projects
    .filter((entry) => entry.data.language === language && entry.data.featured)
    .sort(
      (a, b) =>
        (a.data.featuredOrder ?? Infinity) - (b.data.featuredOrder ?? Infinity) ||
        chronological(a, b)
    )
    .slice(0, 3);
}

export function tagGroups(entries: Entry[], language: Language) {
  const groups = new Map<string, { slug: string; label: string; entries: Entry[] }>();
  for (const entry of entries.filter((item) => item.data.language === language)) {
    for (const tag of new Set(entry.data.tags)) {
      const slug = tagSlug(tag);
      const group = groups.get(slug) ?? { slug, label: tag, entries: [] };
      if (!group.entries.includes(entry)) group.entries.push(entry);
      groups.set(slug, group);
    }
  }
  return [...groups.values()]
    .map((group) => ({ ...group, entries: group.entries.sort(chronological) }))
    .sort((a, b) => a.label.localeCompare(b.label, language));
}
