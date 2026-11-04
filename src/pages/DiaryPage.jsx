import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../components/Ornaments.jsx";
import { ENTRIES } from "../lib/diary.js";
import { play } from "../lib/sound.js";

const SINGLE_BELOW = 760; // largura disponível (px) abaixo da qual o livro mostra uma página por vez
const MAX_PAGE_WIDTH = 480;
const PAGE_RATIO = 1.38; // altura / largura
const CHROME_HEIGHT = 320; // barra superior + título da página + botões: o livro usa o resto da altura da tela
const COLUMN_GAP = 80; // igual ao column-gap de .fluxo (maior que o padding da página, para esconder a coluna vizinha)

const formatDate = (iso) => iso?.split("-").reverse().join("/"); // 2026-11-01 -> 01/11/2026

/**
 * O diário é um livro: capa, sumário no verso da capa e as entradas paginadas.
 * Cada entrada flui em colunas da altura de uma página (.fluxo); a página N mostra a coluna N.
 * Folhas (leaves) giram em torno da lombada; `current` = quantas folhas já foram viradas.
 */
export default function DiaryPage() {
  const { slug } = useParams();
  const deskRef = useRef(null);
  const measureRef = useRef(null);
  const size = useBookSize(deskRef);
  const counts = usePageCounts(measureRef, size);

  const pages = counts ? ENTRIES.flatMap((entry, i) => Array.from({ length: counts[i] }, (_, column) => ({ entry, column }))) : [];
  const firstPageOf = (slugToFind) => pages.findIndex((p) => p.entry.slug === slugToFind && p.column === 0);

  const book = useBook(pages.length, size?.single);

  // Link direto (/diario/<slug>) abre o livro na entrada.
  useEffect(() => {
    if (counts && slug) book.goToPage(firstPageOf(slug));
  }, [counts, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const vars = size && { "--pw": `${size.pw}px`, "--ph": `${size.ph}px` };

  const page = (p, idx) =>
    p ? (
      <>
        <Flow entry={p.entry} column={p.column} />
        <span className="numero-pagina">{idx + 1}</span>
      </>
    ) : null;

  const cover = (
    <div className="h-full grid place-items-center text-center px-8">
      <div>
        <div className="text-6xl leading-none" aria-hidden="true">🜍</div>
        <div className="font-gothic text-[clamp(2.5rem,calc(var(--pw)*0.12),4rem)] leading-tight mt-4">Alkahest</div>
        <div className="font-sc text-lg mt-1">
          Soren <span className="slashed-surname">Vaelor</span>
        </div>
        <div className="font-body italic mt-10 opacity-80">Registro técnico de campo</div>
      </div>
    </div>
  );

  const summary = (
    <div className="h-full">
      <h2 className="font-gothic text-[1.9em] leading-tight text-[#3a0c08]">Sumário</h2>
      {ENTRIES.length === 0 ? (
        <p className="italic mt-4">Nenhuma entrada ainda. A primeira sessão vai aparecer aqui.</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {ENTRIES.map((e) => (
            <li key={e.slug}>
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  book.goToPage(firstPageOf(e.slug));
                }}
                className="w-full text-left flex items-baseline gap-2 hover:text-[#7a2a1a] cursor-pointer"
              >
                <span className="font-sc text-[#6a5636] shrink-0">{e.session}</span>
                <span className="truncate">{e.title}</span>
                <span className="flex-1 border-b border-dotted border-[#6a563666]"></span>
                <span className="font-sc text-[#6a5636]">{firstPageOf(e.slug) + 1}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  // Conteúdo de cada folha: frente (página da direita) e verso (página da esquerda depois de virada).
  const leaves = size?.single
    ? [{ front: cover, cover: true }, { front: summary }, ...pages.map((p, i) => ({ front: page(p, i) }))]
    : [
        { front: cover, back: summary, cover: true },
        ...Array.from({ length: Math.ceil(pages.length / 2) }, (_, k) => ({
          front: page(pages[2 * k], 2 * k),
          back: page(pages[2 * k + 1], 2 * k + 1),
        })),
      ];

  const shift = size?.single ? 0 : book.current === 0 ? "-25%" : book.current === leaves.length ? "25%" : 0;

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="🜍" title="Diário de Campo">
        As sessões, como Soren as registrou. Toque o colar para ler o que ele escreveu nas entrelinhas.
      </PageTitle>
      <section ref={deskRef} style={vars} className="relative">
        {size && (
          <>
            {/* Medição invisível: quantas páginas cada entrada ocupa no tamanho atual */}
            <div ref={measureRef} aria-hidden="true" className="absolute invisible pointer-events-none -left-[9999px] top-0 h-0 overflow-hidden">
              {ENTRIES.map((e) => (
                <div key={e.slug} className="pagina" style={{ width: size.pw, height: size.ph }}>
                  <Flow entry={e} column={0} />
                </div>
              ))}
            </div>

            <div className="livro-mesa">
              <div className={`livro-janela ${size.single ? "simples" : ""}`}>
                <div className="livro" style={{ transform: shift ? `translateX(${shift})` : undefined }}>
                  {leaves.map((leaf, i) => {
                    const turned = i < book.current;
                    // Só as folhas perto da aberta recebem conteúdo: cada página traz a entrada inteira
                    // (com os esboços), e dezenas delas em camadas 3D estouram a memória do Safari no iPhone.
                    const near = i === 0 || Math.abs(i - book.current) <= 2;
                    return (
                      <div
                        key={i}
                        onClick={() => book.turnTo(turned ? i : i + 1)}
                        onTransitionEnd={(e) => e.target === e.currentTarget && book.settle()}
                        className={`folha ${turned ? "virada" : ""}`}
                        style={{ zIndex: i === book.moving ? leaves.length + 1 : turned ? i : leaves.length - i }}
                      >
                        <div className={`face ${leaf.cover ? "capa" : "pagina"}`}>{near && leaf.front}</div>
                        <div className={`face verso ${leaf.cover && !leaf.back ? "contracapa" : "pagina"}`}>{near && leaf.back}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <button onClick={() => book.turnTo(book.current - 1)} disabled={book.current === 0} className="botao text-sm">
                Voltar página
              </button>
              <span className="rotulo text-sm min-w-[9rem] text-center">
                {book.current === 0 ? "Clique na capa para abrir" : "Setas do teclado viram as páginas"}
              </span>
              <button onClick={() => book.turnTo(book.current + 1)} disabled={book.current >= book.last} className="botao text-sm">
                Virar página
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Flow({ entry, column }) {
  const navigate = useNavigate();
  // Link para um verbete do compêndio: navega sem recarregar e sem virar a folha (o clique na folha vira a página).
  const followLink = (e) => {
    const link = e.target.closest("a.verbete-link");
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    navigate(link.getAttribute("href"));
  };

  return (
    <div className="fluxo" onClick={followLink} style={{ transform: `translateX(calc(${-column} * (100% + ${COLUMN_GAP}px)))` }}>
      <h2>{entry.title}</h2>
      <p className="meta-pagina">
        {[entry.session, formatDate(entry.date)].filter(Boolean).join(", ")}
        {entry.location && <><br />{entry.location}</>}
      </p>
      <div dangerouslySetInnerHTML={{ __html: entry.html }} />
    </div>
  );
}

function useBookSize(ref) {
  const [size, setSize] = useState(null);
  useLayoutEffect(() => {
    const update = () => {
      const width = ref.current.clientWidth;
      const single = width < SINGLE_BELOW;
      const fitsHeight = Math.max(window.innerHeight - CHROME_HEIGHT, 380) / PAGE_RATIO; // o livro inteiro cabe na tela
      const pw = Math.floor(Math.min(single ? width : width / 2, MAX_PAGE_WIDTH, fitsHeight));
      setSize((prev) => (prev?.pw === pw && prev.single === single ? prev : { single, pw, ph: Math.round(pw * PAGE_RATIO) }));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

function usePageCounts(measureRef, size) {
  const [counts, setCounts] = useState(null);
  // Mede de novo quando o tamanho muda e também quando as entradas mudam: ao editar um .md com o
  // diário aberto, o Vite troca o texto sem recarregar, e a contagem antiga deixaria páginas inalcançáveis.
  useLayoutEffect(() => {
    if (!size) return;
    const measure = () =>
      setCounts(
        [...measureRef.current.children].map((pageEl) => {
          const flow = pageEl.firstChild;
          return Math.max(1, Math.round((flow.scrollWidth + COLUMN_GAP) / (flow.clientWidth + COLUMN_GAP)));
        })
      );
    measure();
    document.fonts.ready.then(measure); // as fontes mudam a métrica do texto
    // Imagem ainda carregando mede 0 de altura: mede de novo quando cada uma chegar.
    const pending = [...measureRef.current.querySelectorAll("img")].filter((img) => !img.complete);
    pending.forEach((img) => {
      img.addEventListener("load", measure);
      img.addEventListener("error", measure);
    });
    return () =>
      pending.forEach((img) => {
        img.removeEventListener("load", measure);
        img.removeEventListener("error", measure);
      });
  }, [measureRef, size, ENTRIES]);
  return counts;
}

function useBook(pageCount, single) {
  const [current, setCurrent] = useState(0);
  const [moving, setMoving] = useState(null); // folha em movimento fica por cima de todas
  const leafCount = single ? pageCount + 2 : Math.ceil(pageCount / 2) + 1;
  // No modo simples a última folha precisa ficar à vista (o lado esquerdo é cortado).
  const last = single ? leafCount - 1 : leafCount;

  const turnTo = (next) => {
    const target = Math.max(0, Math.min(next, last));
    if (target === current) return;
    play(target === 0 || current === 0 ? "capa" : "pagina"); // abrir/fechar a capa soa diferente de virar folha
    setMoving(target > current ? current : target);
    setCurrent(target);
  };

  // Página p fica visível com quantas folhas viradas? (no modo duplo, a capa leva o sumário no verso)
  const goToPage = (p) => {
    if (p < 0) return;
    turnTo(single ? p + 2 : p % 2 === 0 ? p / 2 + 1 : (p + 3) / 2);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") turnTo(current + 1);
      if (e.key === "ArrowLeft") turnTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return { current, moving, last, turnTo, goToPage, settle: () => setMoving(null) };
}
