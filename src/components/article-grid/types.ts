import type { CollectionEntry } from "astro:content";
import type { CardProps } from "@components/article-card/types";

/**
 * Generic props for the ArticleGrid component
 * @template T - The collection name (e.g., "projects", "posts")
 */
export interface ArticleGridProps<T extends "projects" | "posts"> {
  /**
   * The name of the Astro content collection to fetch
   */
  collection_name: T;

  /**
   * Function to transform collection entries into CardProps
   * Allows customization of how each collection type maps to article cards
   */
  transformation_function: (entry: CollectionEntry<T>) => CardProps;

  /**
   * Filter to show only featured items (items with featured: true)
   * @default false
   */
  only_featured?: boolean;

  /**
   * Optional sorting function for the collection entries
   * Receives two collection entries and returns -1, 0, or 1 for sorting
   */
  order_function?: (a: CollectionEntry<T>, b: CollectionEntry<T>) => number;

  /**
   * Maximum number of items to display
   * If null, displays all items (after filtering/sorting)
   * @default null
   */
  number_of_items?: number | null;

  /**
   * CSS classes to apply to the grid container
   * @default "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
   */
  grid_classes?: string;

  /**
   * Number of items to load with eager loading strategy
   * Items beyond this count will use lazy loading for better performance
   * @default 6
   */
  eager_load_count?: number;
}
