const BODY = "chapter-prose space-y-4 text-stone-200 leading-relaxed text-base md:text-lg font-serif";

/**
 * Lista de capítulos à esquerda + leitura à direita (usado pela História e pelo Diário).
 * chapters: [{ key, kicker, aside, title, summary, location, content?, html? }]
 * labels: { list, prev, next, counter(i, total) }
 */
export default function ChapterReader({ chapters, selectedIdx, onSelect, labels }) {
  const current = chapters[selectedIdx];
  const isFirst = selectedIdx === 0;
  const isLast = selectedIdx === chapters.length - 1;

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 arcane-card rounded-2xl p-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 px-1 mb-2">{labels.list}</div>
          <div className="space-y-2.5">
            {chapters.map((item, idx) => (
              <button
                key={item.key}
                onClick={() => onSelect(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  idx === selectedIdx
                    ? "bg-white/10 border-[var(--accent-main)] text-stone-100"
                    : "bg-black/30 border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[var(--accent-main)]">{item.kicker}</span>
                  <span>{item.aside}</span>
                </div>
                <div className="font-bold text-base">{item.title}</div>
                {item.summary && <div className="text-xs text-stone-400 mt-1 line-clamp-2">{item.summary}</div>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 arcane-card rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-main)]">
                {current.kicker} • {current.aside}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-stone-100 mt-1 font-serif">{current.title}</h3>
            </div>
            {current.location && (
              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-black/50 border border-white/15 text-stone-300">
                📍 {current.location}
              </span>
            )}
          </div>

          {current.html ? (
            <div className={BODY} dangerouslySetInnerHTML={{ __html: current.html }} />
          ) : (
            <div className={BODY}>{current.content}</div>
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
            <button
              onClick={() => onSelect(selectedIdx - 1)}
              disabled={isFirst}
              className="px-4 py-2 rounded-lg border border-white/15 text-xs font-mono disabled:opacity-30 hover:bg-white/5 cursor-pointer"
            >
              {labels.prev}
            </button>
            <span className="text-xs font-mono text-stone-400">{labels.counter(selectedIdx + 1, chapters.length)}</span>
            <button
              onClick={() => onSelect(selectedIdx + 1)}
              disabled={isLast}
              className="px-4 py-2 rounded-lg border border-white/15 text-xs font-mono disabled:opacity-30 hover:bg-white/5 cursor-pointer"
            >
              {labels.next}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
