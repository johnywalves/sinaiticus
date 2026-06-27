const path = require("path");
const { globSync } = require("glob");
const markdownIt = require("markdown-it");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { slugify, noteUrl, parseFile } = require("./lib/wikilinks");

// Slugs conceituais que possuem versão em inglês (src/notas/<slug>.en.md).
// Usado pelo transform que localiza os wikilinks nas páginas EN.
const EN_SLUGS = new Set(
  globSync("src/notas/**/*.en.md").map(
    (f) => parseFile(path.basename(f, ".md")).conceptSlug,
  ),
);

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

  // Localiza wikilinks nas páginas EN: o plugin markdown-it é cego a idioma e
  // sempre emite href="/notas/<slug>/". Aqui, só em páginas sob /en/, reescreve
  // para /en/notas/<slug>/ quando existe contraparte EN; senão mantém o link PT
  // (fallback por link). DEVE rodar antes do HtmlBasePlugin (que aplica o
  // pathPrefix), senão o padrão "/notas/" não casaria mais.
  eleventyConfig.addTransform("localizeWikilinks", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    if (!(this.page.url || "").startsWith("/en/")) return content;
    return content.replace(/href="\/notas\/([^/"]+)\/"/g, (match, slug) =>
      EN_SLUGS.has(slug) ? `href="/en/notas/${slug}/"` : match,
    );
  });

  // Reescreve URLs root-relative no HTML final para respeitar o pathPrefix.
  // Isso faz os wikilinks e links internos funcionarem em sites de projeto
  // do GitHub Pages (servidos em /<repo>/) sem precisar do filtro `url`.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Syntax highlighting (PrismJS em tempo de build, sem JS no cliente).
  // As cores dos tokens estão em assets/style.css, alinhadas ao tema dark.
  eleventyConfig.addPlugin(syntaxHighlight);

  // Index de busca gerado pelo build-index.js vai para o site final
  eleventyConfig.addPassthroughCopy({ "src/searchIndex.json": "searchIndex.json" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Idioma de uma nota a partir do nome do arquivo (sufixo .en).
  const noteLang = (note) => parseFile(note.fileSlug).lang;
  const byTitle = (a, b) => (a.data.title || "").localeCompare(b.data.title || "");

  // Coleções de notas por idioma (usadas pela home e índices de cada locale).
  eleventyConfig.addCollection("notasPt", (api) =>
    api
      .getFilteredByGlob("src/notas/**/*.md")
      .filter((n) => noteLang(n) === "pt")
      .sort(byTitle),
  );
  eleventyConfig.addCollection("notasEn", (api) =>
    api
      .getFilteredByGlob("src/notas/**/*.md")
      .filter((n) => noteLang(n) === "en")
      .sort(byTitle),
  );

  // Notas agrupadas por categoria (para a sidebar), em ordem definida.
  const CATEGORY_ORDER = [
    "Plano de Estudos",
    "Frontend",
    "Backend",
    "DevOps",
    "Snippets",
  ];
  const groupByCategory = (notes) => {
    const groups = {};
    for (const note of notes) {
      const cat = note.data.category || "Outros";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(note);
    }
    for (const cat of Object.keys(groups)) groups[cat].sort(byTitle);
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
  };
  eleventyConfig.addCollection("notasByCategoryPt", (api) =>
    groupByCategory(
      api.getFilteredByGlob("src/notas/**/*.md").filter((n) => noteLang(n) === "pt"),
    ),
  );
  eleventyConfig.addCollection("notasByCategoryEn", (api) =>
    groupByCategory(
      api.getFilteredByGlob("src/notas/**/*.md").filter((n) => noteLang(n) === "en"),
    ),
  );

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
