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
const { slugify, extractWikilinks, noteUrl, parseFile } = require("./lib/wikilinks");

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
    // O idioma vem do sufixo do arquivo (.en); o slug conceitual é compartilhado
    // entre as duas línguas, então os grafos PT e EN ficam em paralelo.
    const parsed = parseFile(path.basename(file, ".md"));
    const lang = parsed.lang;
    const slug = data.slug ? slugify(data.slug) : parsed.conceptSlug;
    const title = data.title || slug;
    return {
      file,
      lang,
      slug,
      url: noteUrl(slug, lang),
      title,
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      links: extractWikilinks(content),
      text: stripMarkdown(content),
    };
  });
}

function buildBacklinks(notes) {
  // Grafos paralelos por idioma: um backlink só conecta notas do mesmo idioma.
  const backlinks = { pt: {}, en: {} };
  const existing = { pt: new Set(), en: new Set() };
  for (const note of notes) existing[note.lang].add(note.slug);
  for (const note of notes) backlinks[note.lang][note.slug] = [];

  for (const note of notes) {
    const seen = new Set();
    for (const link of note.links) {
      if (seen.has(link.slug)) continue; // evita duplicar a mesma origem
      seen.add(link.slug);
      if (!backlinks[note.lang][link.slug]) {
        // alvo não existe nesse idioma (cai no fallback ao renderizar) — ignora
        continue;
      }
      backlinks[note.lang][link.slug].push({
        slug: note.slug,
        title: note.title,
        url: note.url,
      });
    }
  }

  // ordena por título para uma saída estável
  for (const lang of Object.keys(backlinks)) {
    for (const slug of Object.keys(backlinks[lang])) {
      backlinks[lang][slug].sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  // alerta sobre wikilinks de fato quebrados (alvo inexistente em qualquer idioma)
  for (const note of notes) {
    for (const link of note.links) {
      if (!existing.pt.has(link.slug) && !existing.en.has(link.slug)) {
        console.warn(
          `⚠  wikilink quebrado em "${note.lang}/${note.slug}": [[${link.target}]] -> ${link.slug}`,
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
    lang: n.lang,
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
