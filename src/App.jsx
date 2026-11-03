import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import Atmosphere from "./components/Atmosphere.jsx";
import Lightbox from "./components/Lightbox.jsx";
import PageTransition from "./components/PageTransition.jsx";
import { play, setMusicLens, startMusic } from "./lib/sound.js";
import TopBar from "./components/TopBar.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import StoryPage from "./pages/StoryPage.jsx";
import CastesPage from "./pages/CastesPage.jsx";
import MapsPage from "./pages/MapsPage.jsx";
import DiaryPage from "./pages/DiaryPage.jsx";
import CompendiumPage from "./pages/CompendiumPage.jsx";
import OpusPage from "./pages/OpusPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const VEIL_SWAP_MS = 480; // a lente troca quando o véu cobre a tela (pico da animação .veu-luz)
const VEIL_END_MS = 1150;
const PAGE_TURN_MS = 1050; // duração do véu de troca de página (chamas / círculo arcano)

export default function App() {
  const [truthMode, setTruthMode] = useState(false);
  const [veil, setVeil] = useState(null); // { toTruth, x, y }
  const [lightbox, setLightbox] = useState(null); // { src, caption }
  const busy = useRef(false);
  const [pageTurn, setPageTurn] = useState(null); // id da troca em andamento
  const section = useLocation().pathname.split("/")[1]; // "diario/slug" e "diario" são a mesma seção
  const lastSection = useRef(section);

  // Ao trocar de seção, o véu cobre a página nova antes do primeiro quadro e se desfaz.
  useLayoutEffect(() => {
    if (section === lastSection.current) return;
    lastSection.current = section;
    play(truthMode ? "magia" : "chamas");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = Date.now();
    setPageTurn(id);
    const timer = setTimeout(() => setPageTurn((current) => (current === id ? null : current)), PAGE_TURN_MS);
    return () => clearTimeout(timer);
  }, [section]);

  // As variáveis de cada lente ficam em body[data-lens] (index.css).
  useLayoutEffect(() => {
    document.body.dataset.lens = truthMode ? "verdade" : "mascara";
    setMusicLens(truthMode ? "verdade" : "mascara");
  }, [truthMode]);

  // A trilha só pode começar depois de um gesto do visitante.
  useEffect(() => {
    window.addEventListener("pointerdown", startMusic, { once: true });
    window.addEventListener("keydown", startMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, []);

  // Tocar o colar: a luz do cristal (ou as trevas, ao soltar) toma a tela a partir do pingente.
  const toggleTruth = (event) => {
    const toTruth = !truthMode;
    if (busy.current) return;
    play(toTruth ? "colar-tocar" : "colar-soltar");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setTruthMode(toTruth);
    busy.current = true;

    const r = event.currentTarget.getBoundingClientRect();
    setVeil({ toTruth, x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setTimeout(() => setTruthMode(toTruth), VEIL_SWAP_MS);
    setTimeout(() => {
      setVeil(null);
      busy.current = false;
    }, VEIL_END_MS);
  };

  const openLightbox = (src, caption) => setLightbox({ src, caption });
  const home = <NetworkPage truthMode={truthMode} onToggleTruth={toggleTruth} openLightbox={openLightbox} />;

  return (
    <>
      <Atmosphere truthMode={truthMode} />

      {/* No palco a janela tem a altura da tela: barra + página, sem rolagem */}
      <div className="stage:h-[100dvh] stage:flex stage:flex-col">
        <TopBar truthMode={truthMode} onToggleTruth={toggleTruth} />

        <main className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 stage:flex-1 stage:min-h-0 stage:py-6">
          <Routes>
            <Route path="/" element={home} />
            <Route path="/historia" element={<StoryPage openLightbox={openLightbox} />} />
            <Route path="/castas" element={<CastesPage />} />
            <Route path="/mapas" element={<MapsPage openLightbox={openLightbox} />} />
            <Route path="/diario/:slug?" element={<DiaryPage />} />
            <Route path="/compendio/:secao?/:slug?" element={<CompendiumPage truthMode={truthMode} />} />
            <Route path="/opus/:slug?" element={<OpusPage truthMode={truthMode} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {pageTurn && <PageTransition key={pageTurn} truthMode={truthMode} />}
      {veil && <Veil {...veil} />}
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function Veil({ toTruth, x, y }) {
  const at = `${x}px ${y}px`;
  const light = toTruth
    ? `radial-gradient(circle at ${at}, #f2fbff 0%, #8fdcff 18%, #0d3550 55%, #030a12 100%)`
    : `radial-gradient(circle at ${at}, #e0592a 0%, #3a0c08 14%, #0c0a0e 50%, #000 100%)`;
  const ring = toTruth ? "#bfeaff" : "#e0592a";

  return (
    <div className="veu" aria-hidden="true">
      <div className="veu-luz" style={{ background: light }} />
      {[0, 120, 240].map((delay) => (
        <span key={delay} className="veu-anel" style={{ left: x, top: y, borderColor: ring, animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}
