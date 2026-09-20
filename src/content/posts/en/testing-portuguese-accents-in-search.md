---
title: "Testing Portuguese Accents In Search"
description: "A seed post with coração, ação, informação, and enough repeated words to verify accent-aware search behavior."
language: en
draft: false
publishedDate: 2026-05-02
featured: false
tags: [search, portuguese, pagefind, testing]
relatedProjects: [en/pagefind-lab]
coverImage: ../../assets/seed-portuguese-search.png
coverImageAlt: "A terminal mockup with Portuguese search words."
shareImage: ../../assets/seed-portuguese-search.png
---

The point of this seed is simple: search should not become fragile the moment a word has an accent.

## The words

Here are the test words, written with accents on purpose:

- coração
- ação
- informação
- configuração
- navegação

## The plain version

A user might type `coracao`, `acao`, or `configuracao`. The site should make that path feel ordinary.

## The language boundary

This English article mentions Portuguese words, but it should still live in the English search index and English RSS feed.

## The test query

Search for `coração`, then search for `coracao`. The results should tell us whether the index and UI agree about language and accents.
