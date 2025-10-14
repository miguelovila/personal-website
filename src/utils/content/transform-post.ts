import type { CollectionEntry } from "astro:content";
import type { CardProps } from "@/types";

import { estimateReadingTime } from "./estimate-reading-time";

/**
 * Transforms a post collection entry into props for a card component
 */
export function transformPostToCard(post: CollectionEntry<"posts">): CardProps {
  const images =
    post.data.gallery && post.data.gallery.length > 0
      ? post.data.gallery
      : post.data.coverImage
        ? [post.data.coverImage]
        : ["/images/placeholder.png"];

  return {
    title: post.data.title,
    description: post.data.description,
    image: images.length > 1 ? images : images[0],
    readDuration: estimateReadingTime(post),
    link: `/posts/${post.slug}`,
    loading: "lazy",
  };
}
