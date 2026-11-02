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
      className="fixed inset-0 z-50 bg-abyss/95 flex items-center justify-center p-4"
    >
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        <button onClick={onClose} className="botao self-end mb-3 text-sm">
          Fechar
        </button>
        <img src={src} alt={caption} className="max-h-[80vh] w-auto border border-metal rounded-lens" />
        <p className="rotulo mt-3 text-center">{caption}</p>
      </div>
    </div>
  );
}
