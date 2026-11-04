import { useEffect, useState } from "react";
import Pendant from "../components/Pendant.jsx";
import { NODES } from "../data/nodes.js";

// Elos do círculo: posição (%) e ponta da linha até Soren (coords do SVG 400x400).
const LINKS = [
  { id: "clan", left: 50, top: 13, label: "O clã Vaelor" },
  { id: "parents", left: 18, top: 70, label: "Elian e Lyra" },
  { id: "villain", left: 82, top: 70, label: "Lazare" },
];

// A inscrição do anel muda com a lente: a lei do Arcanum, ou o que o colar guarda.
const INSCRIPTION = {
  mask: "NIHIL EX NIHILO 🜍 OMNIA MUTANTUR 🜔 SOLVE ET COAGULA 🜚 ANIMA EST PRETIUM 🜂 ",
  truth: "MEMENTO ELIAN 🜂 MEMENTO LYRA 🜂 AMOR NON DISSOLVITUR 🜂 ANIMA EST PRETIUM 🜂 ",
};

const LEAVES = [
  { id: "voz", label: "Voz" },
  { id: "papel", label: "Papel" },
  { id: "aparencia", label: "Aparência" },
];

// Palco em três partes: quem está selecionado | o círculo | folhas de texto.
export default function NetworkPage({ truthMode, onToggleTruth, openLightbox }) {
  const [selected, setSelected] = useState("soren");
  const data = NODES[selected];

  return (
    <div className="grid gap-14 stage:gap-8 stage:h-full stage:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] stage:items-center">
      <Portrait data={data} truthMode={truthMode} openLightbox={openLightbox} />

      <section className="order-first stage:order-none text-center">
        <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] stage:text-[clamp(2.5rem,4vw,4rem)] leading-none">
          Soren <span className="slashed-surname" title="Nome do clã riscado à faca após o exílio">Vaelor</span> Alkahest
        </h1>
        <p className="rotulo mt-3 stage:mt-2 stage:text-sm">Tiefling por pacto ritual, mago, aprendiz arcano, alquimista</p>

        <TransmutationCircle selected={selected} onSelect={setSelected} truthMode={truthMode} onToggleTruth={onToggleTruth} />

        <p className="text-dim italic text-sm max-w-sm mx-auto">
          {truthMode ? "O colar ressoa. O que Soren reprime vem à tona." : "Escolha um elo do círculo. Toque o colar no peito de Soren."}
        </p>
      </section>

      <Leaves data={data} truthMode={truthMode} />
    </div>
  );
}

function TransmutationCircle({ selected, onSelect, truthMode, onToggleTruth }) {
  return (
    <div className="relative w-full max-w-[600px] aspect-square mx-auto my-8 stage:my-3 stage:max-w-none stage:w-[min(calc(100dvh-290px),36vw)] select-none">
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="brilho" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent) / 0.25)" }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--abyss) / 0)" }} />
          </radialGradient>
          <path id="anel" d="M200 200m-186 0a186 186 0 1 1 372 0a186 186 0 1 1-372 0" />
        </defs>

        <circle cx="200" cy="200" r="200" fill="url(#brilho)" />

        <g className="gira-lento fill-none">
          <circle cx="200" cy="200" r="198" className="stroke-metal/50" />
          <circle cx="200" cy="200" r="174" className="stroke-metal/50" />
          <text className="inscricao">
            <textPath href="#anel" textLength="1160" lengthAdjust="spacing">
              {truthMode ? INSCRIPTION.truth : INSCRIPTION.mask}
            </textPath>
          </text>
        </g>

        <g className="gira-reverso fill-none">
          <polygon points="200,52 328,274 72,274" className="stroke-metal/30" />
          <polygon points="200,348 328,126 72,126" className="stroke-accent/25" />
          <circle cx="200" cy="200" r="148" className="stroke-line/60" strokeDasharray="2 6" />
        </g>

        <rect x="140" y="140" width="120" height="120" transform="rotate(45 200 200)" className="fill-none stroke-metal/20" />

        {LINKS.map((n) => (
          <line
            key={n.id}
            x1="200"
            y1="200"
            x2={n.left * 4}
            y2={n.top * 4}
            className={`elo ${selected === "soren" || selected === n.id ? "ativo" : ""}`}
          />
        ))}

        {/* Corrente do colar, do pescoço de Soren até o pingente */}
        <path d="M184 236Q190 290 200 318M216 236Q210 290 200 318" fill="none" stroke="#c9d6e3" strokeOpacity="0.55" strokeDasharray="1.5 2.5" />
      </svg>

      <OrbitNode id="soren" left={50} top={50} label="Soren" big selected={selected} onSelect={onSelect} />
      {LINKS.map((n) => (
        <OrbitNode key={n.id} {...n} selected={selected} onSelect={onSelect} />
      ))}

      <button
        onClick={onToggleTruth}
        aria-label={truthMode ? "Soltar o colar" : "Tocar o colar"}
        className="absolute left-1/2 top-[82%] -translate-x-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer transition-transform hover:scale-110"
      >
        <Pendant lit={truthMode} width={30} />
      </button>
    </div>
  );
}

// Tamanho em % do círculo, para acompanhar o círculo quando ele encolhe com a altura da tela.
function OrbitNode({ id, left, top, label, big, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selected === id}
      style={{ left: `${left}%`, top: `${top}%` }}
      className={`no-orbita absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center ${big ? "w-[23%] z-10" : "w-[15%]"}`}
    >
      <span className="anel-retrato block w-full aspect-square rounded-full overflow-hidden bg-abyss">
        <img decoding="async" src={NODES[id].image} alt="" className="w-full h-full object-cover object-top" />
      </span>
      <span className="nome-no mt-1.5 px-2 font-sc text-sm whitespace-nowrap bg-abyss/80 rounded-lens transition-colors">{label}</span>
    </button>
  );
}

// Na Ressonância o retrato dá lugar à versão "da verdade" (quando existe), num fade entre as duas.
function Portrait({ data, truthMode, openLightbox }) {
  const showTruth = truthMode && data.imageTruth;
  return (
    <section className="text-center flex flex-col items-center">
      <button
        onClick={() => openLightbox(showTruth ? data.imageTruth : data.image, `${data.name}, ${data.role}`)}
        className="arco-moldura block w-full max-w-[300px] aspect-[5/7] stage:w-auto stage:max-w-none stage:h-[min(calc(100dvh-400px),460px)] cursor-zoom-in"
        aria-label={`Ampliar o retrato de ${data.name}`}
      >
        <span className="arco relative block w-full h-full bg-abyss">
          <img decoding="async" src={data.image} alt={data.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          {data.imageTruth && (
            <img decoding="async"
              src={data.imageTruth}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ${showTruth ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </span>
      </button>

      <h2 className="font-display text-4xl leading-tight mt-4">
        {data.formerName ? (
          <>
            Soren <span className="slashed-surname">{data.formerName}</span> Alkahest
          </>
        ) : (
          data.name
        )}
      </h2>
      <p className="text-dim italic text-sm mt-1">{data.role}</p>
      <p className="rotulo text-sm mt-1">
        <span className="text-accent" title={data.symbolName}>{data.alchemicalSymbol}</span> {data.caste}
      </p>

      <div className="flex items-end gap-3 mt-4 text-left">
        <div className="frasco stage:w-[40px] stage:h-[84px]" role="img" aria-label={`Densidade anímica: ${data.soulDensity}%`}>
          <div className="frasco-liquido" style={{ height: `${data.soulDensity}%` }}></div>
        </div>
        <div className="max-w-[190px]">
          <div className="font-display text-3xl text-accent leading-none">{data.soulDensity}%</div>
          <div className="text-xs text-dim leading-snug mt-1">{data.soulLabel}</div>
        </div>
      </div>
    </section>
  );
}

// Folhas de texto. Tocar o colar volta para "Voz", onde a mudança de lente aparece.
function Leaves({ data, truthMode }) {
  const [leaf, setLeaf] = useState("voz");
  useEffect(() => setLeaf("voz"), [truthMode]);

  // Altura fixa igual à coluna do retrato: as abas não pulam ao trocar de folha.
  return (
    <section className="stage:h-[min(calc(100dvh-160px),700px)] stage:min-h-0 stage:flex stage:flex-col">
      <div role="tablist" className="flex gap-6 border-b border-line/50 mb-5">
        {LEAVES.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={leaf === l.id}
            onClick={() => setLeaf(l.id)}
            className={`font-sc pb-2 -mb-px border-b cursor-pointer transition-colors ${
              leaf === l.id ? "text-accent border-accent" : "text-dim border-transparent hover:text-ink"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="stage:min-h-0 stage:overflow-y-auto stage:pr-2">
        {leaf === "voz" && (
          <>
            <h3 className="rotulo text-sm mb-3">{truthMode ? "O que a alma de Soren realmente sente" : "O que Soren diz ao mundo"}</h3>
            <blockquote className="citacao">{truthMode ? data.truthQuote : data.egoQuote}</blockquote>
            <p className="text-dim leading-relaxed mt-4">{truthMode ? data.truthAnalysis : data.egoAnalysis}</p>
          </>
        )}

        {leaf === "papel" && (
          <>
            <h3 className="rotulo text-sm mb-3">Papel na trajetória de Soren</h3>
            <p className="text-lg leading-relaxed">{data.relationToCenter}</p>
          </>
        )}

        {leaf === "aparencia" && (
          <dl className="space-y-4">
            {data.visualGuide.map((item) => (
              <div key={item.label}>
                <dt className="text-accent leading-snug">{item.label}</dt>
                <dd className="text-dim text-[15px] leading-snug mt-0.5">{item.text}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
