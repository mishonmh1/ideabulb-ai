
import fs from "node:fs";
import path from "node:path";
import * as usfm from "usfm-js";

export type BibleBook = {
  id: string;
  name: string;
};

export type BibleVerse = {
  number: string;
  text: string;
};

const BIBLE_DIRECTORY = path.join(
  process.cwd(),
  "data",
  "bsb_usfm"
);

const BOOKS: BibleBook[] = [
  ["GEN", "Genesis"], ["EXO", "Exodus"], ["LEV", "Leviticus"],
  ["NUM", "Numbers"], ["DEU", "Deuteronomy"], ["JOS", "Joshua"],
  ["JDG", "Judges"], ["RUT", "Ruth"], ["1SA", "1 Samuel"],
  ["2SA", "2 Samuel"], ["1KI", "1 Kings"], ["2KI", "2 Kings"],
  ["1CH", "1 Chronicles"], ["2CH", "2 Chronicles"],
  ["EZR", "Ezra"], ["NEH", "Nehemiah"], ["EST", "Esther"],
  ["JOB", "Job"], ["PSA", "Psalms"], ["PRO", "Proverbs"],
  ["ECC", "Ecclesiastes"], ["SNG", "Song of Solomon"],
  ["ISA", "Isaiah"], ["JER", "Jeremiah"], ["LAM", "Lamentations"],
  ["EZK", "Ezekiel"], ["DAN", "Daniel"], ["HOS", "Hosea"],
  ["JOL", "Joel"], ["AMO", "Amos"], ["OBA", "Obadiah"],
  ["JON", "Jonah"], ["MIC", "Micah"], ["NAM", "Nahum"],
  ["HAB", "Habakkuk"], ["ZEP", "Zephaniah"], ["HAG", "Haggai"],
  ["ZEC", "Zechariah"], ["MAL", "Malachi"],
  ["MAT", "Matthew"], ["MRK", "Mark"], ["LUK", "Luke"],
  ["JHN", "John"], ["ACT", "Acts"], ["ROM", "Romans"],
  ["1CO", "1 Corinthians"], ["2CO", "2 Corinthians"],
  ["GAL", "Galatians"], ["EPH", "Ephesians"], ["PHP", "Philippians"],
  ["COL", "Colossians"], ["1TH", "1 Thessalonians"],
  ["2TH", "2 Thessalonians"], ["1TI", "1 Timothy"],
  ["2TI", "2 Timothy"], ["TIT", "Titus"], ["PHM", "Philemon"],
  ["HEB", "Hebrews"], ["JAS", "James"], ["1PE", "1 Peter"],
  ["2PE", "2 Peter"], ["1JN", "1 John"], ["2JN", "2 John"],
  ["3JN", "3 John"], ["JUD", "Jude"], ["REV", "Revelation"],
].map(([id, name]) => ({ id, name }));

function loadBook(bookId: string): any {
  const filePath = path.join(BIBLE_DIRECTORY, `${bookId}.usfm`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Bible file not found: ${bookId}`);
  }

  const source = fs.readFileSync(filePath, "utf8");
  return usfm.toJSON(source);
}

export function getBibleBooks(): BibleBook[] {
  return BOOKS;
}

export function getBibleChapter(
  bookId: string,
  chapterNumber: number
): BibleVerse[] {
  const book = BOOKS.find((item) => item.id === bookId);

  if (!book) {
    throw new Error("Unknown Bible book.");
  }

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    throw new Error("Invalid chapter number.");
  }

  const parsed = loadBook(bookId);
  const chapter = parsed.chapters?.[String(chapterNumber)];

  if (!chapter) {
    throw new Error(`Chapter ${chapterNumber} not found in ${book.name}.`);
  }

  return Object.entries(chapter)
    .filter(([key, value]) =>
      /^\d+$/.test(key) &&
      value !== null &&
      typeof value === "object" &&
      Array.isArray((value as any).verseObjects)
    )
    .map(([number, value]) => {
      const verseObjects = (value as any).verseObjects;

      const text = verseObjects
        .filter((item: any) => item.type === "text")
        .map((item: any) => item.text ?? "")
        .join("")
        .replace(/\s+/g, " ")
        .trim();

      return { number, text };
    })
    .filter((verse) => verse.text.length > 0)
    .sort((a, b) => Number(a.number) - Number(b.number));
}

export function getBibleChapterCount(bookId: string): number {
  const book = BOOKS.find((item) => item.id === bookId);

  if (!book) {
    throw new Error("Unknown Bible book.");
  }

  const parsed = loadBook(bookId);
  const chapters = Object.keys(parsed.chapters ?? {}).filter((key) =>
    /^\d+$/.test(key)
  );

  return chapters.length;
}
