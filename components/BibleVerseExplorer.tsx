
"use client";

import { useState } from "react";

type BibleVerse = {
  number: string;
  text: string;
};

type BibleVerseExplorerProps = {
  bookName: string;
  chapterNumber: number;
  verses: BibleVerse[];
};

export default function BibleVerseExplorer({
  bookName,
  chapterNumber,
  verses,
}: BibleVerseExplorerProps) {
  const [selectedVerse, setSelectedVerse] = useState("");

  const verse = verses.find((item) => item.number === selectedVerse);

  function exploreVerse() {
    if (!verse) return;

    const passage = `${bookName} ${chapterNumber}:${verse.number}`;

    const prompt = [
      "Help me study this Bible passage.",
      "Translation: Berean Standard Bible (BSB).",
      `Passage: ${passage}.`,
      `Scripture text: "${verse.text}"`,
      "",
      "Explain the historical and literary context, central meaning, and different reasonable theological interpretations.",
      "Distinguish what the text says from interpretive perspectives.",
      "Do not assume I belong to a particular faith tradition.",
      "Finish with three thoughtful reflection questions.",
      "Be clear, balanced, and accessible to someone new to biblical study.",
    ].join("\n");

    const params = new URLSearchParams({
      source: "bible",
      reference: passage,
      translation: "Berean Standard Bible",
      scripture: verse.text,
      prompt,
    });

    window.location.href = `/think?${params.toString()}`;
  }

  return (
    <section className="mt-6 rounded-2xl border border-[#d6a72c]/40 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b58b18]">
        IdeaBulb Study Tools
      </p>

      <h3 className="mt-2 text-2xl font-bold text-[#14213d]">
        Explore This Verse
      </h3>

      <p className="mt-2 text-[#14213d]/70">
        Explore Scripture's meaning, historical context, and different
        perspectives.
      </p>

      <label
        htmlFor="verse-selection"
        className="mb-2 mt-5 block text-sm font-semibold text-[#14213d]"
      >
        Select a verse
      </label>

      <select
        id="verse-selection"
        value={selectedVerse}
        onChange={(event) => setSelectedVerse(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#14213d]"
      >
        <option value="">Choose a verse...</option>

        {verses.map((item) => (
          <option key={item.number} value={item.number}>
            {bookName} {chapterNumber}:{item.number}
          </option>
        ))}
      </select>

      {verse && (
        <div className="mt-4 rounded-xl bg-[#f8f5ed] p-4">
          <p className="text-sm font-semibold text-[#b58b18]">
            {bookName} {chapterNumber}:{verse.number}
          </p>

          <p className="mt-2 leading-7 text-[#14213d]">
            {verse.text}
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={!verse}
        onClick={exploreVerse}
        className="mt-5 w-full rounded-xl bg-[#14213d] px-5 py-3 font-semibold text-white transition hover:bg-[#20345c] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Explore This Verse →
      </button>

      <p className="mt-3 text-xs text-[#14213d]/60">
        Explore with curiosity. Interpretations can differ across
        traditions and scholars.
      </p>
    </section>
  );
}
