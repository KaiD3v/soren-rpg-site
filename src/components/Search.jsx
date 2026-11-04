import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { search } from "../lib/busca.js";

// Texto puro de um HTML. Na Máscara, a tinta invisível fica de fora: a busca não revela o que o colar esconde.
function plain(html, truthMode) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!truthMode) doc.querySelectorAll(".tinta").forEach((el) => el.remove());
  return doc.body.textContent.replace(/\s+/g, " ").trim();
}

// Os textos só são baixados quando o índice é aberto pela primeira vez.
async function buildIndex(truthMode) {
  const [{ ENTRIES: VERBETES, SECTIONS }, { ENTRIES: DIARY }, { QUESTS }] = await Promise.all([
    import("../lib/compendium.js"),
    import("../lib/diary.js"),
    import("../lib/opus.js"),
  ]);
  const sectionLabel = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));
  return [
    ...DIARY.map((e) => ({ kind: `Diário · ${e.session}`, title: e.title, to: `/diario/${e.slug}`, text: plain(e.html, truthMode) })),
    ...VERBETES.filter((e) => truthMode || !e.sealed).map((e) => ({
      kind: `Compêndio · ${sectionLabel[e.section]}`,
      title: e.title,
      to: `/compendio/${e.section}/${e.slug}`,
      text: plain(e.html, truthMode),
    })),
    ...QUESTS.map((q) => ({
      kind: `Opus · ${q.phase.label}`,
      title: q.title,
      to: `/opus/${q.slug}`,
      text: [q.hipotese, plain(q.html, truthMode)].filter(Boolean).join(" "),
    })),
  ];
}

/** Índice remissivo: busca em todo o arquivo (diário, compêndio e obras). Abre com "/" ou Ctrl+K. */
export default function Search({ truthMode }) {
  const dialogRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState([]);
  useEffect(() => {
    if (open) buildIndex(truthMode).then(setIndex);
  }, [open, truthMode]);
  const hits = search(index, query);

  const show = () => {
    dialogRef.current.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current.close();

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (!dialogRef.current.open) show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button onClick={show} aria-label="Índice remissivo (buscar)" title="Índice remissivo ( / )" className="gancho cursor-pointer text-metal hover:text-ink transition-colors">
        <Lens />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="indice"
        aria-label="Índice remissivo"
      >
        <div className="indice-folha">
          <div className="flex items-center gap-3">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar no arquivo: um nome, um lugar, um reagente…"
              className="tomo-busca flex-1"
            />
            <button onClick={close} className="botao text-sm">Fechar</button>
          </div>

          <ol className="mt-4 overflow-y-auto min-h-0">
            {hits.map((h) => (
              <li key={h.to}>
                <Link to={h.to} onClick={close} className="indice-item">
                  <span className="tomo-meta">{h.kind}</span>
                  <span className="block font-display text-lg leading-tight">{h.title}</span>
                  {h.snippet && (
                    <span className="block text-sm text-[#4a3826]">
                      {h.snippet.before}
                      <mark>{h.snippet.match}</mark>
                      {h.snippet.after}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
          {query.trim().length >= 2 && hits.length === 0 && (
            <p className="italic mt-4 text-[#4a3826]">Nada registrado sobre isso. Ainda.</p>
          )}
        </div>
      </dialog>
    </>
  );
}

// Lupa pendurada no varão, como a sineta e o colar.
function Lens({ width = 18 }) {
  return (
    <svg viewBox="0 0 30 44" width={width} height={width * (44 / 30)} className="sineta" aria-hidden="true">
      <circle cx="15" cy="4" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 7v5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="22" r="8.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M9 19c1-2 3-3 5-3" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <path d="M19 28l7 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
