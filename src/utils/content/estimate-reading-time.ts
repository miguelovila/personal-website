import type { CollectionEntry } from "astro:content";

/**
 * Estimate reading time for a given text
 */
export function estimateReadingTime<T extends "projects" | "posts">(
  c: CollectionEntry<T>
): number {
    const wordsPerMinute = 200;
    const numberOfWords = c.body.split(/\s+/).length;
    const minutes = Math.ceil(numberOfWords / wordsPerMinute);

  return (
    minutes
  );
}