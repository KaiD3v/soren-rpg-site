import { resolveVerbetes } from "./compendium.js";
import { compareEntries, parseDate } from "./dates.js";
import { renderMarkdown } from "./markdown.js";
import { parseFrontmatter } from "./frontmatter.js";

// Cada arquivo em src/diario/*.md vira uma entrada; o nome do arquivo é a URL (/diario/<slug>).
// [[verbete]] no texto aponta para o compêndio.
const files = import.meta.glob("../diario/*.md", { query: "?raw", import: "default", eager: true });

export const ENTRIES = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      ...meta,
      date: parseDate(meta.date), // normalizada para AAAA-MM-DD, ou null sem data
      slug: path.split("/").pop().replace(/\.md$/, ""),
      html: resolveVerbetes(renderMarkdown(body)),
    };
  })
  .sort(compareEntries);
