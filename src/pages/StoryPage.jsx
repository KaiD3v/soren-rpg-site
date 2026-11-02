import { useState } from "react";
import { PageTitle } from "../components/Ornaments.jsx";
import { ACTS } from "../data/story.jsx";

const numeral = (act) => act.act.replace("Ato ", ""); // "Ato III" -> "III"

// Um ato por vez, em duas colunas como um códice aberto; a linha do tempo escolhe o ato
// e a iluminura do ato fecha a composição à direita.
export default function StoryPage({ openLightbox }) {
  const [idx, setIdx] = useState(0);
  const act = ACTS[idx];

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="☽" title="A Crônica">
        Cinco atos, da centelha na cinza ao exílio.
      </PageTitle>

      <div className="grid gap-8 stage:gap-10 stage:flex-1 stage:min-h-0 stage:grid-cols-[200px_minmax(0,1fr)_230px] stage:items-center">
        <nav aria-label="Atos">
          <ol className="linha-tempo flex justify-center gap-3 stage:block stage:space-y-5">
            {ACTS.map((a, i) => (
              <li key={a.act}>
                <button onClick={() => setIdx(i)} aria-current={i === idx ? "step" : undefined} className="flex items-center gap-3 group text-left cursor-pointer">
                  <span className={`marco ${i === idx ? "ativo" : ""}`}>{numeral(a)}</span>
                  <span className={`hidden stage:inline leading-tight transition-colors ${i === idx ? "text-ink" : "text-dim group-hover:text-ink"}`}>
                    {a.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <button
          onClick={() => openLightbox(act.image, `${act.act}: ${act.title}`)}
          aria-label={`Ampliar a iluminura do ${act.act}`}
          className="block w-full max-w-[260px] mx-auto stage:col-start-3 stage:row-start-1 cursor-zoom-in"
        >
          <img key={act.image} src={act.image} alt="" className="iluminura w-full h-auto" />
        </button>

        <article className="stage:col-start-2 stage:row-start-1 stage:max-h-full stage:min-h-0 stage:flex stage:flex-col">
          <header className="flex items-end gap-5 pb-4 mb-6 border-b border-line/50 stage:flex-none">
            <span className="font-display text-6xl text-accent leading-none">{numeral(act)}</span>
            <div>
              <h2 className="font-display text-4xl leading-tight">{act.title}</h2>
              <p className="rotulo text-sm mt-1">
                {act.year}, {act.location}
              </p>
            </div>
          </header>

          <div className="capitular text-lg stage:text-base leading-relaxed stage:columns-2 stage:gap-10 stage:min-h-0 stage:overflow-y-auto">{act.content}</div>

          <footer className="flex justify-between items-center mt-6 pt-4 border-t border-line/50 stage:flex-none">
            <button onClick={() => setIdx(idx - 1)} disabled={idx === 0} className="botao text-sm">
              Ato anterior
            </button>
            <span className="rotulo text-sm">
              {idx + 1} de {ACTS.length}
            </span>
            <button onClick={() => setIdx(idx + 1)} disabled={idx === ACTS.length - 1} className="botao text-sm">
              Próximo ato
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
