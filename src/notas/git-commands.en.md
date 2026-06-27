---
title: Git Commands
layout: base.njk
category: Snippets
tags: [git, ferramentas]
---

Quick notes on Git commands I keep forgetting.

```sh
# undo the last commit, keeping the changes in the working tree
git reset --soft HEAD~1

# view the history in a compact way
git log --oneline --graph --decorate

# clean untracked files (careful!)
git clean -fd
```

Nothing here depends on the other notes — it's a loose leaf of the garden.
