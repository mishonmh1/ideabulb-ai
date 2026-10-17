
"use client";

import { useState } from "react";

type BibleBook = {
  id: string;
  name: string;
  chapters: number;
};

type BibleReaderControlsProps = {
  books: BibleBook[];
  initialBook: string;
  initialChapter: number;
};

export default function BibleReaderControls({
  books,
  initialBook,
  initialChapter,
}: BibleReaderControlsProps) {
  const [bookId, setBookId] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter);

  const selectedBook =
    books.find((book) => book.id === bookId) ?? books[0];

  function navigate(nextBook: string, nextChapter: number) {
    const params = new URLSearchParams({
      book: nextBook,
      chapter: String(nextChapter),
    });

    window.location.href = `/bible?${params.toString()}`;
  }

  function changeBook(nextBookId: string) {
    setBookId(nextBookId);
    setChapter(1);
    navigate(nextBookId, 1);
  }

  function changeChapter(nextChapter: number) {
    setChapter(nextChapter);
    navigate(bookId, nextChapter);
  }

  return (
    <section className="rounded-2xl border border-[#d6a72c]/30 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="bible-book"
            className="mb-2 block text-sm font-semibold"
          >
            Book of the Bible
          </label>

          <select
            id="bible-book"
            value={bookId}
            onChange={(event) => changeBook(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#14213d]"
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="bible-chapter"
            className="mb-2 block text-sm font-semibold"
          >
            Chapter
          </label>

          <select
            id="bible-chapter"
            value={chapter}
            onChange={(event) =>
              changeChapter(Number(event.target.value))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[#14213d]"
          >
            {Array.from(
              { length: selectedBook.chapters },
              (_, index) => index + 1
            ).map((chapterNumber) => (
              <option key={chapterNumber} value={chapterNumber}>
                Chapter {chapterNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          disabled={chapter <= 1}
          onClick={() => changeChapter(chapter - 1)}
          className="rounded-xl border border-[#14213d]/20 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous chapter
        </button>

        <p className="font-semibold text-[#14213d]">
          {selectedBook.name} {chapter}
        </p>

        <button
          type="button"
          disabled={chapter >= selectedBook.chapters}
          onClick={() => changeChapter(chapter + 1)}
          className="rounded-xl bg-[#14213d] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next chapter →
        </button>
      </div>
    </section>
  );
}
