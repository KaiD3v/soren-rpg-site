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

const marked = new Marked({ extensions: [invisibleInk], renderer: sketch });

export const renderMarkdown = (md) => marked.parse(md);
