/**
 * Dicionário de strings da interface por idioma + rótulos de categoria.
 *
 * No template: `{% set t = i18n[lang] %}` e usa `t.<chave>`. As CHAVES de
 * categoria do front matter não mudam (vocabulário controlado); só o rótulo
 * exibido é traduzido via `t.categories[chave]`.
 */
module.exports = {
  pt: {
    htmlLang: "pt-BR",
    tagline: "🪴 Codex Gigas",
    searchLink: "🔍 Buscar",
    navGeneral: "Geral",
    navLabel: "☰ Navegação",
    navHome: "Início",
    navSearch: "Buscar",
    backlinks: "↩ Mencionada em",
    toc: "Nesta página",
    searchPlaceholder: "Buscar nas notas…",
    searchEmpty: "Nenhum resultado.",
    footer: "Construído com Eleventy · busca por Lunr.js",
    switchTo: "Ver em inglês",
    categories: {
      "Plano de Estudos": "Plano de Estudos",
      Frontend: "Frontend",
      Backend: "Backend",
      DevOps: "DevOps",
      Snippets: "Snippets",
      Outros: "Outros",
    },
  },
  en: {
    htmlLang: "en",
    tagline: "🪴 Codex Gigas",
    searchLink: "🔍 Search",
    navGeneral: "General",
    navLabel: "☰ Navigation",
    navHome: "Home",
    navSearch: "Search",
    backlinks: "↩ Mentioned in",
    toc: "On this page",
    searchPlaceholder: "Search the notes…",
    searchEmpty: "No results.",
    footer: "Built with Eleventy · search by Lunr.js",
    switchTo: "View in Portuguese",
    categories: {
      "Plano de Estudos": "Study Plan",
      Frontend: "Frontend",
      Backend: "Backend",
      DevOps: "DevOps",
      Snippets: "Snippets",
      Outros: "Other",
    },
  },
};
