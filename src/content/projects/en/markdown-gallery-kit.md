---
title: "Markdown Gallery Kit"
description: "A tiny content pattern for image sets, captions, and project writeups that should not need a CMS."
language: en
draft: false
publishedDate: 2026-03-19
status: completed
featured: false
technologies: [MDX, Astro, Tailwind]
tags: [images, mdx, content, design]
repositoryUrl: https://github.com/miguelovila/seed-markdown-gallery-kit
coverImage: ../../assets/seed-markdown-gallery-kit.png
coverImageAlt: "A grid mockup for captioned Markdown gallery images."
shareImage: ../../assets/seed-markdown-gallery-kit.png
gallery:
  - image: ../../assets/seed-gallery-wireframe.svg
    alt: "Wireframe grid showing several gallery cards."
    caption: "The gallery is deliberately simple: image first, caption nearby, link to the original."
  - image: ../../assets/seed-mdx-island.svg
    alt: "A grid diagram representing MDX content blocks."
    caption: "MDX stays useful when it does not ask every post to become an application."
---

## Overview

Markdown Gallery Kit is a fake project for testing project galleries with multiple images and captions.

## The problem

Screenshots are useful, but galleries often hide context. A caption should explain why the image matters.

## Approach and decisions

The content stays in frontmatter. Each image gets an alt text and an optional caption, and the template owns the layout.

## Implementation

```md
gallery:

- image: ../../assets/detail.png
  alt: "Describe the visible detail."
  caption: "Explain why this detail matters."
```

## Results

This page is intentionally media-heavy to test image spacing, captions, and lazy loading.

## Lessons and next steps

If a gallery needs more than this, the project probably needs a case study section instead.
