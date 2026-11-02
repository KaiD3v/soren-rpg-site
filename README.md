# Dossiê Arcano: Soren [Vaelor] Alkahest

Site do personagem em React + Vite + Tailwind 3.4. Duas lentes visuais: Máscara Racional (gótico, brasa) e Ressonância do Colar (cristal, abismo), trocadas pelo botão do colar.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
npm test        # testes do frontmatter e da tinta invisível
```

## Estrutura

- `src/pages/` uma página por seção (Matriz, Crônica, Casa Vaelor, Atlas, Diário)
- `src/data/` textos da lore (personagens, castas, atos, mapas)
- `src/components/` barra superior, pingente do colar, partículas de fundo, ornamentos e lightbox
- `src/diario/` as entradas do diário, uma por arquivo `.md`
- `public/assets/` imagens
- `public/sons/` efeitos sonoros e `public/musica/` os temas (House of Ashen Vows na Máscara, Lost Lullaby na Ressonância), todos gerados no ElevenLabs; volumes e reprodução em `src/lib/sound.js`

## Postar no Diário

Crie `src/diario/<slug>.md`. O nome do arquivo vira a URL (`/diario/<slug>`):

```md
---
session: Sessão 01
date: 2026-11-08
title: Título da Entrada
location: Onde a sessão aconteceu
---

Texto em Markdown, na voz do Soren. *itálico*, **negrito**, > citações, listas, ---

O que ele escreve e ||o que ele não admite|| fica na mesma frase.
```

- `date` (AAAA-MM-DD) define a ordem no livro e no sumário. O link `/diario/<slug>` abre o livro direto na entrada.
- `location` é opcional e aparece abaixo da data, no topo da entrada.
- `||texto||` é tinta invisível: aparece rasurado na Máscara e só se revela ao tocar o colar.
- O diário é paginado automaticamente; uma entrada longa ocupa quantas páginas precisar.
- Imagens: coloque o arquivo em `public/assets/diario/` e escreva `![legenda](/assets/diario/arquivo.webp)`. Ela aparece como esboço colado na página, com a legenda embaixo, sempre inteira numa página só (no máximo ~55% da altura).
