import { Marked } from "marked";

// ||texto|| vira tinta invisível: rasurada na Máscara, revelada pela Ressonância do Colar.
const invisibleInk = {
  name: "tinta",
  level: "inline",
  start: (src) => src.indexOf("||"),
  tokenizer(src) {
    const match = /^\|\|([^|\n][\s\S]*?)\|\|/.exec(src);
    if (match) return { type: "tinta", raw: match[0], tokens: this.lexer.inlineTokens(match[1]) };
  },
  renderer(token) {
    return `<span class="tinta">${this.parser.parseInline(token.tokens)}</span>`;
  },
};

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ![legenda](caminho) vira um esboço colado na página, com a legenda escrita embaixo.
// Spans (não figure): o Markdown põe a imagem dentro de um <p>, onde figure não é permitido.
// "/public/..." é aceito por engano comum: o Vite serve a pasta public/ na raiz do site.
const sketch = {
  image({ href: rawHref, text }) {
    const href = rawHref.replace(/^\/public\//, "/");
    const caption = text ? `<span class="esboco-legenda">${escape(text)}</span>` : "";
    return `<span class="esboco"><img src="${escape(href)}" alt="${escape(text)}" />${caption}</span>`;
  },
};

// [[slug]] ou [[slug|texto]] aponta para um verbete do compêndio. Aqui vira um marcador;
// linkVerbetes() troca pelo link de verdade (ou por "ainda não escrito") quando os verbetes são conhecidos.
const verbeteLink = {
  name: "verbete",
  level: "inline",
  start: (src) => src.indexOf("[["),
  tokenizer(src) {
    const match = /^\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/.exec(src);
    if (match) return { type: "verbete", raw: match[0], slug: match[1], text: match[2] ?? "" };
  },
  renderer: ({ slug, text }) => `<a class="verbete-link" data-verbete="${slug}">${escape(text)}</a>`,
};

const marked = new Marked({ extensions: [invisibleInk, verbeteLink], renderer: sketch });

export const renderMarkdown = (md) => marked.parse(md);
export const renderInline = (md) => marked.parseInline(md);

/** lookup(slug) -> { href, title } | undefined */
export const linkVerbetes = (html, lookup) =>
  html.replace(/<a class="verbete-link" data-verbete="([a-z0-9-]+)">([^<]*)<\/a>/g, (_, slug, text) => {
    const target = lookup(slug);
    if (!target) return `<span class="verbete-ausente" title="Verbete ainda não escrito">${text || slug}</span>`;
    return `<a class="verbete-link" href="${target.href}">${text || escape(target.title)}</a>`;
  });
