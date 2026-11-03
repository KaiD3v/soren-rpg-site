import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { PageTitle } from "../components/Ornaments.jsx";
import { fieldHtml, list } from "../lib/compendium.js";
import { ENTRIES as DIARY } from "../lib/diary.js";
import { PHASES, QUESTS, RESIDUE } from "../lib/opus.js";
import { play } from "../lib/sound.js";

const isDone = (q) => q.phase.id === "rubedo";
const isResidue = (q) => q.phase.id === RESIDUE.id;

/**
 * Magnum Opus: as quests de Soren como experimentos na bancada. Cada frasco mostra a fase
 * da Grande Obra (nigredo → rubedo); obras concluídas viram cristais na prateleira,
 * obras fracassadas viram resíduo. Clicar num frasco abre o protocolo ao lado.
 */
export default function OpusPage({ truthMode }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const quest = QUESTS.find((q) => q.slug === slug) ?? QUESTS.find((q) => !isDone(q)) ?? QUESTS[0];

  // Ao trocar de obra: som de página e, com o protocolo embaixo da bancada (celular), rola até ele.
  const firstQuest = useRef(quest?.slug);
  const protocolRef = useRef(null);
  useEffect(() => {
    if (quest?.slug === firstQuest.current) return;
    play("pagina");
    if (matchMedia("(max-width: 1023px)").matches) protocolRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [quest?.slug]);

  // Links internos do protocolo navegam sem recarregar a página.
  const followLink = (e) => {
    const link = e.target.closest("a[href^='/']");
    if (!link) return;
    e.preventDefault();
    navigate(link.getAttribute("href"));
  };

  const bench = QUESTS.filter((q) => !isDone(q));
  const shelf = QUESTS.filter(isDone);

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="🜔" title="Magnum Opus">
        As obras em andamento na bancada de Soren. Cada uma passa pelas quatro fases da Grande Obra.
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] stage:flex-1 stage:min-h-0">
        <section className="bancada" aria-label="Bancada">
          <ol className="fases" aria-label="Fases da Grande Obra">
            {PHASES.map((p) => (
              <li key={p.id} title={p.hint}>
                <span className={`fase-ponto ${p.id}`} aria-hidden="true" />
                {p.label}
              </li>
            ))}
          </ol>

          <div className="bancada-tampo">
            {bench.map((q) => (
              <Link
                key={q.slug}
                to={`/opus/${q.slug}`}
                className={`obra ${q.slug === quest?.slug ? "aberta" : ""}`}
                aria-current={q.slug === quest?.slug ? "page" : undefined}
              >
                <Flask phase={q.phase} />
                <span className="obra-nome">{q.title}</span>
                <span className="obra-fase">{q.phase.label}</span>
              </Link>
            ))}
          </div>

          <div className="prateleira">
            <h2 className="rotulo">Prateleira</h2>
            {shelf.length ? (
              <div className="flex flex-wrap gap-4 mt-3">
                {shelf.map((q) => (
                  <Link key={q.slug} to={`/opus/${q.slug}`} className={`obra pequena ${q.slug === quest?.slug ? "aberta" : ""}`}>
                    <span className="cristal" aria-hidden="true" />
                    <span className="obra-nome">{q.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-dim italic text-sm mt-2">Nenhuma obra cristalizada ainda.</p>
            )}
          </div>
        </section>

        {quest && <div ref={protocolRef} className="min-h-0 flex flex-col scroll-mt-4">
            <Protocol key={quest.slug} quest={quest} truthMode={truthMode} onClick={followLink} />
          </div>}
      </div>
    </div>
  );
}

function Flask({ phase }) {
  const active = !isDone({ phase }) && phase.id !== RESIDUE.id;
  return (
    <span className={`retorta ${phase.id} ${active ? "ativa" : ""}`} style={{ "--nivel": `${phase.nivel}%` }} aria-hidden="true">
      <span className="retorta-gargalo" />
      <span className="retorta-bojo">
        <span className="retorta-liquido" />
        {active && [0, 1, 2].map((i) => <span key={i} className="bolha" style={{ animationDelay: `${i * 0.9}s` }} />)}
      </span>
    </span>
  );
}

function Protocol({ quest, truthMode, onClick }) {
  // Obra concluída abre lacrada: o selo de cera se parte com o som de lacre.
  useEffect(() => {
    if (isDone(quest)) play("selo");
  }, [quest]);
  const reagents = list(quest.ver);
  const records = list(quest.visto)
    .map((s) => DIARY.find((d) => d.slug === s))
    .filter(Boolean);
  const reached = isResidue(quest) ? -1 : PHASES.findIndex((p) => p.id === quest.phase.id);
  const field = (label, value) =>
    value && (
      <div>
        <dt>{label}</dt>
        <dd dangerouslySetInnerHTML={{ __html: fieldHtml(value) }} />
      </div>
    );

  return (
    <article className="tomo-pagina verbete protocolo relative" onClick={onClick}>
      {isDone(quest) && (
        <div className="lacre" title="Obra concluída" aria-label="Selo de obra concluída, partido">
          <span className="cera lacre-metade esquerda">🜔</span>
          <span className="cera lacre-metade direita">🜔</span>
        </div>
      )}
      <p className="tomo-meta">Protocolo de obra · {quest.phase.label}</p>
      <h2 className={`verbete-titulo mt-1 ${isDone(quest) ? "pr-16" : ""}`}>{quest.title}</h2>

      <ol className="trilha-fases mt-3" aria-label={`Fase atual: ${quest.phase.label}`}>
        {PHASES.map((p, i) => (
          <li key={p.id} className={i <= reached ? `feita ${p.id}` : ""}>
            {p.label}
          </li>
        ))}
      </ol>
      {isResidue(quest) && <p className="tomo-meta mt-2">Obra fracassada. O resíduo fica na bancada.</p>}

      <dl className="ficha compacta mt-4">
        {field("Contratante", quest.contratante)}
        {field("Recompensa", quest.recompensa)}
        {field("Hipótese", quest.hipotese)}
      </dl>

      {(quest.motivo || quest.verdadeiro) && (
        <blockquote className="mt-3">{truthMode ? quest.verdadeiro ?? quest.motivo : quest.motivo}</blockquote>
      )}

      <div className="mt-3" dangerouslySetInnerHTML={{ __html: quest.html }} />

      {reagents.length > 0 && (
        <p className="tomo-rodape" dangerouslySetInnerHTML={{ __html: "Reagentes: " + fieldHtml(reagents.map((r) => `[[${r}]]`).join(", ")) }} />
      )}
      {records.length > 0 && (
        <p className="tomo-rodape">
          Registrado em:{" "}
          {records.map((d, i) => (
            <span key={d.slug}>
              {i > 0 && ", "}
              <Link to={`/diario/${d.slug}`}>
                {d.session}, {d.title}
              </Link>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
