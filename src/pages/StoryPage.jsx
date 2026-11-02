import { useState } from "react";
import ChapterReader from "../components/ChapterReader.jsx";
import { ACTS } from "../data/story.jsx";

const CHAPTERS = ACTS.map((a) => ({ ...a, key: a.act, kicker: a.act, aside: a.year }));

const LABELS = {
  list: "Capítulos da Lore",
  prev: "← Ato Anterior",
  next: "Próximo Ato →",
  counter: (i, total) => `Ato ${i} de ${total}`,
};

export default function StoryPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  return <ChapterReader chapters={CHAPTERS} selectedIdx={selectedIdx} onSelect={setSelectedIdx} labels={LABELS} />;
}
