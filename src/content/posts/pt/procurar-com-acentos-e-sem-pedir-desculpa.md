---
title: "Procurar Com Acentos E Sem Pedir Desculpa"
description: "Um artigo falso para testar coração, ação, informação, pesquisa em português e estados vazios localizados."
language: pt
draft: false
publishedDate: 2026-08-06
featured: false
tags: [pesquisa, português, pagefind, acessibilidade]
relatedProjects: [pt/laboratorio-pagefind]
coverImage: ../../assets/seed-portuguese-search.png
coverImageAlt: "Um terminal fictício com palavras portuguesas usadas para testar pesquisa."
shareImage: ../../assets/seed-portuguese-search.png
---

Este artigo existe para testar a pesquisa em português. Coração, ação, informação, configuração e navegação aparecem aqui de propósito.

## A pergunta

Se eu escrever `coracao`, a pesquisa deve aproximar-se de `coração` sem fazer teatro. O mesmo vale para ação, informação e navegação.

## O limite da língua

Os resultados portugueses devem ficar na versão portuguesa. A pesquisa não deve misturar arquivos só porque a palavra também aparece num texto inglês.

## Um pequeno bloco técnico

```ts
const semAcentos = "coração".normalize("NFD").replace(/\p{Diacritic}/gu, "");
```

## O teste manual

Procurar por `coração`, `coracao`, `ação` e `informacao` deve dar resultados úteis nesta língua.
