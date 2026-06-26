#!/usr/bin/env node
/**
 * build-index.js
 * -------------------------------------------------------------------------
 * Lê a árvore de notas em src/notas/, e gera dois artefatos em tempo de build:
 *
 *   1. src/_data/backlinks.json  -> mapa de backlinks (links bidirecionais),
 *      carregado como dado global pelo Eleventy e exibido em cada nota.
 *
 *   2. src/searchIndex.json      -> documentos para o Lunr.js construir o
 *      índice de busca full-text no lado do cliente (offline).
 *
 * Rode antes do `eleventy` (veja os scripts em package.json).
 */
const fs = require("fs");
const path = require("path");
const { globSync } = require("glob");
const matter = require("gray-matter");
const { slugify, extractWikilinks, noteUrl } = require("./lib/wikilinks");

const ROOT = __dirname;
const NOTAS_GLOB = path.join(ROOT, "src", "notas", "**", "*.md");
const DATA_DIR = path.join(ROOT, "src", "_data");
const BACKLINKS_OUT = path.join(DATA_DIR, "backlinks.json");
const SEARCH_OUT = path.join(ROOT, "src", "searchIndex.json");

/** Remove sintaxe Markdown básica para o texto puro da busca. */
function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ") // blocos de código
    .replace(/`[^`]*`/g, " ") // código inline
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g, "$2$1") // wikilinks -> texto
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/imagens md
    .replace(/[#>*_~-]+/g, " ") // marcadores
    .replace(/\s+/g, " ")
    .trim();
}

function readNotes() {
  const files = globSync(NOTAS_GLOB, { nodir: true }).sort();
  return files.map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const slug = slugify(data.slug || path.basename(file, ".md"));
    const title = data.title || slug;
    return {
      file,
      slug,
      url: noteUrl(slug),
      title,
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      links: extractWikilinks(content),
      text: stripMarkdown(content),
    };
  });
}

function buildBacklinks(notes) {
  const bySlug = new Map(notes.map((n) => [n.slug, n]));
  const backlinks = {};
  for (const note of notes) backlinks[note.slug] = [];

  for (const note of notes) {
    const seen = new Set();
    for (const link of note.links) {
      if (seen.has(link.slug)) continue; // evita duplicar a mesma origem
      seen.add(link.slug);
      if (!backlinks[link.slug]) {
        // alvo ainda não existe como nota (link quebrado) — ignora no mapa
        continue;
      }
      backlinks[link.slug].push({
        slug: note.slug,
        title: note.title,
        url: note.url,
      });
    }
  }

  // ordena por título para uma saída estável
  for (const slug of Object.keys(backlinks)) {
    backlinks[slug].sort((a, b) => a.title.localeCompare(b.title));
  }

  // alerta sobre wikilinks quebrados (útil em CI)
  for (const note of notes) {
    for (const link of note.links) {
      if (!bySlug.has(link.slug)) {
        console.warn(
          `⚠  wikilink quebrado em "${note.slug}": [[${link.target}]] -> ${link.slug}`,
        );
      }
    }
  }

  return backlinks;
}

function buildSearchDocs(notes) {
  return notes.map((n) => ({
    id: n.url,
    title: n.title,
    tags: n.tags.join(" "),
    body: n.text,
  }));
}

function main() {
  const notes = readNotes();
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const backlinks = buildBacklinks(notes);
  fs.writeFileSync(BACKLINKS_OUT, JSON.stringify(backlinks, null, 2));

  const docs = buildSearchDocs(notes);
  fs.writeFileSync(SEARCH_OUT, JSON.stringify(docs));

  console.log(
    `✔ ${notes.length} nota(s) processada(s).\n` +
      `  backlinks -> ${path.relative(ROOT, BACKLINKS_OUT)}\n` +
      `  busca     -> ${path.relative(ROOT, SEARCH_OUT)}`,
  );
}

main();
