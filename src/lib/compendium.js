import { parseFrontmatter } from "./frontmatter.js";
import { linkVerbetes, renderInline, renderMarkdown } from "./markdown.js";

// Seções do Liber Alkahest. `fields` são os campos da ficha técnica, na ordem em que aparecem;
// campo ausente no .md aparece como borrão: Soren ainda não descobriu.
export const SECTIONS = [
  {
    id: "alquimia",
    label: "Alquimia",
    glyph: "🜍",
    intro: "Poções, plantas e reagentes. Tudo o que pode ser destilado, dissolvido ou transmutado.",
    subtitle: "tipo",
    fields: [
      ["tipo", "Tipo"],
      ["raridade", "Raridade"],
      ["efeito", "Efeito"],
      ["ingredientes", "Ingredientes"],
      ["preparo", "Preparo"],
      ["onde", "Onde encontrar"],
    ],
  },
  {
    id: "pessoas",
    label: "Pessoas",
    glyph: "☿",
    intro: "Aliados, companheiros de estrada, inimigos e todos os rostos que cruzaram o caminho.",
    subtitle: "relacao",
    fields: [
      ["relacao", "Relação"],
      ["faccao", "Facção"],
      ["situacao", "Situação"],
      ["onde", "Visto em"],
    ],
  },
  {
    id: "criaturas",
    label: "Criaturas",
    glyph: "🜔",
    intro: "Animais, monstros e espécies. O que caça, o que foge e o que pode ser aproveitado.",
    subtitle: "tipo",
    fields: [
      ["tipo", "Tipo"],
      ["habitat", "Habitat"],
      ["perigo", "Perigo"],
      ["fraquezas", "Fraquezas"],
      ["partes", "Partes aproveitáveis"],
    ],
  },
  {
    id: "pacto",
    label: "O Pacto",
    glyph: "🜏",
    intro: "Qual entidade aceitou as almas de Elian e Lyra? Pistas, hipóteses e o que já foi descartado.",
    subtitle: "status",
    fields: [
      ["status", "Status"],
      ["fonte", "Fonte"],
    ],
  },
];

// src/compendio/<seção>/<slug>.md
const files = import.meta.glob("../compendio/*/*.md", { query: "?raw", import: "default", eager: true });

const raw = Object.entries(files).map(([path, text]) => {
  const [section, file] = path.split("/").slice(-2);
  const { meta, body } = parseFrontmatter(text);
  return { ...meta, section, slug: file.replace(/\.md$/, ""), body };
});

const lookup = (slug) => {
  const target = raw.find((e) => e.slug === slug);
  return target && { href: `/compendio/${target.section}/${target.slug}`, title: target.title };
};

/** HTML de um trecho em Markdown com os [[verbetes]] já resolvidos (usado também pelo diário). */
export const resolveVerbetes = (html) => linkVerbetes(html, lookup);

/** Valor de um campo da ficha (aceita *ênfase*, ||tinta|| e [[verbetes]]). */
export const fieldHtml = (value) => resolveVerbetes(renderInline(value));

export const ENTRIES = raw
  .map(({ body, ...meta }) => ({
    ...meta,
    knowledge: Math.max(0, Math.min(4, Number(meta.conhecimento ?? 4))),
    sealed: meta.selado === "true",
    html: resolveVerbetes(renderMarkdown(body)),
  }))
  .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

/** "a, b , c" -> ["a", "b", "c"] (listas no cabeçalho são separadas por vírgula) */
export const list = (value) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);
