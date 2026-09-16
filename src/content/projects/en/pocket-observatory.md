---
title: "Pocket Observatory"
description: "A tiny logbook for sky observations, cloudy nights, and the humility of bad visibility."
language: en
draft: false
publishedDate: 2026-06-21
status: in-progress
featured: false
technologies: [React, TypeScript, SQLite]
tags: [react, sqlite, notes, astronomy]
repositoryUrl: https://github.com/miguelovila/seed-pocket-observatory
coverImage: ../../assets/seed-pocket-observatory.png
coverImageAlt: "A dashboard-style mockup for a small observation log."
shareImage: ../../assets/seed-pocket-observatory.png
gallery:
  - image: ../../assets/seed-gallery-wireframe.svg
    alt: "Wireframe cards for an observation list and detail view."
    caption: "The log focuses on what was visible, not on pretending the conditions were better."
---

## Overview

Pocket Observatory is a seed project about recording the sky with very little ceremony.

## The problem

Observation apps can become equipment catalogs. This one starts with the line I would actually write at midnight: "clouds again, but Jupiter was visible for ten minutes."

## Approach and decisions

The model separates the objective fields from the subjective note. That keeps filtering useful while leaving room for the human version of the night.

## Implementation

```ts
type Observation = {
  target: string;
  visibility: "clear" | "mixed" | "clouded";
  note: string;
};
```

## Results

The page is mostly here to test non-featured projects, React and SQLite filters, and ordinary project prose.

## Lessons and next steps

If this were real, export would come before sync. Notes that cannot leave the app are not really yours.
