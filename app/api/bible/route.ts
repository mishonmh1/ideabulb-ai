
import { NextRequest, NextResponse } from "next/server";
import {
  getBibleBooks,
  getBibleChapter,
  getBibleChapterCount,
} from "@/lib/bible/reader";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const requestedBook = params.get("book");
    const requestedChapter = Number(params.get("chapter") || "1");

    const books = getBibleBooks().map((book) => ({
      ...book,
      chapterCount: getBibleChapterCount(book.id),
    }));

    if (!requestedBook) {
      return NextResponse.json({ books });
    }

    const selectedBook = books.find(
      (book) =>
        book.id.toLowerCase() === requestedBook.toLowerCase() ||
        book.name.toLowerCase() === requestedBook.toLowerCase()
    );

    if (!selectedBook) {
      return NextResponse.json(
        { error: "Bible book not found." },
        { status: 404 }
      );
    }

    if (
      !Number.isInteger(requestedChapter) ||
      requestedChapter < 1 ||
      requestedChapter > selectedBook.chapterCount
    ) {
      return NextResponse.json(
        { error: "Invalid chapter number." },
        { status: 400 }
      );
    }

    const verses = getBibleChapter(selectedBook.id, requestedChapter).map(
      (verse) => ({
        number: Number(verse.number),
        text: verse.text,
      })
    );

    return NextResponse.json({
      books,
      book: selectedBook,
      chapter: requestedChapter,
      verses,
      translation: "Berean Standard Bible",
    });
  } catch (error) {
    console.error("Bible API error:", error);

    return NextResponse.json(
      { error: "Unable to load this Bible chapter." },
      { status: 500 }
    );
  }
}
