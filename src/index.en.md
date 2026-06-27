---
title: Codex Gigas
description: A digital garden of interlinked notes.
layout: base.njk
permalink: /en/
lang: en
altLang: pt
altUrl: /
---

Welcome to **Codex Gigas** — a digital garden of Markdown notes, interlinked by
wikilinks and with offline search.

## Notes

<ul>
{%- for nota in collections.notasEn %}
  <li><a href="{{ nota.url }}">{{ nota.data.title }}</a></li>
{%- endfor %}
</ul>

Start with [[advanced-react|Advanced React]] or explore the
[[react-performance|performance notes]].
