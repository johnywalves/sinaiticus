---
title: Sinaiticus
description: Um jardim digital de notas interligadas.
layout: base.njk
permalink: /
---

Bem-vindo ao **Sinaiticus** — um jardim digital de notas em Markdown,
interligadas por wikilinks e com busca offline.

## Notas

<ul>
{%- for nota in collections.notas %}
  <li><a href="{{ nota.url }}">{{ nota.data.title }}</a></li>
{%- endfor %}
</ul>

Comece por [[python-decorators|Decorators em Python]] ou explore os
[[git-commands|comandos Git]].
