import { useNavigate, useParams } from "react-router";
import ChapterReader from "../components/ChapterReader.jsx";
import { ENTRIES } from "../lib/diary.js";

const CHAPTERS = ENTRIES.map((e) => ({
  ...e,
  key: e.slug,
  kicker: e.session,
  aside: e.date?.split("-").reverse().join("/"), // 2026-11-01 -> 01/11/2026
}));

const LABELS = {
  list: "Diário de Soren • Sessões Registradas",
  prev: "← Sessão Anterior",
  next: "Próxima Sessão →",
  counter: (i, total) => `Entrada ${i} de ${total}`,
};

export default function DiaryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  if (CHAPTERS.length === 0) {
    return (
      <section className="arcane-card rounded-2xl p-6 md:p-8 text-center">
        <p className="italic font-serif text-lg text-stone-300">As páginas do diário ainda estão em branco.</p>
      </section>
    );
  }

  // Sem slug (ou slug desconhecido) abre a entrada mais recente.
  const found = CHAPTERS.findIndex((c) => c.slug === slug);
  const selectedIdx = found === -1 ? CHAPTERS.length - 1 : found;

  return (
    <ChapterReader
      chapters={CHAPTERS}
      selectedIdx={selectedIdx}
      onSelect={(idx) => navigate(`/diario/${CHAPTERS[idx].slug}`)}
      labels={LABELS}
    />
  );
}
