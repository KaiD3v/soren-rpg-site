import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { PageTitle } from "../components/Ornaments.jsx";
import { CASTES } from "../data/castes.js";
import { ENTRIES, SECTIONS, fieldHtml, list } from "../lib/compendium.js";
import { ENTRIES as DIARY } from "../lib/diary.js";
import { play } from "../lib/sound.js";

const STATUS_MARK = { confirmada: "✦", hipótese: "?", hipotese: "?", descartada: "✕" };
const BOARD_SLUG = "quadro"; // /compendio/pacto/quadro abre o quadro de investigação

/**
 * Liber Alkahest: o compêndio de pesquisa de Soren. Um tomo com abas de índice na lateral;
 * cada seção abre num índice com busca e cada verbete ocupa uma página dupla
 * (gravura e ficha técnica à esquerda, anotações à direita).
 */
export default function CompendiumPage({ truthMode }) {
  const { secao, slug } = useParams();
  const navigate = useNavigate();
  const section = SECTIONS.find((s) => s.id === secao) ?? SECTIONS[0];
  const entry = slug && ENTRIES.find((e) => e.section === section.id && e.slug === slug);
  const board = section.id === "pacto" && slug === BOARD_SLUG;

  // Folhear soa ao trocar de verbete/seção, não ao chegar na página (a transição de página já soa).
  const pageKey = `${section.id}/${board ? BOARD_SLUG : entry?.slug ?? ""}`;
  const firstPage = useRef(pageKey);
  useEffect(() => {
    if (pageKey !== firstPage.current) play("pagina");
  }, [pageKey]);

  // Links internos dentro do HTML dos verbetes navegam sem recarregar a página.
  const followLink = (e) => {
    const link = e.target.closest("a[href^='/']");
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute("href"));
  };

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="🜏" title="Liber Alkahest">
        O compêndio de campo de Soren: o que ele estudou, catalogou e ainda não entende.
      </PageTitle>

      <div className="tomo-mesa stage:flex-1 stage:min-h-0">
        <div className="tomo stage:h-full">
          <nav className="tomo-abas" aria-label="Seções do compêndio">
            {SECTIONS.map((s) => (
              <Link
                key={s.id}
                to={`/compendio/${s.id}`}
                aria-current={s.id === section.id ? "page" : undefined}
                className={`tomo-aba ${s.id === section.id ? "aberta" : ""}`}
              >
                <span aria-hidden="true">{s.glyph}</span>
                <span className="tomo-aba-nome">{s.label}</span>
              </Link>
            ))}
          </nav>

          <div key={pageKey} className="tomo-espelho" onClick={followLink}>
            {board ? (
              <BoardSpread truthMode={truthMode} />
            ) : entry ? (
              <EntrySpread entry={entry} section={section} truthMode={truthMode} />
            ) : (
              <IndexSpread section={section} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Knowledge({ level }) {
  return (
    <span className="conhecimento" title={`Conhecimento: ${level} de 4`} aria-label={`Conhecimento: ${level} de 4`}>
      {"●".repeat(level)}
      <span className="opacity-40">{"○".repeat(4 - level)}</span>
    </span>
  );
}

function IndexSpread({ section }) {
  const [query, setQuery] = useState("");
  const all = ENTRIES.filter((e) => e.section === section.id);
  const q = query.trim().toLowerCase();
  const shown = q ? all.filter((e) => `${e.title} ${e[section.subtitle] ?? ""}`.toLowerCase().includes(q)) : all;
  const complete = all.filter((e) => e.knowledge === 4).length;

  return (
    <>
      <section className="tomo-pagina esquerda flex flex-col justify-center text-center">
        <div className="text-5xl text-[#7a2a1a]" aria-hidden="true">{section.glyph}</div>
        <h2 className="verbete-titulo mt-3">{section.label}</h2>
        <p className="italic mt-4 max-w-sm mx-auto">{section.intro}</p>
        <p className="tomo-meta mt-6">
          {all.length} {all.length === 1 ? "verbete" : "verbetes"}, {complete} {complete === 1 ? "completo" : "completos"}
        </p>
        {section.id === "pacto" && (
          <Link to={`/compendio/pacto/${BOARD_SLUG}`} className="tomo-voltar mt-6">
            Desdobrar o quadro de investigação →
          </Link>
        )}
      </section>

      <section className="tomo-pagina direita">
        <h3 className="tomo-meta">Índice</h3>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar em ${section.label.toLowerCase()}`}
          aria-label={`Buscar em ${section.label}`}
          className="tomo-busca mt-2"
        />
        {shown.length === 0 ? (
          <p className="italic mt-6">{all.length === 0 ? "Nenhum verbete escrito ainda." : "Nada encontrado com esse termo."}</p>
        ) : (
          <ol className="mt-4 space-y-1.5">
            {shown.map((e) => (
              <li key={e.slug}>
                <Link to={`/compendio/${section.id}/${e.slug}`} className="tomo-indice-item">
                  {section.id === "pacto" && <span className="w-4 text-center text-[#7a2a1a]">{STATUS_MARK[e.status] ?? "·"}</span>}
                  <span className="truncate">
                    {e.sealed && <span title="Selado" aria-label="Selado">🜏 </span>}
                    {e.title}
                  </span>
                  <span className="flex-1 border-b border-dotted border-[#6a563666] mx-1 translate-y-[-4px]"></span>
                  <span className="tomo-meta whitespace-nowrap">{e[section.subtitle]}</span>
                  <Knowledge level={e.knowledge} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

// "Éter", "Mercúrio"... -> dados da casta, para o veredito de alma da seção Pessoas.
const casteOf = (name) => name && CASTES.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));

// Com gravura, o verbete vira uma prancha de tratado: o desenho ocupa a página da esquerda
// e a ficha vai para a direita, junto das anotações. Sem gravura, a ficha fica à esquerda.
function EntrySpread({ entry, section, truthMode }) {
  const hidden = entry.sealed && !truthMode;
  const plate = entry.imagem && !hidden;
  const caste = casteOf(entry.casta);
  const seeAlso = list(entry.ver);
  const seenIn = list(entry.visto)
    .map((s) => DIARY.find((d) => d.slug === s))
    .filter(Boolean);

  const backLink = (
    <Link to={`/compendio/${section.id}`} className="tomo-voltar">
      ← Índice de {section.label}
    </Link>
  );

  const heading = (
    <>
      <h2 className={`verbete-titulo mt-2 ${plate ? "text-center" : ""}`}>{entry.title}</h2>
      <p className={`tomo-meta mt-1 flex items-center gap-3 ${plate ? "justify-center" : ""}`}>
        <span>{section.label}</span>
        <Knowledge level={entry.knowledge} />
      </p>
    </>
  );

  const facts = (
    <>
      <dl className={`ficha ${plate ? "compacta" : "mt-4"}`}>
        {section.fields.map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            {entry[key] && !hidden ? (
              <dd dangerouslySetInnerHTML={{ __html: fieldHtml(entry[key]) }} />
            ) : (
              <dd className="borrao" aria-label="Desconhecido">desconhecido</dd>
            )}
          </div>
        ))}
      </dl>

      {section.id === "pessoas" && (entry.casta || entry.alma) && (
        <div className="veredito mt-3">
          {caste && <img src={caste.emblem} alt="" className="w-10 h-10 rounded-full shrink-0" />}
          <div>
            <div className="tomo-meta">Veredito da alma</div>
            <div>
              {entry.casta && `Casta ${caste ? caste.name.split(" (")[0].replace("Casta ", "") : entry.casta}`}
              {entry.alma && `, densidade ${entry.alma}%`}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const notes = hidden ? (
    <div className="h-full grid place-items-center text-center">
      <div>
        <div className="cera mx-auto w-20 h-20 grid place-items-center text-3xl">🜏</div>
        <p className="italic mt-4">Página lacrada. O selo só cede ao calor do colar.</p>
      </div>
    </div>
  ) : (
    <>
      {section.id === "pessoas" && (entry.veredito || entry.sentimento) && (
        <blockquote className="mb-3">{truthMode ? entry.sentimento ?? entry.veredito : entry.veredito}</blockquote>
      )}
      <div dangerouslySetInnerHTML={{ __html: entry.html }} />

      {seeAlso.length > 0 && (
        <p className="tomo-rodape">
          Ver também:{" "}
          {seeAlso.map((s, i) => (
            <span key={s}>
              {i > 0 && ", "}
              <span dangerouslySetInnerHTML={{ __html: fieldHtml(`[[${s}]]`) }} />
            </span>
          ))}
        </p>
      )}
      {seenIn.length > 0 && (
        <p className="tomo-rodape">
          Registrado em:{" "}
          {seenIn.map((d, i) => (
            <span key={d.slug}>
              {i > 0 && ", "}
              <Link to={`/diario/${d.slug}`} className="verbete-link">
                {d.session}, {d.title}
              </Link>
            </span>
          ))}
        </p>
      )}
    </>
  );

  if (plate) {
    return (
      <>
        <section className="tomo-pagina esquerda verbete flex flex-col">
          {backLink}
          <span className="esboco prancha">
            <img src={entry.imagem.replace(/^\/public\//, "/")} alt={entry.title} />
          </span>
          {heading}
        </section>
        <section className="tomo-pagina direita verbete text-[15px]">
          {facts}
          <div className="mt-3">{notes}</div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="tomo-pagina esquerda verbete">
        {backLink}
        {heading}
        {facts}
      </section>
      <section className="tomo-pagina direita verbete">{notes}</section>
    </>
  );
}

/**
 * Quadro de investigação do Pacto: cada pista é um cartão preso com alfinete de cera,
 * e um fio liga a pista aos verbetes do campo `ver` (de qualquer seção, que entram como evidência).
 * Posição: `quadro: x, y` (em %) no .md; sem ela, os cartões se distribuem numa elipse.
 */
function BoardSpread({ truthMode }) {
  const clues = ENTRIES.filter((e) => e.section === "pacto");
  const clueSlugs = new Set(clues.map((e) => e.slug));
  const evidence = [...new Set(clues.flatMap((e) => list(e.ver)))]
    .filter((s) => !clueSlugs.has(s))
    .map((s) => ENTRIES.find((e) => e.slug === s))
    .filter(Boolean);
  const cards = [...clues, ...evidence];

  const at = Object.fromEntries(
    cards.map((e, i) => {
      const [x, y] = list(e.quadro).map(Number);
      if (Number.isFinite(x) && Number.isFinite(y)) return [e.slug, { x, y }];
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / cards.length;
      return [e.slug, { x: 50 + 34 * Math.cos(angle), y: 50 + 30 * Math.sin(angle) }];
    })
  );

  // Um fio por par de cartões (a→b e b→a contam uma vez); fio de pista descartada fica apagado.
  const threads = [];
  const seen = new Set();
  for (const clue of clues) {
    for (const target of list(clue.ver)) {
      const key = [clue.slug, target].sort().join("|");
      if (!at[target] || seen.has(key)) continue;
      seen.add(key);
      threads.push({ from: at[clue.slug], to: at[target], faded: clue.status === "descartada" });
    }
  }

  const sectionOf = (e) => SECTIONS.find((s) => s.id === e.section);

  return (
    <section className="tomo-pagina quadro md:col-span-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <Link to="/compendio/pacto" className="tomo-voltar">
          ← Índice de O Pacto
        </Link>
        <p className="tomo-meta">✦ confirmada · ? hipótese · ✕ descartada · sem marca: evidência</p>
      </div>
      <h2 className="verbete-titulo mt-1">Quadro de investigação</h2>

      <div className="quadro-area">
        <svg className={`quadro-fios ${truthMode ? "luz" : ""}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {threads.map((t, i) => {
            const sag = 4 + Math.abs(t.to.x - t.from.x) * 0.08; // o fio pende um pouco entre os alfinetes
            const mx = (t.from.x + t.to.x) / 2;
            const my = (t.from.y + t.to.y) / 2 + sag;
            return (
              <path
                key={i}
                d={`M${t.from.x} ${t.from.y}Q${mx} ${my} ${t.to.x} ${t.to.y}`}
                className={t.faded ? "apagado" : ""}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {cards.map((e, i) => {
          const isClue = e.section === "pacto";
          const hidden = e.sealed && !truthMode;
          const links = list(e.ver).filter((s) => at[s]);
          return (
            <Link
              key={e.slug}
              to={`/compendio/${e.section}/${e.slug}`}
              style={{ left: `${at[e.slug].x}%`, top: `${at[e.slug].y}%`, "--giro": `${i % 2 ? 2 : -2.5}deg` }}
              className={`quadro-cartao ${isClue ? `pista ${e.status === "descartada" ? "descartada" : ""} ${e.status === "hipótese" || e.status === "hipotese" ? "hipotese" : ""}` : "evidencia"}`}
            >
              <span className="quadro-alfinete cera" aria-hidden="true"></span>
              <span className="tomo-meta flex items-center gap-1.5">
                <span aria-hidden="true">{isClue ? STATUS_MARK[e.status] ?? "·" : sectionOf(e)?.glyph}</span>
                {isClue ? e.status : sectionOf(e)?.label}
              </span>
              <span className="quadro-titulo">{hidden ? "🜏 Selado" : e.title}</span>
              {links.length > 0 && (
                <span className="quadro-ligacoes">
                  liga-se a {links.map((s) => cards.find((c) => c.slug === s)?.title).join(", ")}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
