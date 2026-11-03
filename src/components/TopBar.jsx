import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import Bell from "./Bell.jsx";
import Pendant from "./Pendant.jsx";
import Search from "./Search.jsx";
import { isMuted, setMuted } from "../lib/sound.js";

// Gavetas do arquivo, na ordem dos fólios. A cota aparece na linha de catalogação.
const DRAWERS = [
  { to: "/", folio: "I", label: "Matriz" },
  { to: "/historia", folio: "II", label: "Crônica" },
  { to: "/castas", folio: "III", label: "Casa Vaelor" },
  { to: "/mapas", folio: "IV", label: "Atlas" },
  { to: "/diario", folio: "V", label: "Diário" },
  { to: "/compendio", folio: "VI", label: "Compêndio" },
  { to: "/opus", folio: "VII", label: "Opus" },
];

const isOpen = (drawer, path) => (drawer.to === "/" ? path === "/" : path.startsWith(drawer.to));

export default function TopBar({ truthMode, onToggleTruth }) {
  const { pathname } = useLocation();
  const current = DRAWERS.find((d) => isOpen(d, pathname)) ?? { folio: "?", label: "Página arrancada" };
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMutedState] = useState(isMuted);
  const toggleSound = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  // Fecha o gaveteiro do celular ao trocar de página ou com Esc.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const drawerClass = (d) => `gaveta ${isOpen(d, pathname) ? "aberta" : ""}`;

  return (
    <header className="barra relative md:sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <NavLink to="/" className="cera sinete shrink-0" aria-label="Soren Alkahest, início">
          🜍
        </NavLink>

        <nav aria-label="Arquivo" className="hidden lg:flex flex-wrap justify-center gap-x-2 xl:gap-x-3 gap-y-2">
          {DRAWERS.map((d) => (
            <NavLink key={d.to} to={d.to} end={d.to === "/"} className={drawerClass(d)}>
              <span className="folio">Fól. {d.folio}</span>
              <span className="text-[15px] leading-tight">{d.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Celular: a gaveta atual vira o botão que abre o gaveteiro */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="gaveteiro"
          className="gaveta aberta lg:hidden flex-1 max-w-[14rem] cursor-pointer"
        >
          <span className="folio">Fól. {current.folio} {menuOpen ? "▴" : "▾"}</span>
          <span className="text-[15px] leading-tight">{current.label}</span>
        </button>

        {/* Varão de ferro: a lupa (índice), a sineta (som) e o colar pendem lado a lado */}
        <div className="varao flex items-start gap-4 shrink-0">
          <Search truthMode={truthMode} />
          <button
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? "Ligar o som" : "Desligar o som"}
            title={muted ? "Ligar o som" : "Desligar o som"}
            className={`gancho cursor-pointer transition-colors ${muted ? "text-dim/60" : "text-metal hover:text-ink"}`}
          >
            <Bell muted={muted} />
          </button>
          <button onClick={onToggleTruth} className="gancho flex items-start gap-2 font-sc text-sm text-dim hover:text-ink cursor-pointer shrink-0">
            <Pendant lit={truthMode} width={18} />
            <span className="hidden sm:inline lg:hidden xl:inline">{truthMode ? "Soltar o colar" : "Tocar o colar"}</span>
            <span className="sr-only sm:hidden lg:inline xl:hidden">{truthMode ? "Soltar o colar" : "Tocar o colar"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="gaveteiro" aria-label="Arquivo" className="gaveteiro lg:hidden">
          {DRAWERS.map((d) => (
            <NavLink key={d.to} to={d.to} end={d.to === "/"} className={`${drawerClass(d)} gaveta-linha`}>
              <span className="folio w-14 text-left">Fól. {d.folio}</span>
              <span className="text-lg">{d.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <p className="catalogo hidden lg:block" aria-live="polite">
        Arquivo Arcano de Soren Alkahest, cota ALK-{current.folio}: {current.label}
      </p>
    </header>
  );
}
