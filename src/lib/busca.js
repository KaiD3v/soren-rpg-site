// Índice remissivo: busca sem acento e sem diferença de maiúsculas no texto de todo o arquivo.

export const normalize = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/**
 * docs: [{ title, text, ... }]. Devolve os que contêm a busca (no título primeiro),
 * cada um com `snippet`: { before, match, after } em volta da primeira ocorrência no texto.
 * As posições valem no texto original porque a normalização mantém um caractere por letra.
 */
export function search(docs, query, limit = 20) {
  const q = normalize(query.trim());
  if (q.length < 2) return [];

  const hits = [];
  for (const doc of docs) {
    const inTitle = normalize(doc.title).includes(q);
    const at = normalize(doc.text).indexOf(q);
    if (!inTitle && at === -1) continue;

    let snippet = null;
    if (at !== -1) {
      const start = Math.max(0, at - 60);
      const end = Math.min(doc.text.length, at + q.length + 80);
      snippet = {
        before: (start > 0 ? "…" : "") + doc.text.slice(start, at),
        match: doc.text.slice(at, at + q.length),
        after: doc.text.slice(at + q.length, end) + (end < doc.text.length ? "…" : ""),
      };
    }
    hits.push({ ...doc, snippet, inTitle });
  }
  return hits.sort((a, b) => b.inTitle - a.inTitle).slice(0, limit);
}
