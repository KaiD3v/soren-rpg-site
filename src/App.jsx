import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Header from "./components/Header.jsx";
import Lightbox from "./components/Lightbox.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import StoryPage from "./pages/StoryPage.jsx";
import CastesPage from "./pages/CastesPage.jsx";
import MapsPage from "./pages/MapsPage.jsx";
import DiaryPage from "./pages/DiaryPage.jsx";

export default function App() {
  const [truthMode, setTruthMode] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { src, caption }

  // As variáveis do tema "verdade" ficam em body.soul-truth-mode (index.css).
  useEffect(() => {
    document.body.classList.toggle("soul-truth-mode", truthMode);
  }, [truthMode]);

  const openLightbox = (src, caption) => setLightbox({ src, caption });

  return (
    <>
      <div className="alchemical-backdrop"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Header truthMode={truthMode} onToggleTruth={() => setTruthMode((m) => !m)} />

        <Routes>
          <Route path="/" element={<NetworkPage truthMode={truthMode} openLightbox={openLightbox} />} />
          <Route path="/historia" element={<StoryPage />} />
          <Route path="/castas" element={<CastesPage />} />
          <Route path="/mapas" element={<MapsPage openLightbox={openLightbox} />} />
          <Route path="/diario/:slug?" element={<DiaryPage />} />
          <Route path="*" element={<NetworkPage truthMode={truthMode} openLightbox={openLightbox} />} />
        </Routes>
      </div>

      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
