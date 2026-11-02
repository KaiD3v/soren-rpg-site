import assert from "node:assert/strict";
import test from "node:test";
import { renderMarkdown } from "./markdown.js";

test("||texto|| vira tinta invisível, com markdown dentro", () => {
  assert.equal(renderMarkdown("Antes ||o *colar* esquentou|| depois."), '<p>Antes <span class="tinta">o <em>colar</em> esquentou</span> depois.</p>\n');
});

test("texto sem || fica intacto", () => {
  assert.equal(renderMarkdown("Só dados."), "<p>Só dados.</p>\n");
});

test("![legenda](caminho) vira esboço com legenda", () => {
  assert.equal(
    renderMarkdown('![Mapa "rabiscado"](/assets/diario/mapa.webp)'),
    '<p><span class="esboco"><img src="/assets/diario/mapa.webp" alt="Mapa &quot;rabiscado&quot;" /><span class="esboco-legenda">Mapa &quot;rabiscado&quot;</span></span></p>\n'
  );
});

test("imagem sem legenda não cria legenda vazia", () => {
  assert.equal(renderMarkdown("![](/a.webp)"), '<p><span class="esboco"><img src="/a.webp" alt="" /></span></p>\n');
});

test("caminho com /public/ é corrigido para a raiz do site", () => {
  assert.match(renderMarkdown("![x](/public/assets/a.webp)"), /src="\/assets\/a\.webp"/);
});

test("[[slug]] vira link com o título do verbete; inexistente vira 'ainda não escrito'", async () => {
  const { linkVerbetes } = await import("./markdown.js");
  const lookup = (slug) => (slug === "mandragora" ? { href: "/compendio/alquimia/mandragora", title: "Raiz de Mandrágora" } : undefined);
  assert.equal(
    linkVerbetes(renderMarkdown("Usei [[mandragora]] e [[mandragora|a raiz]] com [[sumido]]."), lookup),
    '<p>Usei <a class="verbete-link" href="/compendio/alquimia/mandragora">Raiz de Mandrágora</a> e ' +
      '<a class="verbete-link" href="/compendio/alquimia/mandragora">a raiz</a> com ' +
      '<span class="verbete-ausente" title="Verbete ainda não escrito">sumido</span>.</p>\n'
  );
});
