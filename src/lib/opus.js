import { resolveVerbetes } from "./compendium.js";
import { parseFrontmatter } from "./frontmatter.js";
import { renderMarkdown } from "./markdown.js";

// As quatro fases da Grande Obra, na ordem. `nivel` é quanto do frasco já está cheio.
export const PHASES = [
  { id: "nigredo", label: "Nigredo", hint: "Recebida. Quase nada se sabe.", nivel: 28 },
  { id: "albedo", label: "Albedo", hint: "Pistas reunidas, hipóteses separadas.", nivel: 50 },
  { id: "citrinitas", label: "Citrinitas", hint: "A causa foi identificada.", nivel: 72 },
  { id: "rubedo", label: "Rubedo", hint: "Obra concluída.", nivel: 100 },
];

// Obra que falhou: vira resíduo, um precipitado turvo que Soren se recusa a jogar fora.
export const RESIDUE = { id: "residuo", label: "Resíduo", hint: "Obra fracassada.", nivel: 18 };

export const phaseOf = (id) => PHASES.find((p) => p.id === id) ?? (id === RESIDUE.id ? RESIDUE : PHASES[0]);

// src/opus/<slug>.md
const files = import.meta.glob("../opus/*.md", { query: "?raw", import: "default", eager: true });

export const QUESTS = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);
    return {
      ...meta,
      slug: path.split("/").pop().replace(/\.md$/, ""),
      phase: phaseOf(meta.fase),
      html: resolveVerbetes(renderMarkdown(body)),
    };
  })
  // Na bancada, a obra mais adiantada primeiro (é a que abre por padrão).
  .sort((a, b) => PHASES.indexOf(b.phase) - PHASES.indexOf(a.phase) || a.title.localeCompare(b.title, "pt-BR"));
