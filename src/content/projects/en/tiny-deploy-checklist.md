---
title: "Tiny Deploy Checklist"
description: "A compact release checklist for static sites, direct URLs, feeds, redirects, and the tiny panic before launch."
language: en
draft: false
publishedDate: 2026-02-14
status: in-progress
featured: false
technologies: [Shell, Astro, Pagefind]
tags: [deployment, astro, search, checklist]
repositoryUrl: https://github.com/miguelovila/seed-tiny-deploy-checklist
coverImage: ../../assets/seed-deploy-checklist.png
coverImageAlt: "A build pipeline diagram for a small deploy checklist."
shareImage: ../../assets/seed-deploy-checklist.png
gallery:
  - image: ../../assets/seed-architecture-flow.svg
    alt: "Diagram showing input, build, and ship boxes."
    caption: "The checklist begins where the build ends."
---

## Overview

Tiny Deploy Checklist is fake, but the release nerves are not. It is a compact list of things to verify before a static site goes public.

## The problem

The build can pass while the host serves a blank route, a stale asset, or an RSS feed with the wrong base URL.

## Approach and decisions

The checklist stays close to commands and URLs. If a step cannot be verified, it does not belong in the green column.

```bash
bun run build
bun run test:site
curl -I https://example.com/rss.xml
```

## Results

This project tests deployment-related tags and related posts.

## Lessons and next steps

The next step would be turning only the boring checks into automation and leaving the judgment calls to review.
