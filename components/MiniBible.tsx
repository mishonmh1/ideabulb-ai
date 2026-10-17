
"use client";

import { useEffect, useState } from "react";

type Book = {
  id: string;
  name: string;
  chapterCount: number;
};

type Verse = {
  number: number;
  text: string;
};

export default function MiniBible({
  initialReference,
}: {
  initialReference: string;
}) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState("Luke");
  const [chapter, setChapter] = useState(10);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [chapterCount, setChapterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const match = initialReference.match(/^(.+?)\s+(\d+)/);
    if (match) {
      setBook(match[1].trim());
      setChapter(Number(match[2]));
    }
  }, [initialReference]);

useEffect(() => {
  async function loadBooks() {
    try {
      const response = await fetch("/api/bible");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load Bible books.");
      }

      if (Array.isArray(data.books) && data.books.length > 0) {
        setBooks(data.books);

        const initialBook = data.books.find(
          (item: Book) =>
            item.name.toLowerCase() === "luke" ||
            item.id.toLowerCase() === "luk"
        );

        if (initialBook) {
          setBook(initialBook.id);
        }
      } else {
        throw new Error("The Bible book list is empty.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load Bible books."
      );
    }
  }

  void loadBooks();
}, []);

  useEffect(() => {
    if (!open || !book) return;

    let cancelled = false;

    async function loadChapter() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          book,
          chapter: String(chapter),
        });

        const response = await fetch(`/api/bible?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load this chapter.");
        }

        if (!cancelled) {
          setVerses(data.verses || []);
          setChapterCount(data.book?.chapterCount || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load Scripture."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadChapter();

    return () => {
      cancelled = true;
    };
  }, [open, book, chapter]);

  function selectBook(bookId: string) {
    setBook(bookId);
    setChapter(1);
  }

  function previousChapter() {
    if (chapter > 1) {
      setChapter(chapter - 1);
      return;
    }

    const index = books.findIndex((item) => item.id === book);
    const previous = books[index - 1];

    if (previous) {
      setBook(previous.id);
      setChapter(previous.chapterCount);
    }
  }

  function nextChapter() {
    if (chapter < chapterCount) {
      setChapter(chapter + 1);
      return;
    }

    const index = books.findIndex((item) => item.id === book);
    const next = books[index + 1];

    if (next) {
      setBook(next.id);
      setChapter(1);
    }
  }

  const selectedBook = books.find((item) => item.id === book);
  const firstBook = books[0];
  const lastBook = books[books.length - 1];

  return (
    <section className="rounded-[2rem] border border-[#d6a72c]/30 bg-white p-7 shadow-sm sm:p-10">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b6b11]">
        Scripture at Your Fingertips
      </p>

      <h2 className="mt-5 text-3xl font-black">Mini Bible</h2>

      <p className="mt-3 leading-7 text-[#14213d]/70">
        Read today&apos;s passage or explore another book of the Bible
        without leaving Think Tank.
      </p>

      <div className="mt-6 rounded-2xl bg-[#f8f5ed] p-5">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#8b6b11]">
          Today&apos;s Scripture
        </p>
        <p className="mt-2 text-xl font-black">{initialReference}</p>
        <p className="mt-2 text-sm text-[#14213d]/65">
          Berean Standard Bible
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-7 rounded-full bg-[#14213d] px-7 py-4 text-sm font-bold text-white hover:bg-[#1c2e52]"
      >
        {open ? "Close Mini Bible" : "Open Mini Bible"}
      </button>

      {open && (
        <div className="mt-7 border-t border-[#e8deca] pt-7">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#8b6b11]">
              Bible book
            </span>
            <select
              value={book}
              onChange={(event) => selectBook(event.target.value)}
              className="rounded-xl border border-[#e8deca] bg-white px-4 py-3"
            >
              {books.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 grid gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#8b6b11]">
              Chapter
            </span>
            <select
              value={chapter}
              onChange={(event) => setChapter(Number(event.target.value))}
              className="rounded-xl border border-[#e8deca] bg-white px-4 py-3"
            >
              {Array.from({ length: chapterCount }, (_, index) => index + 1).map(
                (number) => (
                  <option key={number} value={number}>
                    Chapter {number}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={previousChapter}
              disabled={
                loading ||
                (book === firstBook?.id && chapter === 1)
              }
              className="rounded-full border border-[#e8deca] px-4 py-3 text-sm font-bold disabled:opacity-40"
            >
              ← Previous
            </button>

            <p className="text-center text-sm font-black">
              {selectedBook?.name || book} {chapter}
            </p>

            <button
              type="button"
              onClick={nextChapter}
              disabled={
                loading ||
                (book === lastBook?.id && chapter === chapterCount)
              }
              className="rounded-full border border-[#e8deca] px-4 py-3 text-sm font-bold disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              {error}
            </p>
          )}

          {loading ? (
            <p className="mt-6">Loading Scripture...</p>
          ) : (
            <div className="mt-6 max-h-[560px] space-y-4 overflow-y-auto rounded-2xl border border-[#e8deca] bg-[#fffdf8] p-5">
              {verses.map((verse) => (
                <p key={verse.number} className="leading-8 text-[#53617a]">
                  <sup className="mr-2 font-black text-[#8b6b11]">
                    {verse.number}
                  </sup>
                  {verse.text}
                </p>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-[#53617a]">
            Berean Standard Bible
          </p>
        </div>
      )}
    </section>
  );
}
