---
title: "Rust Notes From Someone Who Still Reaches For Bash"
description: "A fake learning note about using Rust for the parts that deserve structure and Bash for the parts that want to stay glue."
language: en
draft: false
publishedDate: 2026-07-04
featured: false
tags: [rust, bash, cli, learning]
relatedProjects: [en/dotfiles-workbench, en/linux-battery-ledger]
coverImage: ../../assets/seed-rust-bash.png
coverImageAlt: "A terminal mockup showing Rust and Bash notes."
shareImage: ../../assets/seed-rust-bash.png
---

Rust is excellent when the shape of the problem deserves a type system. Bash is excellent when the shape of the problem is three commands and a grudge.

## The Rust-shaped part

Parsing a small config file felt better with a type:

```rust
#[derive(Debug)]
struct Task {
    name: String,
    command: String,
    timeout_ms: u64,
}
```

## The Bash-shaped part

Running the command still wanted to be plain:

```bash
cargo run -- check dotfiles.toml
git diff --stat
```

## The compromise

The useful boundary is usually this: Rust owns parsing and decisions, Bash owns tiny local rituals. When either side starts performing, the tool gets heavier.

## What this seed checks

This article adds Rust highlighting, Bash highlighting, related projects, and a few short paragraphs to vary list density.
