import type { CollectionEntry } from "astro:content";
import type { CardProps } from "@/types";

/**
 * Transforms a post collection entry into props for a card component
 */
export function transformPostToCard(post: CollectionEntry<"posts">): CardProps {
  return {
    title: post.data.title,
    description: post.data.description,
    image: post.data.coverImage || "/images/placeholder.png",
    readDuration: post.data.readingTime,
    link: `/posts/${post.slug}`,
    loading: "lazy",
  };
}
