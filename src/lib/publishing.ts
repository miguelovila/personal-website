export type Language = "en" | "pt";
export const languages: Language[] = ["en", "pt"];
export const pageSize = 12;
const publicationTime = new Date();

export function isPublished(data: { draft: boolean; publishedDate: Date }, now = publicationTime) {
  return !data.draft && data.publishedDate.getTime() <= now.getTime();
}

export function localePath(language: Language, path = "/") {
  const clean = `/${path.replace(/^\/+|\/+$/g, "")}`;
  const suffix = clean === "/" || /\.[a-z0-9]+$/i.test(clean) ? "" : "/";
  return `${language === "pt" ? "/pt" : ""}${clean}${suffix}`;
}

export function entrySlug(id: string) {
  const match = /^(en|pt)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(id);
  if (!match) throw new Error(`Invalid content ID "${id}". Use en/my-slug.md or pt/my-slug.md.`);
  if (["page", "index"].includes(match[2])) throw new Error(`Reserved content slug: ${id}`);
  return match[2];
}

export function tagSlug(tag: string) {
  const slug = tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error(`Tag "${tag}" needs an alphanumeric character.`);
  return slug;
}

export function readingMinutes(body = "") {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_`>|]/g, " ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200));
}

export function dateLabel(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function chronological<T extends { id: string; data: { publishedDate: Date } }>(a: T, b: T) {
  return (
    b.data.publishedDate.getTime() - a.data.publishedDate.getTime() || a.id.localeCompare(b.id)
  );
}
