---
title: "Pagefind Lab"
description: "A local search sandbox for testing bilingual content, accents, filters, and empty states."
language: en
translationKey: pagefind-lab
draft: false
publishedDate: 2026-07-12
updatedDate: 2026-08-27
status: completed
featured: true
featuredOrder: 3
technologies: [Pagefind, Astro, TypeScript, MDX]
tags: [search, pagefind, accessibility, bilingual]
repositoryUrl: https://github.com/miguelovila/seed-pagefind-lab
liveUrl: https://example.com/pagefind-lab
coverImage: ../../assets/seed-pagefind-lab.png
coverImageAlt: "Dashboard mockup for a two-language local search index."
shareImage: ../../assets/seed-pagefind-lab.png
gallery:
  - image: ../../assets/seed-architecture-flow.svg
    alt: "Diagram showing content moving from frontmatter to build output to search."
    caption: "The search index follows the same published-content filter as routes and feeds."
  - image: ../../assets/seed-mdx-island.svg
    alt: "Grid diagram representing an MDX island embedded in a page."
    caption: "Hydrated islands and static content need to coexist without layout surprises."
---

## Overview

Pagefind Lab is the fake project that makes the search modal sweat a little. It has English and Portuguese content, accents, tags, related pages, and enough entries to expose pagination and indexing mistakes.

## The problem

Search can look done when it only has three pages. A proper test needs boring cases: no results, accented words, multiple languages, old posts, recent posts, and content with code blocks.

## Approach and decisions

The project uses the site's real build output as the source of truth. If a page is not published, it should not appear in the index, feeds, related content, or sitemap.

```ts
export function canIndex(entry: Entry) {
  return !entry.data.draft && entry.data.publishedDate <= new Date();
}
```

## Results

This seeded project checks the featured project rail, search filters, gallery rendering, and translated project links.

## Lessons and next steps

The next useful test would be an intentionally unavailable search index, because graceful failure is part of the interface too.
