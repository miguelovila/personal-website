---
title: "Blog Engine Notes"
description: "A pile of routing, content, and metadata experiments disguised as a calm publishing system."
language: en
draft: false
publishedDate: 2026-05-17
updatedDate: 2026-05-30
status: completed
featured: false
technologies: [Astro, MDX, TypeScript, Tailwind]
tags: [astro, mdx, seo, publishing]
repositoryUrl: https://github.com/miguelovila/seed-blog-engine-notes
coverImage: ../../assets/seed-blog-engine-notes.png
coverImageAlt: "Diagram showing content, routes, feeds, and search output."
shareImage: ../../assets/seed-blog-engine-notes.png
gallery:
  - image: ../../assets/seed-architecture-flow.svg
    alt: "Architecture diagram with input, build, and ship stages."
    caption: "The same content rules should feed every public surface."
---

## Overview

Blog Engine Notes is a fake project that exists to test the kind of page this website wants to be good at: explaining the work behind the writing.

## The problem

A portfolio with posts, projects, translations, RSS, and search can drift into several similar-but-not-identical systems.

## Approach and decisions

The project treats frontmatter as the contract. Routes, feeds, related content, and search should all ask the same question: is this entry publishable?

## Implementation

```astro
---
const visiblePosts = posts.filter(isPublished);
---

<PostList entries={visiblePosts} />
```

## Results

This project exercises Astro, MDX, Tailwind, code blocks, and a project gallery while staying safely fictional.

## Lessons and next steps

The fake next step is exactly the real maintenance habit: keep one helper for publication logic, then reuse it everywhere.
