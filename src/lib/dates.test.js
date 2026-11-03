import assert from "node:assert/strict";
import test from "node:test";
import { compareEntries, parseDate } from "./dates.js";

test("aceita os três formatos de data", () => {
  assert.equal(parseDate("2026-11-01"), "2026-11-01");
  assert.equal(parseDate("01-11-2026"), "2026-11-01");
  assert.equal(parseDate("1/11/2026"), "2026-11-01");
});

test("data ausente ou impossível vira null", () => {
  assert.equal(parseDate("00-00-0000"), null);
  assert.equal(parseDate("31-02-2026"), null);
  assert.equal(parseDate(undefined), null);
  assert.equal(parseDate("ontem"), null);
});

test("ordena por data, sem data no fim, empate pela sessão", () => {
  const entries = [
    { session: "Sessão 10", date: "2026-12-20" },
    { session: "Prólogo II", date: null },
    { session: "Sessão 2", date: "2026-11-08" },
    { session: "Prólogo I", date: null },
    { session: "Sessão 9", date: "2026-12-20" },
  ];
  assert.deepEqual(
    entries.sort(compareEntries).map((e) => e.session),
    ["Sessão 2", "Sessão 9", "Sessão 10", "Prólogo I", "Prólogo II"]
  );
});
