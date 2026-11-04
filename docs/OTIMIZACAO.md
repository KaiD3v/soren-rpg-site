# Auditoria de performance (2026-11-04)

Medido no site publicado (sorenalkahest.vercel.app), Chrome, desktop 1366×768 e iPhone 13 simulado.

| Página | Requisições | Transferido | Elementos no DOM | CPU parado |
|---|---|---|---|---|
| Matriz `/` | 13 | **3,6 MB** | 158 | 17–19% |
| Crônica | 9 | 0,56 MB | 138 | 10% |
| Casa Vaelor | 9 | 0,33 MB | 131 | 10% |
| Atlas | 9 | 1,2 MB | 141 | 10% |
| Diário (Sessão 1) | 20–22 | 1,8 MB | **1.000–1.400** | 10% |
| Compêndio | 12 | 0,59 MB | 146 | 10% |
| Opus | 10 | 0,30 MB | 191 | 21% |

Fora isso: JS de 434 KB (144 KB gzip) num arquivo só, músicas de 5,6 MB + 2,8 MB depois do primeiro clique, e o livro do diário com 68 folhas 3D no celular.

## Pendências

### Peso dos arquivos
1. **Retratos da Matriz em JPG de 800–930 KB** (896×1200) para aparecer em ~300 px: soren, villain, clan, parents. São 3,3 MB dos 3,6 MB da página inicial.
2. **Plantas da cidadela em JPG de ~1 MB cada** (map_full, map_ether, map_mercury, map_sulfur).
3. **Iluminuras, brasões e versões "verdade" em WebP de 200–450 KB**, bem maiores do que o tamanho em que aparecem.
4. **Músicas**: house-of-ashen-vows.mp3 com 5,6 MB e lost-lullaby.mp3 com 2,8 MB; no celular isso pesa no plano de dados.
5. **sirius.png (3,7 MB) não é usado em lugar nenhum**; só pesa no repositório e no deploy.

### Cache
6. **Nada é guardado em cache**: imagens, músicas e até o JS com hash vêm com `Cache-Control: max-age=0, must-revalidate`. A cada visita o navegador pergunta de novo por todos os arquivos.

### Imagens no HTML
7. Nenhuma `<img>` tem `loading="lazy"`, `decoding="async"` nem `width`/`height`: tudo baixa de uma vez e a página "pula" ao carregar.

### CPU e GPU (bateria e aquecimento no celular)
8. **Partículas de fundo (Atmosphere)**: 55 partículas redesenhadas 60 vezes por segundo, cada uma com `shadowBlur`, que é caro. É a maior parte dos 10–20% de CPU com a página parada.
9. **Granulado da tela (`body::after`)**: um filtro SVG `feTurbulence` numa camada fixa, por cima de tudo (z-index 60).
10. **Barra superior com `backdrop-filter: blur`** fixa no topo: o desfoque é recalculado a cada rolagem.
11. **Animações infinitas** (círculo da Matriz girando, vapor e bolhas do Opus) continuam rodando mesmo fora da tela.

### Diário
12. **68 folhas 3D no celular**, mesmo vazias: cada folha com `preserve-3d` é uma camada separada na GPU. Foi isso que derrubou o Safari.
13. **Cada página carrega a entrada inteira** (texto e esboços) e só desloca a parte visível; 5 páginas por perto = 5 cópias da Sessão 1.
14. **A medição invisível baixa todos os esboços do diário** ao abrir a primeira página, porque a altura das imagens é necessária para contar as páginas.

### JavaScript
15. **Um único arquivo de 434 KB** com todas as páginas, o `marked` e todo o texto do diário, do compêndio e do Opus, que é convertido para HTML assim que o site abre, mesmo na Matriz.
16. **Três fontes do Google** carregadas de outro domínio, sem pré-carregamento das usadas no primeiro desenho.

## Plano

Cada fase pode ir em um commit próprio e ser testada no iPhone antes da seguinte.

### Fase 1: arquivos e cache (maior ganho, menor risco)
- Converter retratos, plantas, iluminuras, brasões e versões "verdade" para WebP no tamanho em que aparecem, com qualidade 80 (pendências 1–3). Os arquivos maiores continuam no Lightbox ("Abrir em tela cheia") em versão `-grande`.
- Reencodar as músicas em MP3 de 96 kbps (ou AAC): devem cair de 8,4 MB para ~2,5 MB (4).
- Remover `sirius.png`, se você não for usar (5).
- `vercel.json`: cache de 1 ano (`immutable`) para `/assets/*.js` e `/assets/*.css` com hash; 30 dias com `stale-while-revalidate` para imagens, sons e músicas (6).
- `loading="lazy"`, `decoding="async"` e `width`/`height` nas imagens fora da primeira dobra (7).
- **Meta:** Matriz de 3,6 MB para menos de 600 KB; Atlas de 1,2 MB para menos de 350 KB.

### Fase 2: CPU e GPU
- Atmosphere: desenhar cada partícula a partir de um sprite pré-renderizado (sem `shadowBlur`), limitar a 30 fps, usar metade das partículas no celular e pausar com a aba oculta (8).
- Trocar o granulado SVG por uma textura PNG pequena repetida (9).
- Barra superior: fundo opaco no celular, sem `backdrop-filter` (10).
- Pausar as animações infinitas fora da tela (`animation-play-state` com IntersectionObserver ou `content-visibility`) (11).
- **Meta:** CPU parado abaixo de 5%.

### Fase 3: diário leve
- Renderizar só as folhas próximas da aberta (cerca de 6), com uma "pilha" visual de cada lado no lugar das demais (12).
- Esboços com altura fixa por CSS, para a medição não depender de a imagem carregar; na medição invisível, a imagem vira um bloco vazio da mesma altura e os esboços carregam só quando a página aparece (13, 14).
- **Meta:** DOM do diário abaixo de 500 elementos; só os esboços das páginas visíveis são baixados.

### Fase 4: JavaScript sob demanda
- Carregar cada página com `React.lazy`: a Matriz não baixa diário, compêndio, Opus nem `marked` (15).
- Converter o Markdown na hora em que a seção é aberta, não ao abrir o site.
- Pré-carregar só a fonte do título (`UnifrakturMaguntia`) e avaliar hospedar as fontes no próprio site (16).
- **Meta:** JS da primeira página abaixo de 90 KB gzip.

### Verificação
Repetir a mesma medição (`perf.mjs`, Playwright com o Chrome instalado) depois de cada fase e testar no iPhone real.

## Resultado (aplicado em 2026-11-04)

Medido no build de produção (`vite preview`), mesma metodologia.

| Página | Antes | Depois | CPU parado antes → depois |
|---|---|---|---|
| Matriz | 3,6 MB | **0,57 MB** | 17–19% → 6–7% |
| Crônica | 0,56 MB | 0,36 MB | 10% → 1–2% |
| Casa Vaelor | 0,33 MB | 0,23 MB | 10% → 1% |
| Atlas | 1,2 MB | **0,36 MB** | 10% → 1–2% |
| Diário (Sessão 1) | 1,8 MB | **0,35 MB** | 10% → 2% |
| Compêndio | 0,59 MB | 0,44 MB | 10% → 2–3% |
| Opus | 0,30 MB | 0,32 MB | 21% → 7–9% |

- JS inicial: 144 KB → 97 KB gzip (o resto baixa por página: diário 12 KB, compêndio + Markdown 20 KB...).
- Músicas: 8,4 MB → 4,2 MB; efeitos: 288 KB → 140 KB.
- Diário: 68 folhas 3D → 4 no celular; elementos no DOM 1.400 → 680 (celular) e 1.000 (desktop). Cada esboço baixa uma vez ao abrir o diário.
- Cache: JS/CSS com hash por 1 ano; imagens, sons e músicas por 1 dia, revalidando em segundo plano por mais 7 (troca de arquivo com o mesmo nome aparece em até 1 dia).

Revertido depois de comparar antes/depois em alta resolução (o site ficou com cara de baixa resolução):
- O granulado em PNG (ruído pixel a pixel) voltou a ser o filtro SVG original: o ganho de CPU vinha das partículas, não dele.
- Esboços do diário com altura fixa e baixados só na página deles: deixavam os esboços menores e os horizontais com faixas vazias na moldura (e a regra encolhia as pranchas do Compêndio). Voltaram ao tamanho natural.

O que ficou de fora, de propósito:
- `loading="lazy"` nas imagens das páginas: cada página mostra só as próprias imagens, que estão na tela; ficou só `decoding="async"`.
- Pausar animações fora da tela: as animações infinitas só existem na página aberta e estão à vista.
- Hospedar as fontes: o Google Fonts com `preconnect` e `display=swap` já não bloqueia o desenho; ganho pequeno para o trabalho.
- DOM do diário abaixo de 500 no desktop: cada página ainda carrega o texto inteiro da entrada; fatiar o texto por página exigiria outra forma de paginar.

Para imagens novas (Gemini costuma entregar 1–2 MB): `python tools/otimizar_imagens.py 900 70 public/assets/...`.
