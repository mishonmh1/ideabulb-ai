
import {
  getBibleBooks,
  getBibleChapter,
  getBibleChapterCount,
} from "@/lib/bible/reader";
import BibleReaderControls from "@/components/BibleReaderControls";
import BibleVerseExplorer from "@/components/BibleVerseExplorer";

type BiblePageProps = {
  searchParams: Promise<{
    book?: string;
    chapter?: string;
  }>;
};

export default async function BiblePage({
  searchParams,
}: BiblePageProps) {
  const params = await searchParams;

  const baseBooks = getBibleBooks();

  const books = baseBooks.map((book) => ({
    ...book,
    chapters: getBibleChapterCount(book.id),
  }));

  const requestedBook = params.book?.toUpperCase() ?? "GEN";

  const book =
    books.find((item) => item.id === requestedBook) ?? books[0];

  const requestedChapter = Number(params.chapter ?? "1");

  const safeChapter =
    Number.isInteger(requestedChapter) && requestedChapter >= 1
      ? requestedChapter
      : 1;

  let chapterNumber = safeChapter;
  let verses;

  try {
    if (chapterNumber > book.chapters) {
      throw new Error("Chapter does not exist.");
    }

    verses = getBibleChapter(book.id, chapterNumber);
  } catch {
    chapterNumber = 1;
    verses = getBibleChapter(book.id, chapterNumber);
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-4 py-8 text-[#14213d] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <nav
          aria-label="Main navigation"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#14213d]/10 bg-white/80 p-3 shadow-sm"
        >
          <a
            href="/"
            className="px-3 py-2 text-sm font-extrabold tracking-wide text-[#14213d] hover:text-[#b58b18]"
          >
            IdeaBulb<span className="text-[#d6a72c]">.AI</span>
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#14213d] hover:bg-[#f8f5ed]"
            >
              Home
            </a>

            <a
              href="/think-tank"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#14213d] hover:bg-[#f8f5ed]"
            >
              Think Tank
            </a>

            <a
              href="/bible"
              aria-current="page"
              className="rounded-full bg-[#d6a72c]/20 px-3 py-2 text-sm font-bold text-[#14213d]"
            >
              Bible
            </a>

            <a
              href="/profile"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#14213d] hover:bg-[#f8f5ed]"
            >
              My Profile
            </a>
          </div>
        </nav>

        <header className="mb-8 border-b border-[#d6a72c]/40 pb-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#b58b18]">
            IdeaBulb Library
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The Bible
          </h1>

          <p className="mt-3 text-[#14213d]/70">
            Read, explore, and reflect on Scripture.
          </p>
        </header>

        <BibleReaderControls
          books={books}
          initialBook={book.id}
          initialChapter={chapterNumber}
        />

        <section className="mt-6 rounded-2xl border border-[#d6a72c]/30 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#b58b18]">
            Berean Standard Bible
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {book.name} {chapterNumber}
          </h2>

          <div className="mt-7 space-y-5">
            {verses.map((verse) => (
              <p
                key={verse.number}
                className="text-lg leading-8 text-slate-700"
              >
                <sup className="mr-2 font-bold text-[#b58b18]">
                  {verse.number}
                </sup>
                {verse.text}
              </p>
            ))}
          </div>

          {verses.length === 0 && (
            <p className="mt-6 text-slate-600">
              No verses were found for this chapter.
            </p>
          )}
        </section>

        <BibleVerseExplorer
          bookName={book.name}
          chapterNumber={chapterNumber}
          verses={verses}
        />

        <footer className="mt-6 text-center text-sm text-[#14213d]/60">
          Scripture text: Berean Standard Bible (BSB).
        </footer>
      </div>
    </main>
  );
}
