import { useState } from "react";
import { PageTitle } from "../components/Ornaments.jsx";
import { MAPS } from "../data/maps.js";
import { play } from "../lib/sound.js";

const GROUPS = [
  { id: "cidadela", label: "A Cidadela" },
  { id: "exilio", label: "O Exílio" },
];

const SIDE_LEAVES = [
  { id: "selo", label: "Selo" },
  { id: "planta", label: "A planta" },
  { id: "memoria", label: "Memória" },
];

// Palco: o mapa ocupa a altura da tela; ao lado, folhas com o selo escolhido, a planta e a memória de Soren.
export default function MapsPage({ openLightbox }) {
  const [mapIdx, setMapIdx] = useState(0);
  const [pinIdx, setPinIdx] = useState(0);
  const [leaf, setLeaf] = useState("selo");

  const map = MAPS[mapIdx];
  const pin = map.pins[pinIdx];

  const selectMap = (idx) => {
    setMapIdx(idx);
    setPinIdx(0);
  };

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="♁" title="Atlas">
        As plantas da Casa Vaelor e os mapas do exílio. Rompa um selo para ler o lugar.
      </PageTitle>

      <div className="grid gap-10 stage:flex-1 stage:min-h-0 stage:grid-cols-[minmax(0,1fr)_380px] stage:items-center">
        <div className="flex flex-col items-center gap-4 stage:min-h-0">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2" aria-label="Mapas">
            {GROUPS.map((g) => (
              <div key={g.id} className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1">
                <span className="rotulo text-xs">{g.label}</span>
            {MAPS.map((m, idx) => (m.group ?? "cidadela") === g.id && (
              <button
                key={m.id}
                onClick={() => selectMap(idx)}
                aria-pressed={idx === mapIdx}
                title={m.title}
                className={`font-sc pb-1 border-b transition-colors cursor-pointer ${
                  idx === mapIdx ? "border-accent text-accent" : "border-transparent text-dim hover:text-ink"
                }`}
              >
                {m.code}
              </button>
            ))}
              </div>
            ))}
          </nav>

          <figure className="relative max-w-4xl stage:w-fit border border-metal rounded-lens overflow-hidden bg-abyss shadow-[0_30px_80px_-20px_#000]">
            <img src={map.image} alt={map.title} className="block w-full h-auto stage:w-auto stage:max-w-full stage:max-h-[calc(100dvh-280px)] select-none" />
            {map.route && (
              // Rota do exílio, a tinta por cima do mapa
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                {/* Contorno escuro + traço claro: a rota aparece sobre qualquer cor do mapa */}
                {[
                  { stroke: "#1a0f08", width: 5, dash: undefined },
                  { stroke: "#f3e3c0", width: 2.5, dash: "7 5" },
                ].map((l) => (
                  <polyline
                    key={l.stroke}
                    points={map.route.map(([x, y]) => `${x},${y}`).join(" ")}
                    fill="none"
                    stroke={l.stroke}
                    strokeWidth={l.width}
                    strokeDasharray={l.dash}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            )}
            {map.pins.map((p, idx) => (
              <button
                key={p.num}
                onClick={() => {
                  play("selo");
                  setPinIdx(idx);
                  setLeaf("selo");
                }}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                title={p.title}
                aria-pressed={idx === pinIdx}
                className="cera selo absolute -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 grid place-items-center text-xl cursor-pointer"
              >
                {p.num}
              </button>
            ))}
            <button
              onClick={() => openLightbox(map.image, `${map.title}, ${map.subtitle}`)}
              className="botao absolute bottom-3 right-3 z-20 text-sm bg-abyss/85"
            >
              Abrir em tela cheia
            </button>
          </figure>
        </div>

        <aside className="stage:max-h-full stage:min-h-0 stage:flex stage:flex-col">
          <div role="tablist" className="flex gap-6 border-b border-line/50 mb-5 stage:flex-none">
            {SIDE_LEAVES.map((l) => (
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
            {leaf === "selo" && (
              <>
                <p className="rotulo text-sm">
                  Selo {pin.num}, {pin.areaTag.toLowerCase()}
                </p>
                <h2 className="font-display text-2xl leading-tight mt-1">{pin.title}</h2>
                <p className="text-dim leading-relaxed mt-3">{pin.desc}</p>
                {pin.linkedMapIdx !== undefined && (
                  <button onClick={() => selectMap(pin.linkedMapIdx)} className="botao mt-4 text-sm">
                    Ver o mapa desta área
                  </button>
                )}

                <h3 className="rotulo text-sm mt-6 mb-1">Selos deste mapa</h3>
                <ol>
                  {map.pins.map((p, idx) => (
                    <li key={p.num}>
                      <button
                        onClick={() => setPinIdx(idx)}
                        aria-pressed={idx === pinIdx}
                        className={`w-full text-left flex items-baseline gap-3 py-0.5 text-[15px] cursor-pointer transition-colors ${
                          idx === pinIdx ? "text-accent" : "text-dim hover:text-ink"
                        }`}
                      >
                        <span className="font-display text-lg w-5 shrink-0">{p.num}</span>
                        <span className="leading-snug">{p.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {leaf === "planta" && (
              <>
                <h2 className="font-display text-3xl leading-tight">{map.title}</h2>
                <p className="text-dim italic mt-1">{map.subtitle}</p>
                <dl className="mt-4 space-y-1 text-sm">
                  <div><dt className="rotulo inline">Escala: </dt><dd className="inline">{map.scale}</dd></div>
                  <div><dt className="rotulo inline">Segurança: </dt><dd className="inline">{map.securityLevel}</dd></div>
                </dl>
                <p className="leading-relaxed mt-4">{map.overview}</p>
              </>
            )}

            {leaf === "memoria" && (
              <>
                <h3 className="rotulo text-sm mb-3">O que Soren lembra deste lugar</h3>
                <blockquote className="citacao">{map.sorenMemory}</blockquote>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
