---
title: "A Small Linux Backup Ritual That Actually Survived Contact With Me"
description: "A fake but believable backup routine with boring commands, clear failure modes, and fewer heroic promises."
language: en
draft: false
publishedDate: 2026-08-29
featured: false
tags: [linux, shell, backups, habits]
relatedProjects: [en/dotfiles-workbench]
coverImage: ../../assets/seed-linux-backup.png
coverImageAlt: "A terminal mockup showing a successful backup command."
shareImage: ../../assets/seed-linux-backup.png
---

This is seed content for layout testing, but I like the rule it pretends to follow: a backup habit only counts if it survives laziness.

## The ritual

The whole flow fits in a terminal and a calendar reminder. No dashboard, no heroic ceremony, no custom cloud mythology.

```bash
set -euo pipefail
rsync -a --delete ~/Documents/ /mnt/archive/documents/
restic backup ~/Projects ~/Pictures
restic check --read-data-subset=1/20
```

## The important part

The important step is not `restic backup`. It is the restore test.

| Check              | Frequency           | Why it exists                      |
| ------------------ | ------------------- | ---------------------------------- |
| List snapshots     | Weekly              | Make sure the repository is alive. |
| Restore one folder | Monthly             | Prove the path works.              |
| Rotate media       | Whenever I remember | Avoid trusting one disk forever.   |

## Things I refuse to automate

I do not want a script that deletes history while I am distracted. Anything destructive should make me read the command twice.

## The fake conclusion

The test value for this post is a normal cover image, a Bash block, a table, and a related project link to the dotfiles workbench.
