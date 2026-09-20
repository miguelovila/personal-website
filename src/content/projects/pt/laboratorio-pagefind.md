---
title: "Laboratório Pagefind"
description: "Um laboratório fictício para testar pesquisa local bilingue, acentos, filtros e estados vazios."
language: pt
translationKey: pagefind-lab
draft: false
publishedDate: 2026-07-12
updatedDate: 2026-08-27
status: completed
featured: true
featuredOrder: 2
technologies: [Pagefind, Astro, TypeScript, MDX]
tags: [pesquisa, pagefind, acessibilidade, bilingue]
repositoryUrl: https://github.com/miguelovila/seed-pagefind-lab
liveUrl: https://example.com/laboratorio-pagefind
coverImage: ../../assets/seed-laboratorio-pagefind.png
coverImageAlt: "Um painel fictício para um índice de pesquisa em duas línguas."
shareImage: ../../assets/seed-laboratorio-pagefind.png
gallery:
  - image: ../../assets/seed-architecture-flow.svg
    alt: "Diagrama com conteúdo a passar por frontmatter, build e pesquisa."
    caption: "A pesquisa deve respeitar a mesma regra de publicação que as rotas e feeds."
---

## Visão geral

Laboratório Pagefind é o projeto falso que garante que a pesquisa em português não fica esquecida.

## O problema

Pesquisar por "coracao" deve encontrar "coração", e a versão portuguesa não deve misturar resultados ingleses.

## Abordagem e decisões

O conteúdo publicado é a origem da verdade. Se uma entrada não aparece no site final, também não aparece no índice.

## Implementação

```ts
const normalized = query.normalize("NFD").replace(/\p{Diacritic}/gu, "");
```

## Resultados

Esta entrada testa acentos, filtros, galeria e ligações de tradução.

## Lições e próximos passos

O próximo teste útil é simular um índice indisponível e confirmar que a interface falha com calma.
