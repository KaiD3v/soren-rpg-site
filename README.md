# Dossiê Arcano: Soren [Vaelor] Alkahest

Site do personagem em React + Vite + Tailwind 3.4. Duas lentes visuais: Máscara Racional (gótico, brasa) e Ressonância do Colar (cristal, abismo), trocadas pelo botão do colar.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
npm test        # testes do frontmatter e da tinta invisível
```

## Estrutura

- `src/pages/` uma página por seção (Matriz, Crônica, Casa Vaelor, Atlas, Diário, Compêndio)
- `src/data/` textos da lore (personagens, castas, atos, mapas)
- `src/components/` barra superior, pingente do colar, partículas de fundo, ornamentos e lightbox
- `src/diario/` as entradas do diário, uma por arquivo `.md`
- `src/compendio/<seção>/` os verbetes do compêndio (Liber Alkahest), um por arquivo `.md`
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

## Escrever no Compêndio (Liber Alkahest)

Crie `src/compendio/<seção>/<slug>.md`, com `<seção>` sendo `alquimia`, `pessoas`, `criaturas` ou `pacto`. A URL fica `/compendio/<seção>/<slug>`.

```md
---
title: Raiz de Mandrágora
tipo: Planta
raridade: Rara
efeito: Sono profundo
conhecimento: 2
imagem: /assets/compendio/mandragora.webp
ver: solvente-alkahest, diabrete
visto: sessao-03
---

Anotações do Soren. Aceita ||tinta invisível||, ![esboços](/assets/...) e [[links-para-verbetes]].
```

Campos da ficha por seção (os que faltarem aparecem como borrão de tinta, ou seja, "Soren ainda não descobriu"):

| Seção | Campos |
|---|---|
| alquimia | `tipo`, `raridade`, `efeito`, `ingredientes`, `preparo`, `onde` |
| pessoas | `relacao`, `faccao`, `situacao`, `onde`, mais `casta` (Éter, Mercúrio, Enxofre, Cinza), `alma` (0 a 100), `veredito` (frase na Máscara) e `sentimento` (frase na Ressonância) |
| criaturas | `tipo`, `habitat`, `perigo`, `fraquezas`, `partes` |
| pacto | `status` (`confirmada`, `hipótese`, `descartada`), `fonte` |

Comuns a todas:
- `conhecimento`: de 0 a 4, aparece como ●●○○.
- `imagem`: a gravura do verbete.
- `ver`: slugs de outros verbetes, separados por vírgula.
- `visto`: slugs de entradas do diário, separados por vírgula.
- `selado: true`: a página fica lacrada com cera e só abre na Ressonância.

Com `imagem`, o verbete vira uma **prancha**: a gravura ocupa a página da esquerda e a ficha vai para a direita, junto das anotações.

Para fazer uma versão "desenho a lápis" de uma arte existente, sobre o pergaminho do site (precisa de Python com Pillow e NumPy):

```bash
python tools/esboco_lapis.py public/assets/villain.jpg public/assets/textura-pergaminho.webp public/assets/compendio/lazare-esboco.webp
```

`[[slug]]` (ou `[[slug|texto]]`) vira link para o verbete, inclusive dentro dos campos da ficha e no diário. Se o verbete ainda não existe, aparece riscado como "ainda não escrito".

### Quadro de investigação (O Pacto)

O link "Desdobrar o quadro de investigação", no índice de O Pacto, abre `/compendio/pacto/quadro`.
- Cada verbete do Pacto vira um cartão preso com alfinete de cera, marcado pelo `status`.
- Um fio liga a pista a cada verbete do campo `ver`. Verbetes de outras seções entram como cartões de evidência.
- Fios de pistas descartadas ficam apagados. Na Ressonância, os fios viram luz.
- Os cartões se distribuem sozinhos numa elipse. Para fixar a posição, use `quadro: x, y` (em %, por exemplo `quadro: 20, 35`).
- `quadro` é um nome reservado: não crie um verbete com esse slug no Pacto.
