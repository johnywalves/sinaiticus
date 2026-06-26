const markdownIt = require("markdown-it");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { slugify, noteUrl } = require("./lib/wikilinks");

/**
 * Plugin markdown-it: converte [[alvo]] e [[alvo|texto]] em links HTML
 * internos apontando para /notas/<slug>/.
 *
 * Implementado como uma regra inline (executa antes da regra de `link`),
 * então funciona em qualquer lugar do texto, inclusive dentro de listas.
 */
function wikilinkPlugin(md) {
  md.inline.ruler.before("link", "wikilink", function wikilinkRule(state, silent) {
    const start = state.pos;
    const src = state.src;
    // precisa começar com "[["
    if (src.charCodeAt(start) !== 0x5b || src.charCodeAt(start + 1) !== 0x5b) {
      return false;
    }
    const end = src.indexOf("]]", start + 2);
    if (end === -1) return false;

    const inner = src.slice(start + 2, end);
    if (inner.includes("[") || inner.includes("\n")) return false;

    if (!silent) {
      const [targetRaw, labelRaw] = inner.split("|");
      const target = targetRaw.trim();
      const label = (labelRaw || targetRaw).trim();
      const slug = slugify(target);
      const token = state.push("html_inline", "", 0);
      token.content = `<a class="wikilink" href="${noteUrl(slug)}">${md.utils.escapeHtml(
        label,
      )}</a>`;
    }
    state.pos = end + 2;
    return true;
  });
}

module.exports = function (eleventyConfig) {
  // Markdown com wikilinks
  const md = markdownIt({ html: true, linkify: true, typographer: true }).use(
    wikilinkPlugin,
  );
  eleventyConfig.setLibrary("md", md);

  // Reescreve URLs root-relative no HTML final para respeitar o pathPrefix.
  // Isso faz os wikilinks e links internos funcionarem em sites de projeto
  // do GitHub Pages (servidos em /<repo>/) sem precisar do filtro `url`.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Index de busca gerado pelo build-index.js vai para o site final
  eleventyConfig.addPassthroughCopy({ "src/searchIndex.json": "searchIndex.json" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Coleção com todas as notas
  eleventyConfig.addCollection("notas", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/notas/**/*.md")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || "")),
  );

  // Notas agrupadas por categoria (para a sidebar), em ordem definida.
  const CATEGORY_ORDER = [
    "Plano de Estudos",
    "Frontend",
    "Backend",
    "DevOps",
    "Snippets",
  ];
  eleventyConfig.addCollection("notasByCategory", (collectionApi) => {
    const notes = collectionApi.getFilteredByGlob("src/notas/**/*.md");
    const groups = {};
    for (const note of notes) {
      const cat = note.data.category || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(note);
    }
    for (const cat of Object.keys(groups)) {
      groups[cat].sort((a, b) =>
        (a.data.title || "").localeCompare(b.data.title || ""),
      );
    }
    const ordered = [];
    for (const cat of CATEGORY_ORDER) {
      if (groups[cat]) {
        ordered.push({ category: cat, notes: groups[cat] });
        delete groups[cat];
      }
    }
    for (const cat of Object.keys(groups).sort((a, b) => a.localeCompare(b))) {
      ordered.push({ category: cat, notes: groups[cat] });
    }
    return ordered;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // ajustado pelo workflow do GitHub Pages via --pathprefix, se necessário
    pathPrefix: "/",
  };
};
