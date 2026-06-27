/**
 * Utilitários compartilhados entre o build-index.js (cálculo de backlinks e
 * índice de busca) e o plugin de renderização do Eleventy (.eleventy.js).
 *
 * Mantê-los em um único lugar garante que a resolução de [[wikilinks]] seja
 * idêntica em tempo de build e em tempo de renderização.
 */

/** Converte um texto livre em um slug usável como nome de página/URL. */
function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos (marcas de combinação)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // não-alfanuméricos viram hífen
    .replace(/^-+|-+$/g, ""); // remove hífens das pontas
}

// Captura [[alvo]] e [[alvo|texto exibido]].
const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

/**
 * Extrai todos os wikilinks de um texto Markdown.
 * Retorna uma lista de { target, slug, label }.
 */
function extractWikilinks(markdown) {
  const links = [];
  let match;
  WIKILINK_RE.lastIndex = 0;
  while ((match = WIKILINK_RE.exec(markdown)) !== null) {
    const target = match[1].trim();
    const label = (match[2] || match[1]).trim();
    links.push({ target, slug: slugify(target), label });
  }
  return links;
}

/**
 * URL interna canônica para uma nota a partir do seu slug e idioma.
 * PT (default) fica na raiz: /notas/<slug>/.
 * EN ganha o prefixo de locale: /en/notas/<slug>/.
 */
function noteUrl(slug, lang = "pt") {
  return lang === "en" ? `/en/notas/${slug}/` : `/notas/${slug}/`;
}

/**
 * Deriva o idioma e o slug conceitual a partir do fileSlug de uma nota.
 * A convenção bilíngue usa o sufixo ".en": "react-performance.en" é a versão
 * inglesa de "react-performance". Compartilhado entre build-index.js e a
 * directory data das notas para manter a regra em um só lugar.
 */
function parseFile(fileSlug) {
  const isEn = fileSlug.endsWith(".en");
  const concept = isEn ? fileSlug.slice(0, -3) : fileSlug;
  return { lang: isEn ? "en" : "pt", conceptSlug: slugify(concept) };
}

module.exports = { slugify, extractWikilinks, noteUrl, parseFile, WIKILINK_RE };
