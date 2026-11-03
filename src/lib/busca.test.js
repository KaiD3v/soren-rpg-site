import assert from "node:assert/strict";
import test from "node:test";
import { normalize, search } from "./busca.js";

const docs = [
  { title: "Sir Velarian Voss", text: "Adorado no Charco pela caridade." },
  { title: "Faisão Negro do Pântano", text: "Imita vozes de gente e ataca." },
  { title: "Nox", text: "Pertencia a Voss, que a mantinha por tradição." },
];

test("normalize tira acentos e maiúsculas", () => {
  assert.equal(normalize("Pântano FAISÃO"), "pantano faisao");
});

test("busca ignora acento e põe quem casa no título primeiro", () => {
  const hits = search(docs, "voss");
  assert.deepEqual(hits.map((h) => h.title), ["Sir Velarian Voss", "Nox"]);
  assert.equal(search(docs, "pantano")[0].title, "Faisão Negro do Pântano");
});

test("o trecho recorta o texto original em volta da ocorrência", () => {
  const [hit] = search(docs, "tradicao");
  assert.equal(hit.snippet.match, "tradição");
  assert.equal(hit.snippet.before, "Pertencia a Voss, que a mantinha por ");
});

test("busca curta demais não devolve nada", () => {
  assert.deepEqual(search(docs, "v"), []);
});
