---
title: Comandos Git
layout: base.njk
category: Snippets
tags: [git, ferramentas]
---

Anotações rápidas de comandos Git que esqueço com frequência.

```sh
# desfazer o último commit, mantendo as mudanças no working tree
git reset --soft HEAD~1

# ver o histórico de forma compacta
git log --oneline --graph --decorate

# limpar arquivos não rastreados (cuidado!)
git clean -fd
```

Nada aqui depende das outras notas — é uma folha solta do jardim.
