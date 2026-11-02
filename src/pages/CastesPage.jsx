import { useState } from "react";
import { CASTES } from "../data/castes.js";

// Larguras crescentes formam a pirâmide (topo estreito, base larga).
const WIDTHS = ["w-full md:w-3/5", "w-full md:w-3/4", "w-full md:w-11/12", "w-full"];

export default function CastesPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = CASTES[selectedIdx];

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 arcane-card rounded-2xl p-6">
          <div className="mb-5">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Eugenismo Anímico</span>
            <h3 className="text-2xl font-bold font-serif text-stone-100 mt-1">A Pirâmide de Castas da Casa Vaelor</h3>
            <p className="text-sm text-stone-400 mt-1">
              Clique em cada escalão da montanha para inspecionar como o clã classifica o valor da vida humana pela densidade da alma.
            </p>
          </div>

          <div className="space-y-3">
            {CASTES.map((caste, idx) => (
              <button
                key={caste.tier}
                onClick={() => setSelectedIdx(idx)}
                className={`${WIDTHS[idx]} mx-auto block text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  idx === selectedIdx
                    ? "bg-white/10 border-[var(--accent-main)] shadow-lg scale-[1.01]"
                    : "bg-black/40 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif" style={{ color: caste.color }}>{caste.symbol}</span>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-stone-400">Escalão {caste.tier}</div>
                      <div className="font-bold text-base md:text-lg text-stone-100">{caste.name}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/50 border border-white/10 text-stone-300">
                    {caste.soulRange}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 arcane-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl" style={{ color: active.color }}>{active.symbol}</span>
            <div>
              <h4 className="text-xl font-bold text-stone-100">{active.name}</h4>
              <p className="text-xs font-mono text-amber-400">{active.soulRange}</p>
            </div>
          </div>
          <div className="mb-3 text-xs font-mono uppercase tracking-wider text-stone-400">
            Representantes na História: <span className="text-stone-200">{active.members}</span>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed mb-4">{active.description}</p>
          <div className="p-3.5 rounded-lg bg-black/50 border-l-4 border-[var(--accent-main)]">
            <div className="text-xs font-mono text-[var(--accent-main)] mb-1">Visão de Soren Alkahest:</div>
            <p className="italic font-serif text-base text-stone-200">{active.sorenView}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
