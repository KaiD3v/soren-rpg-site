# Dossiê Arcano: Soren [Vaelor] Alkahest

Site do personagem em React + Vite + Tailwind 3.4 (mesma versão do CDN do site original).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
npm test        # testes do parser de frontmatter
```

## Estrutura

- `src/pages/` uma página por aba (Matriz, História, Castas, Mapas, Diário)
- `src/data/` textos da lore (personagens, castas, atos, mapas)
- `src/components/` cabeçalho, lightbox e o leitor de capítulos (usado por História e Diário)
- `src/diario/` as entradas do diário, uma por arquivo `.md`
- `public/assets/` imagens

## Postar no Diário

Crie `src/diario/<slug>.md`. O nome do arquivo vira a URL (`/diario/<slug>`):

```md
---
session: Sessão 01
date: 2026-11-08
title: Título da Entrada
location: Onde a sessão aconteceu
summary: Uma linha que aparece na lista lateral.
---

Texto em Markdown, na voz do Soren. *itálico*, **negrito**, > citações, listas, ---
```

- `date` (AAAA-MM-DD) define a ordem; a mais recente abre por padrão.
- `location` e `summary` são opcionais.
