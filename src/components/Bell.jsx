// Sineta de metal: com badalo solto (som ligado) ou com o badalo amarrado por uma fita (mudo).
export default function Bell({ muted, width = 18 }) {
  return (
    <svg viewBox="0 0 30 44" width={width} height={width * (44 / 30)} className="sineta" aria-hidden="true">
      <circle cx="15" cy="4" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M15 7c-6 0-8.5 5-8.5 11 0 6-2.5 9-4.5 11h26c-2-2-4.5-5-4.5-11 0-6-2.5-11-8.5-11z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 29h26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 14c1-2.5 3-3.5 5-3.5" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      {muted ? (
        <>
          <circle cx="15" cy="31" r="2.6" fill="currentColor" />
          <path d="M3 24l24 6" stroke="#8a1c10" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M23 29l3 8M24 29l-1 9" stroke="#8a1c10" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : (
        <circle cx="15" cy="35" r="2.6" fill="currentColor" />
      )}
    </svg>
  );
}
