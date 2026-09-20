---
title: "Dotfiles Workbench"
description: "A scripted workbench for testing shell configuration changes before they land on a real laptop."
language: en
draft: false
publishedDate: 2026-07-30
updatedDate: 2026-08-02
status: completed
featured: true
featuredOrder: 2
technologies: [Linux, Shell, Python, Rust, Git]
tags: [linux, dotfiles, shell, automation]
repositoryUrl: https://github.com/miguelovila/seed-dotfiles-workbench
coverImage: ../../assets/seed-dotfiles-workbench.png
coverImageAlt: "A terminal mockup showing a successful dotfiles build."
shareImage: ../../assets/seed-dotfiles-workbench.png
gallery:
  - image: ../../assets/seed-terminal-panel.svg
    alt: "Terminal panel with fake command output."
    caption: "The test harness treats shell output as an interface."
---

## Overview

Dotfiles Workbench is a pretend project for testing a very real concern: changing a shell setup without breaking the next login.

## The problem

Personal configuration grows quietly. One day a tiny alias depends on another tiny alias, and the whole stack starts feeling like a machine held together with memory.

## Approach and decisions

The workbench creates disposable homes, copies only the files under test, and runs a short checklist. The harness is mostly Shell and Python, with a tiny Rust parser for stricter config checks. The goal is not perfect simulation; it is catching the loud mistakes.

## Implementation

```bash
workspace="$(mktemp -d)"
HOME="$workspace/home" ./install.sh
HOME="$workspace/home" zsh -lc 'type rg && git config user.name'
```

That command is deliberately boring. Boring is good when the thing being tested is what opens every terminal.

## Results

This entry checks completed project badges, Shell and Linux filters, a cover image, and a gallery with a single item.

## Lessons and next steps

The fake lesson is the real one: dotfiles should be easy to remove, easy to inspect, and suspicious of cleverness.
