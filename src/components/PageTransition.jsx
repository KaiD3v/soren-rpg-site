// Véu que se desfaz ao entrar numa página: chamas (Máscara) ou círculo arcano (Verdade). Estilos em index.css.
export default function PageTransition({ truthMode }) {
  if (!truthMode) {
    return (
      <div className="troca troca-chamas" aria-hidden="true">
        <div className="troca-veu" />
        <div className="labareda" />
      </div>
    );
  }

  return (
    <div className="troca troca-magia" aria-hidden="true">
      <div className="troca-veu" />
      <svg viewBox="0 0 100 100" className="circulo-magico" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="49" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="45" strokeWidth="0.4" strokeDasharray="1 2" />
        <polygon points="50,7 87,71 13,71" strokeWidth="0.4" />
        <polygon points="50,93 87,29 13,29" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="22" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
