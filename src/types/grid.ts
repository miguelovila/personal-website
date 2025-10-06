import type { CollectionEntry } from "astro:content";
import type { CardProps } from "./card";

/**
 * Generic props for grid components that display collections
 * @template T - The collection name (e.g., "projects", "posts")
 */
export interface GridProps<T extends "projects" | "posts"> {
  /** The name of the Astro content collection to fetch */
  collectionName: T;

  /** Function to transform collection entries into CardProps */
  transformFn: (entry: CollectionEntry<T>) => CardProps;

  /** Filter to show only featured items */
  onlyFeatured?: boolean;

  /** Optional sorting function for the collection entries */
  sortFn?: (a: CollectionEntry<T>, b: CollectionEntry<T>) => number;

  /** Maximum number of items to display */
  limit?: number | null;

  /** CSS classes to apply to the grid container */
  gridClasses?: string;

  /** Number of items to load with eager loading strategy */
  eagerLoadCount?: number;
}
