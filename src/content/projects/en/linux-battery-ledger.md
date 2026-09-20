---
title: "Linux Battery Ledger"
description: "A small local ledger for battery drain, charge cycles, and laptop habits I keep pretending are scientific."
language: en
draft: false
publishedDate: 2026-04-11
status: archived
featured: false
technologies: [Linux, Python, SQLite]
tags: [linux, data, sqlite, cli]
repositoryUrl: https://github.com/miguelovila/seed-linux-battery-ledger
coverImage: ../../assets/seed-battery-ledger.png
coverImageAlt: "A dark dashboard mockup with a battery tracking chart."
shareImage: ../../assets/seed-battery-ledger.png
gallery:
  - image: ../../assets/seed-terminal-panel.svg
    alt: "Terminal panel with battery log output."
    caption: "The command line version was the only version that deserved to exist."
---

## Overview

Linux Battery Ledger is a fake archived project for testing old work that still has a useful page.

## The problem

Battery anecdotes are not data. They are also not nothing. This project sits in the middle and keeps a small log of what changed.

## Approach and decisions

It stores daily snapshots from system files and turns them into a plain report.

```python
from pathlib import Path

capacity = Path("/sys/class/power_supply/BAT0/capacity").read_text().strip()
print(f"battery={capacity}%")
```

## Results

The archived state should look intentional, not broken. This seed checks that status styling.

## Lessons and next steps

The project stops here because the useful part is a log, not another daemon.
