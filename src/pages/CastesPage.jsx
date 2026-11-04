import { useState } from "react";
import { PageTitle } from "../components/Ornaments.jsx";
import { CASTES } from "../data/castes.js";

// Silhueta da montanha (SVG 400x380) e a faixa de altura de cada casta, do cume à base.
const PEAK = "200,8 222,48 236,40 268,104 282,98 318,176 334,170 392,372 8,372 66,170 82,176 118,98 132,104 164,40 178,48";
const BANDS = [
  { y: 0, h: 98, labelY: 74 },
  { y: 98, h: 90, labelY: 150 },
  { y: 188, h: 92, labelY: 240 },
  { y: 280, h: 92, labelY: 332 },
];
const shortName = (caste) => caste.name.match(/Casta d[ao] (\S+)/)?.[1] ?? caste.name;

export default function CastesPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = CASTES[selectedIdx];

  return (
    <div className="stage:h-full stage:flex stage:flex-col">
      <PageTitle glyph="🜚" title="A Casa Vaelor">
        Quanto mais densa a alma, mais alto se vive na montanha. Escolha um estrato para ver como o clã mede o valor de uma vida.
      </PageTitle>

      <div className="grid gap-12 lg:grid-cols-2 items-center stage:flex-1 stage:min-h-0">
        <svg viewBox="0 0 400 380" className="w-full max-w-[520px] mx-auto overflow-visible stage:w-auto stage:max-w-full stage:h-[min(calc(100dvh-260px),520px)]" role="group" aria-label="Estratos da montanha">
          <defs>
            <clipPath id="montanha">
              <polygon points={PEAK} />
            </clipPath>
          </defs>

          <polygon points={PEAK} className="fill-abyss" />

          {CASTES.map((caste, idx) => {
            const band = BANDS[idx];
            const isActive = idx === selectedIdx;
            const select = () => setSelectedIdx(idx);
            return (
              <g
                key={caste.tier}
                className="estrato"
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={caste.name}
                onClick={select}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select())}
              >
                <rect x="0" y={band.y} width="400" height={band.h} clipPath="url(#montanha)" fill={caste.color} fillOpacity={isActive ? 0.5 : 0.12} className="transition-[fill-opacity] duration-500" />
                <text x="200" y={band.labelY - 16} textAnchor="middle" className="font-display" fontSize="22" fill={isActive ? "#fff" : caste.color}>
                  {caste.tier}
                </text>
                <text x="200" y={band.labelY + 4} textAnchor="middle" className="font-sc" fontSize="14" fill={isActive ? "#fff" : "rgb(var(--ink))"}>
                  {shortName(caste)}
                </text>
              </g>
            );
          })}

          {BANDS.slice(1).map((b) => (
            <line key={b.y} x1="0" x2="400" y1={b.y} y2={b.y} clipPath="url(#montanha)" className="stroke-metal/60" strokeDasharray="3 4" />
          ))}
          <polygon points={PEAK} className="fill-none stroke-metal" strokeWidth="1.5" />
          <line x1="-20" x2="420" y1="372" y2="372" className="stroke-metal/50" />
        </svg>

        <article className="painel p-8 stage:p-6">
          <div className="flex items-center gap-4">
            {/* screen apaga o fundo preto do brasão sobre o painel escuro */}
            <img decoding="async" src={active.emblem} alt="" className="w-20 h-20 shrink-0 rounded-full mix-blend-screen" />
            <div>
              <p className="rotulo text-sm">Estrato {active.tier}</p>
              <h2 className="font-display text-3xl md:text-4xl stage:text-3xl leading-tight">{active.name}</h2>
            </div>
          </div>
          <p className="rotulo mt-4">{active.soulRange}</p>
          <p className="mt-4">
            <span className="text-dim">Na história: </span>
            {active.members}
          </p>
          <p className="text-dim leading-relaxed mt-4">{active.description}</p>
          <h3 className="rotulo text-sm mt-8 mb-3">Como Soren os vê</h3>
          <blockquote className="citacao">{active.sorenView}</blockquote>
        </article>
      </div>
    </div>
  );
}
