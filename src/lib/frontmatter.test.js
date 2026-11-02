import assert from "node:assert/strict";
import test from "node:test";
import { parseFrontmatter } from "./frontmatter.js";

test("lê metadados e corpo", () => {
  const { meta, body } = parseFrontmatter('---\r\ntitle: "Fogo: e cinzas"\r\ndate: 2026-11-01\r\n---\r\n\nTexto.');
  assert.deepEqual(meta, { title: "Fogo: e cinzas", date: "2026-11-01" });
  assert.equal(body, "\nTexto.");
});

test("sem frontmatter devolve o texto inteiro", () => {
  assert.deepEqual(parseFrontmatter("# Só texto"), { meta: {}, body: "# Só texto" });
});
