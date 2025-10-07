import type { CollectionEntry } from "astro:content";

/**
 * Sort by published date (newest first)
 */
export function sortByDateDesc<T extends "projects" | "posts">(
  a: CollectionEntry<T>,
  b: CollectionEntry<T>
): number {
  return b.data.publishedDate.getTime() - a.data.publishedDate.getTime();
}

/**
 * Sort by published date (oldest first)
 */
export function sortByDateAsc<T extends "projects" | "posts">(
  a: CollectionEntry<T>,
  b: CollectionEntry<T>
): number {
  return a.data.publishedDate.getTime() - b.data.publishedDate.getTime();
}

/**
 * Sort randomly (for featured content rotation)
 */
export function sortRandom(): number {
  return Math.random() - 0.5;
}
