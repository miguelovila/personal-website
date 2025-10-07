import type { CollectionEntry } from "astro:content";
import type { CardProps } from "@/types";

import { estimateReadingTime } from "./estimate-reading-time";

/**
 * Transforms a project collection entry into props for a card component
 */
export function transformProjectToCard(
  project: CollectionEntry<"projects">
): CardProps {
  const images =
    project.data.gallery && project.data.gallery.length > 0
      ? project.data.gallery
      : project.data.coverImage
        ? [project.data.coverImage]
        : ["/images/placeholder.png"];

  return {
    title: project.data.title,
    description: project.data.description,
    image: images.length > 1 ? images : images[0],
    readDuration: estimateReadingTime(project),
    link: `/projects/${project.slug}`,
    loading: "lazy",
  };
}
