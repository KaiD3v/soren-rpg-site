// O colar arcano de Elian e Lyra: cristal facetado em moldura de prata.
export default function Pendant({ lit, width = 28 }) {
  return (
    <svg viewBox="0 0 40 60" width={width} height={width * 1.5} className={`pingente ${lit ? "aceso" : ""}`} aria-hidden="true">
      <circle cx="20" cy="5" r="3.2" fill="none" stroke="#c9d6e3" strokeWidth="1.2" />
      <polygon className="cristal" points="20,10 33,27 20,58 7,27" />
      <path className="faceta" d="M7 27h26M20 10l-6 17 6 31 6-31z" />
    </svg>
  );
}
