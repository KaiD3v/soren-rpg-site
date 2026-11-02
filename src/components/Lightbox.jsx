import { useEffect } from "react";

export default function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
    >
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        <button
          onClick={onClose}
          className="self-end mb-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-stone-200 cursor-pointer"
        >
          ✕ Fechar Visualização
        </button>
        <img src={src} alt="Visualização Ampliada" className="max-h-[82vh] w-auto rounded-xl border border-white/20 shadow-2xl" />
        <p className="mt-3 text-sm font-mono text-stone-300 text-center">{caption}</p>
      </div>
    </div>
  );
}
