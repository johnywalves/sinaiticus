/**
 * Directory data das notas (src/notas/**).
 *
 * Deriva idioma e slug conceitual do nome do arquivo (sufixo .en) e computa:
 *  - lang / conceptSlug
 *  - permalink localizado: PT em /notas/<slug>/, EN em /en/notas/<slug>/
 *  - altLang / altUrl: para onde o seletor de idioma aponta. Se a contraparte
 *    no outro idioma existir (data.translations), vai direto à nota; senão cai
 *    na home do outro idioma (fallback aprovado, sem 404).
 */
const { parseFile, noteUrl } = require("../../lib/wikilinks");

module.exports = {
  layout: "base.njk",
  eleventyComputed: {
    lang: (data) => parseFile(data.page.fileSlug).lang,
    conceptSlug: (data) => parseFile(data.page.fileSlug).conceptSlug,
    permalink: (data) => {
      const { lang, conceptSlug } = parseFile(data.page.fileSlug);
      return noteUrl(conceptSlug, lang);
    },
    altLang: (data) => (parseFile(data.page.fileSlug).lang === "en" ? "pt" : "en"),
    altUrl: (data) => {
      const { lang, conceptSlug } = parseFile(data.page.fileSlug);
      const other = lang === "en" ? "pt" : "en";
      const hasCounterpart = (data.translations[other] || []).includes(conceptSlug);
      if (hasCounterpart) return noteUrl(conceptSlug, other);
      return other === "en" ? "/en/" : "/"; // fallback: home do outro idioma
    },
  },
};
