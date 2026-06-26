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

/** URL interna canônica para uma nota a partir do seu slug. */
function noteUrl(slug) {
  return `/notas/${slug}/`;
}

module.exports = { slugify, extractWikilinks, noteUrl, WIKILINK_RE };
