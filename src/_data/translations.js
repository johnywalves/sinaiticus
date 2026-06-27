/**
 * Dado global: quais slugs conceituais existem em cada idioma.
 *
 * Globa as notas em src/notas/ e separa por idioma (sufixo .en) usando a mesma
 * regra de build-index.js (lib/wikilinks parseFile). É consumido pela directory
 * data das notas (para decidir o destino do seletor de idioma) e espelha o
 * conjunto de slugs EN que o transform de wikilinks usa em .eleventy.js.
 *
 * Retorna: { pt: ["slug-a", ...], en: ["slug-b", ...] }.
 */
const path = require("path");
const { globSync } = require("glob");
const { parseFile } = require("../../lib/wikilinks");

module.exports = function () {
  const files = globSync(path.join(__dirname, "..", "notas", "**", "*.md"), {
    nodir: true,
  });
  const byLang = { pt: new Set(), en: new Set() };
  for (const file of files) {
    const { lang, conceptSlug } = parseFile(path.basename(file, ".md"));
    byLang[lang].add(conceptSlug);
  }
  return {
    pt: [...byLang.pt].sort(),
    en: [...byLang.en].sort(),
  };
};
