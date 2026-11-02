import { renderMarkdown } from "./markdown.js";
import { parseFrontmatter } from "./frontmatter.js";

// Cada arquivo em src/diario/*.md vira uma entrada; o nome do arquivo é a URL (/diario/<slug>).
const files = import.meta.glob("../diario/*.md", { query: "?raw", import: "default", eager: true });

export const ENTRIES = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return { ...meta, slug: path.split("/").pop().replace(/\.md$/, ""), html: renderMarkdown(body) };
  })
  .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
