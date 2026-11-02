import { useState } from "react";
import { NODES } from "../data/nodes.js";

// Posição de cada nó no círculo (%) e ponta da linha que o liga a Soren (coords do SVG 400x400).
const ORBIT = [
  { id: "clan", left: "50%", top: "13%", line: [200, 52], label: "🜚 O Clã Vaelor", imgPos: "" },
  { id: "parents", left: "18%", top: "73%", line: [72, 285], label: "🜂 Os Pais (Elian & Lyra)", imgPos: "object-top" },
  { id: "villain", left: "82%", top: "73%", line: [328, 285], label: "🜔 O Vilão (Lazare)", imgPos: "object-top" },
];

const QUICK_SELECT = [
  { id: "soren", tag: "PROTAGONISTA", tagColor: "text-amber-400", name: "Soren Alkahest" },
  { id: "parents", tag: "OS PAIS (MOEDA DO PACTO)", tagColor: "text-sky-400", name: "Elian & Lyra" },
  { id: "clan", tag: "O CLÃ (DOUTRINA)", tagColor: "text-yellow-400", name: "Casa Vaelor" },
  { id: "villain", tag: "O VILÃO (PATRIARCA)", tagColor: "text-red-400", name: "Lazare Vaelor" },
];

export default function NetworkPage({ truthMode, openLightbox }) {
  const [selected, setSelected] = useState("soren");
  const data = NODES[selected];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 arcane-card rounded-2xl p-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Círculo de Transmutação</span>
            <span className="text-xs font-mono text-[var(--accent-main)]">Clique em um Nó</span>
          </div>
          <p className="text-xs text-stone-400 mb-4 text-center">
            Todos os elementos da história orbitam e alimentam a existência de <strong>Soren Alkahest</strong>.
          </p>

          <TransmutationCircle selected={selected} onSelect={setSelected} />

          <div className="w-full grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-white/10">
            {QUICK_SELECT.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelected(q.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selected === q.id ? "border-[var(--accent-main)] bg-white/10" : "border-white/10 bg-black/30 hover:bg-white/5"
                }`}
              >
                <div className={`text-[10px] font-mono ${q.tagColor}`}>{q.tag}</div>
                <div className="text-xs font-bold text-stone-100 truncate">{q.name}</div>
              </button>
            ))}
          </div>
        </div>

        <Inspector data={data} truthMode={truthMode} openLightbox={openLightbox} />
      </div>
    </section>
  );
}

function TransmutationCircle({ selected, onSelect }) {
  return (
    <div className="relative w-full max-w-[370px] aspect-square my-2 select-none">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(229, 142, 38, 0.28)" />
            <stop offset="100%" stopColor="rgba(9, 10, 15, 0)" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="175" fill="url(#centerGlow)" />

        <g className="ring-spin">
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(229, 142, 38, 0.25)" strokeWidth="1.5" strokeDasharray="8 6" />
          <polygon points="200,50 330,275 70,275" fill="none" stroke="rgba(229, 142, 38, 0.16)" strokeWidth="1" />
          <polygon points="200,350 330,125 70,125" fill="none" stroke="rgba(56, 189, 248, 0.14)" strokeWidth="1" />
        </g>

        <g className="ring-spin-reverse">
          <circle cx="200" cy="200" r="95" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <rect x="133" y="133" width="134" height="134" fill="none" stroke="rgba(229, 142, 38, 0.15)" strokeWidth="1" transform="rotate(45 200 200)" />
        </g>

        {ORBIT.map((n) => (
          <line
            key={n.id}
            x1="200"
            y1="200"
            x2={n.line[0]}
            y2={n.line[1]}
            className={`connection-line ${selected === "soren" || selected === n.id ? "active-line" : ""}`}
          />
        ))}
      </svg>

      {/* Nó central: Soren */}
      <div
        onClick={() => onSelect("soren")}
        style={{ left: "50%", top: "50%" }}
        className={`orbit-node absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 ${selected === "soren" ? "active-node" : ""}`}
      >
        <div className="node-avatar-ring w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 bg-stone-900 transition-all duration-300 relative">
          <img src={NODES.soren.image} alt="Soren Alkahest" className="w-full h-full object-cover object-top" />
        </div>
        <span className="node-label mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-white/20 bg-stone-900/90 text-stone-100 whitespace-nowrap shadow">
          🜍 Soren (Centro)
        </span>
      </div>

      {ORBIT.map((n) => (
        <div
          key={n.id}
          onClick={() => onSelect(n.id)}
          style={{ left: n.left, top: n.top }}
          className={`orbit-node absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 ${selected === n.id ? "active-node" : ""}`}
        >
          <div className="node-avatar-ring w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/30 bg-stone-900 transition-all duration-300">
            <img src={NODES[n.id].image} alt={NODES[n.id].name} className={`w-full h-full object-cover ${n.imgPos}`} />
          </div>
          <span className="node-label mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/20 bg-stone-900/90 text-stone-200 whitespace-nowrap shadow">
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Inspector({ data, truthMode, openLightbox }) {
  return (
    <div className="lg:col-span-7 arcane-card rounded-2xl p-5 md:p-7">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-5">
          <div className="portrait-frame rounded-xl aspect-[3/4] bg-stone-950 relative group">
            <img src={data.image} alt={data.name} className="portrait-img" />
            <button
              onClick={() => openLightbox(data.image, `${data.name} — ${data.role}`)}
              className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-xs font-mono text-stone-200 border border-white/20 flex items-center gap-1.5 backdrop-blur-md transition cursor-pointer"
            >
              <span>🔍</span> Ampliar Arte
            </button>
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-stone-400">DENSIDADE ANÍMICA</span>
              <span className="text-[var(--accent-main)] font-bold">{data.soulDensity}%</span>
            </div>
            <div className="soul-bar-track mb-2">
              <div className="soul-bar-fill" style={{ width: `${data.soulDensity}%` }}></div>
            </div>
            <div className="text-[11px] font-mono text-stone-300">{data.soulLabel}</div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">{data.caste}</span>
                <span className="text-xs font-mono text-stone-400">{data.symbolName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-100 mt-1">
                {data.formerName ? (
                  <>
                    Soren <span className="slashed-surname">{data.formerName}</span> Alkahest
                  </>
                ) : (
                  data.name
                )}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-stone-400 mt-0.5">{data.role}</p>
            </div>
            <span className="text-3xl sm:text-4xl font-serif text-[var(--accent-main)] select-none">{data.alchemicalSymbol}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-1">🔗 Papel na Trajetória de Soren</div>
            <p className="text-sm text-stone-200 leading-relaxed">{data.relationToCenter}</p>
          </div>

          {/* A Desculpa Esfarrapada vs. A Verdade Oculta */}
          <div className="p-4 rounded-xl bg-black/45 border border-white/15">
            {truthMode ? (
              <>
                <div className="text-xs font-mono uppercase tracking-wider mb-1">
                  💎 <span className="text-sky-300">O que a Alma de Soren realmente sente (Verdade Reprimida):</span>
                </div>
                <blockquote className="italic font-serif text-lg md:text-xl text-sky-100 border-l-4 border-sky-400 pl-4 py-1 my-3 bg-sky-950/30 rounded-r">
                  {data.truthQuote}
                </blockquote>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-2">{data.truthAnalysis}</p>
              </>
            ) : (
              <>
                <div className="text-xs font-mono uppercase tracking-wider mb-1">
                  🜍 <span className="text-amber-300">O que Soren diz ao mundo (A Desculpa Racional):</span>
                </div>
                <blockquote className="italic font-serif text-lg md:text-xl text-amber-100 border-l-4 border-amber-500 pl-4 py-1 my-3 bg-amber-950/25 rounded-r">
                  {data.egoQuote}
                </blockquote>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-2">{data.egoAnalysis}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10">
        <h3 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
          👁️ Diretrizes de Concepção Visual & Detalhes de Cena
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.visualGuide.map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-black/35 border border-white/10">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-main)] mb-1">{item.label}</div>
              <div className="text-sm text-stone-300 leading-relaxed">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
