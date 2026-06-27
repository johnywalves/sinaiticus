---
title: Search
layout: base.njk
permalink: /en/search/
lang: en
altLang: pt
altUrl: /search/
---

{%- set t = i18n[lang] -%}
<input id="search-input" type="search" placeholder="{{ t.searchPlaceholder }}" autofocus />

<ul id="search-results"></ul>

<script src="https://unpkg.com/lunr@2.3.9/lunr.js"></script>
<script>
  const INDEX_URL = "{{ '/searchIndex.json' | url }}";
  const PREFIX = "{{ '/' | url }}"; // pathPrefix do site (ex.: "/repo/")
  const LANG = "{{ lang }}"; // filtra os documentos do idioma desta página
  const EMPTY_MSG = "{{ t.searchEmpty }}";
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  let idx = null;
  let docs = [];

  fetch(INDEX_URL)
    .then((r) => r.json())
    .then((data) => {
      docs = data.filter((d) => d.lang === LANG);
      idx = lunr(function () {
        this.ref("id");
        this.field("title", { boost: 10 });
        this.field("tags", { boost: 5 });
        this.field("body");
        docs.forEach((doc) => this.add(doc), this);
      });
      if (input.value) run();
    });

  function snippet(text, q) {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text.slice(0, 140) + "…";
    const start = Math.max(0, i - 60);
    return (start > 0 ? "…" : "") + text.slice(start, start + 160) + "…";
  }

  function run() {
    const q = input.value.trim();
    results.innerHTML = "";
    if (!idx || q.length < 2) return;

    let hits = [];
    try {
      hits = idx.search(q + "*"); // busca por prefixo
    } catch (e) {
      hits = idx.search(q);
    }

    if (hits.length === 0) {
      results.innerHTML = "<li>" + EMPTY_MSG + "</li>";
      return;
    }

    for (const hit of hits.slice(0, 25)) {
      const doc = docs.find((d) => d.id === hit.ref);
      if (!doc) continue;
      const li = document.createElement("li");
      const href = PREFIX.replace(/\/$/, "") + doc.id; // aplica o pathPrefix
      li.innerHTML =
        '<a href="' + href + '">' + doc.title + "</a>" +
        '<div class="snippet">' + snippet(doc.body, q) + "</div>";
      results.appendChild(li);
    }
  }

  input.addEventListener("input", run);
</script>
