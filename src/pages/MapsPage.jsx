import { useState } from "react";
import { MAPS } from "../data/maps.js";

export default function MapsPage({ openLightbox }) {
  const [mapIdx, setMapIdx] = useState(0);
  const [pinIdx, setPinIdx] = useState(0);

  const map = MAPS[mapIdx];
  const pin = map.pins[pinIdx];

  const selectMap = (idx) => {
    setMapIdx(idx);
    setPinIdx(0);
  };

  return (
    <section className="space-y-6">
      <div className="arcane-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">🗺️ Cartografia & Plantas Táticas (RPG)</span>
            <h3 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 mt-1">Atlas Arquitetônico da Casa Vaelor</h3>
            <p className="text-sm text-stone-400 mt-1 max-w-3xl">
              Explore o mapa completo em corte vertical da montanha e as plantas detalhadas de cada andar (Pico do Éter, Salões de Mercúrio e Subterrâneo de Enxofre / Pacto Quimera). Clique nos marcadores numerados para inspecionar cada sala.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {MAPS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => selectMap(idx)}
              className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                idx === mapIdx
                  ? "bg-white/12 border-[var(--accent-main)] text-stone-100 shadow-lg"
                  : "bg-black/40 border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/25"
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-main)] mb-0.5">{m.code}</div>
              <div className="font-bold text-sm text-stone-100 truncate">{m.title}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-strong)] bg-stone-950 shadow-2xl group">
              <img src={map.image} alt={map.title} className="w-full h-auto block select-none" />
              {map.pins.map((p, idx) => (
                <button
                  key={p.num}
                  onClick={() => setPinIdx(idx)}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  title={p.title}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full font-mono text-xs sm:text-sm font-bold flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    idx === pinIdx
                      ? "bg-[var(--accent-main)] text-stone-950 scale-125 ring-4 ring-amber-400/50 shadow-[0_0_20px_rgba(229,142,38,0.9)]"
                      : "bg-stone-950/90 text-amber-300 border-2 border-amber-400/80 hover:scale-110 shadow-lg"
                  }`}
                >
                  {p.num}
                </button>
              ))}
              <button
                onClick={() => openLightbox(map.image, `${map.title} — ${map.subtitle}`)}
                className="absolute bottom-3 right-3 z-30 px-3.5 py-2 rounded-xl bg-black/85 hover:bg-black text-xs font-mono text-stone-100 border border-white/25 flex items-center gap-2 backdrop-blur-md shadow-lg cursor-pointer"
              >
                <span>🔍</span> Abrir Planta em Tela Cheia
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/55 border border-[var(--accent-main)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[var(--accent-main)] uppercase">
                  📍 Marcador Selecionado [Ponto {pin.num}] • {pin.areaTag}
                </div>
                <h4 className="text-lg font-bold text-stone-100 mt-0.5">{pin.title}</h4>
                <p className="text-sm text-stone-300 mt-1">{pin.desc}</p>
              </div>
              {pin.linkedMapIdx !== undefined && (
                <button
                  onClick={() => selectMap(pin.linkedMapIdx)}
                  className="shrink-0 px-3.5 py-2 rounded-lg bg-[var(--accent-main)] text-stone-950 font-mono text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  Ver Planta da Área →
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border-l-4 border-[var(--accent-main)]">
              <div className="text-xs font-mono text-[var(--accent-main)] mb-1">Memória Tática de Soren Alkahest:</div>
              <p className="italic font-serif text-base md:text-lg text-stone-200">{map.sorenMemory}</p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="text-xs font-mono text-amber-400 uppercase">{map.code}</div>
              <h3 className="text-2xl font-bold font-serif text-stone-100 mt-0.5">{map.title}</h3>
              <p className="text-xs font-mono text-stone-400 mt-0.5">{map.subtitle}</p>

              <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                <div className="text-stone-300"><span className="text-stone-500">ESCALA:</span> {map.scale}</div>
                <div className="text-stone-300"><span className="text-stone-500">SEGURANÇA:</span> {map.securityLevel}</div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed mt-3">{map.overview}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 px-1">
                <span>Setores & Salas Mapeadas</span>
                <span>Clique no número ou no cartão</span>
              </div>
              <div className="space-y-2.5">
                {map.pins.map((p, idx) => (
                  <div
                    key={p.num}
                    onClick={() => setPinIdx(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      idx === pinIdx ? "bg-white/10 border-[var(--accent-main)]" : "bg-black/35 border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full text-xs font-mono font-bold flex items-center justify-center ${
                            idx === pinIdx ? "bg-[var(--accent-main)] text-stone-950" : "bg-white/10 text-amber-300"
                          }`}
                        >
                          {p.num}
                        </span>
                        <h5 className="font-bold text-sm text-stone-100">{p.title}</h5>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-stone-400 border border-white/10">{p.areaTag}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed pl-7">{p.desc}</p>
                    {p.linkedMapIdx !== undefined && (
                      <div className="pl-7 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectMap(p.linkedMapIdx);
                          }}
                          className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          → Abrir Planta Detalhada desta Área
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
