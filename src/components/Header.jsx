import { NavLink } from "react-router";

const TABS = [
  { to: "/", label: "01. Matriz Visual (Soren, Pais, Clã & Vilão)" },
  { to: "/historia", label: "02. História Completa (5 Atos)" },
  { to: "/castas", label: "03. A Casa Vaelor & As 4 Castas" },
  { to: "/mapas", label: "04. Plantas & Mapas da Casa Vaelor" },
  { to: "/diario", label: "05. Diário de Soren (Sessões)" },
];

export default function Header({ truthMode, onToggleTruth }) {
  return (
    <header className="arcane-card rounded-2xl p-5 md:p-7 mb-6 border border-white/15">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 text-amber-400">
              🜍 Grimório & Dossiê Interativo
            </span>
            {truthMode ? (
              <span className="text-xs font-mono tracking-wider px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
                LENTE ATIVA: RESSONÂNCIA DO COLAR (A VERDADE OCULTA)
              </span>
            ) : (
              <span className="text-xs font-mono tracking-wider px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                LENTE ATIVA: MÁSCARA DO EGO (A DESCULPA RACIONAL)
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-serif text-stone-100">
            Soren <span className="slashed-surname" title="Nome do clã riscado à faca após o exílio">Vaelor</span> Alkahest
          </h1>

          <p className="text-sm md:text-base text-stone-400 mt-2 max-w-2xl">
            Tiefling (Herança Infernal por Pacto Ritual) • Mago • Aprendiz Arcano • Alquimista
          </p>
        </div>

        {/* Alternar Lente Psicológica (Ego vs. Verdade do Colar) */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5">
          <button
            onClick={onToggleTruth}
            className="px-4 py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-sky-500/30 hover:from-amber-500/30 hover:to-sky-500/40 border border-sky-400/50 text-stone-100 shadow-lg cursor-pointer"
          >
            <span className="text-lg">💎</span>
            <span>{truthMode ? "Voltar para a Máscara Racional (Ego)" : "Ativar Ressonância do Colar (Ver a Verdade)"}</span>
          </button>
          <p className="text-xs text-stone-400 max-w-md lg:text-right">
            {truthMode ? (
              <>
                <span className="text-sky-300 font-semibold">💎 Modo Verdade Anímica:</span> Revelando o que Soren reprime no subconsciente — o amor pelos pais que contradiz toda a doutrina do seu clã.
              </>
            ) : (
              <>
                <span className="text-amber-400 font-semibold">🜍 Modo Máscara do Ego:</span> Exibindo a visão fria e elitista que Soren apresenta ao mundo (e a desculpa esfarrapada que ele conta a si mesmo).
              </>
            )}
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 sm:gap-6 mt-6 pt-4 border-t border-white/10 text-xs sm:text-sm font-mono">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) => `nav-tab pb-2.5 px-1 font-semibold ${isActive ? "active-tab" : ""}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
