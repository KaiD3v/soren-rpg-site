// Datas das entradas do diário: aceita 2026-11-01, 01-11-2026 e 01/11/2026.
// Devolve "AAAA-MM-DD" (ordenável como texto) ou null para data ausente ou inválida (ex.: 00-00-0000).
export function parseDate(value) {
  const text = String(value ?? "").trim();
  const iso = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(text);
  const br = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(text);
  const [y, m, d] = iso ? [iso[1], iso[2], iso[3]] : br ? [br[3], br[2], br[1]] : [];
  if (!y) return null;

  const date = new Date(Date.UTC(+y, +m - 1, +d));
  const valid = +y > 0 && date.getUTCMonth() === +m - 1 && date.getUTCDate() === +d;
  return valid ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null;
}

// Ordem do livro: pela data; entradas sem data vão para o fim, na ordem de `session`
// (comparação natural: "Prólogo II" depois de "Prólogo I", "Sessão 10" depois de "Sessão 9").
export function compareEntries(a, b) {
  if (a.date && b.date && a.date !== b.date) return a.date.localeCompare(b.date);
  if (!a.date !== !b.date) return a.date ? -1 : 1;
  return String(a.session ?? "").localeCompare(String(b.session ?? ""), "pt-BR", { numeric: true });
}
