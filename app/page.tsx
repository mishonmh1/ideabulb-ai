
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = idea.trim();

    if (!question) {
      setError("Start with a question or idea you'd like to explore.");
      return;
    }

    try {
      sessionStorage.setItem("ideabulb_home_idea", question);
      router.push("/think");
    } catch {
      setError("Please allow session storage in your browser and try again.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ed] text-[#14213d]">
      {/* Navigation */}
      <header className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <BulbLogo />

          <span>
            <span className="block text-lg font-black tracking-[0.08em] sm:text-2xl">
              IDEA<span className="text-[#d6a72c]">BULB</span>.AI
            </span>

            <span className="block text-[8px] tracking-[0.23em] text-[#52627d] sm:text-[10px]">
              THINK BEYOND THE PROMPT.
            </span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/bible"
            className="rounded-full px-3 py-2.5 text-xs font-bold text-[#14213d] transition hover:bg-[#14213d]/5 hover:text-[#b18a20] sm:px-5 sm:text-sm"
          >
            Bible
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-[#14213d] px-4 py-2.5 text-xs font-bold transition hover:bg-[#14213d] hover:text-white sm:px-7 sm:text-sm"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-[#d6a72c] px-4 py-2.5 text-xs font-bold text-[#14213d] transition hover:bg-[#c3951e] sm:px-7 sm:text-sm"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-10 lg:px-12 lg:pb-20 lg:pt-12">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[480px] w-[700px] max-w-full -translate-x-1/2 rounded-full bg-amber-100/70 blur-3xl" />

        <div className="relative grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Headline */}
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-[#52627d] sm:text-xs">
              <span>FAITH</span>
              <span>×</span>
              <span>IDEAS</span>
              <span>×</span>
              <span>IMPACT</span>
            </div>

            <h1 className="text-[clamp(3.1rem,7.5vw,6.3rem)] font-black leading-[0.91] tracking-[-0.055em]">
              Brighter
              <br />
              Ideas for a
              <br />
              <span className="text-[#d6a72c]">Bigger</span>
              <br />
              <span className="text-[#d6a72c]">Tomorrow.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#52627d] sm:text-lg sm:leading-8">
              IDEABULB.AI helps you explore questions, challenge assumptions,
              discover new perspectives, and reflect on the ideas that matter
              to you.
            </p>
          </div>

          {/* Glowing bulb with cross */}
          <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[390px]">
            <div className="absolute h-64 w-64 rounded-full bg-amber-300/40 blur-3xl sm:h-80 sm:w-80" />

            <div className="relative flex h-[290px] w-[230px] flex-col items-center sm:scale-110">
              {/* Glass */}
              <div className="relative h-[220px] w-[205px] rounded-[50%_50%_46%_46%] border-[5px] border-white/90 bg-white/30 shadow-[0_0_65px_rgba(231,174,35,0.4)] backdrop-blur-sm sm:h-[245px] sm:w-[220px]">
                {/* Vertical cross */}
                <div className="absolute left-1/2 top-1/2 h-[125px] w-[27px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#ffd75c] shadow-[0_0_28px_rgba(255,190,40,0.95)] sm:h-[145px]" />

                {/* Horizontal cross */}
                <div className="absolute left-1/2 top-[43%] h-[27px] w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#ffd75c] shadow-[0_0_28px_rgba(255,190,40,0.95)] sm:w-[130px]" />

                {/* Glass highlight */}
                <div className="absolute left-8 top-8 h-20 w-5 rotate-[18deg] rounded-full bg-white/60 blur-sm" />
              </div>

              {/* Neck */}
              <div className="-mt-2 h-8 w-24 rounded-b-lg bg-gradient-to-b from-[#e7b33a] to-[#b87900] shadow-lg" />

              {/* Screw */}
              <div className="relative h-14 w-28">
                {[0, 1, 2, 3].map((line) => (
                  <div
                    key={line}
                    className="absolute left-0 h-2 w-full rounded-full bg-[#c58a0c] shadow-sm"
                    style={{ top: `${line * 12}px` }}
                  />
                ))}
              </div>

              {/* Base */}
              <div className="mt-1 h-3 w-36 rounded-full bg-[#d5ad52] shadow-xl" />
            </div>
          </div>
        </div>

        {/* Main question box */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 mx-auto mt-5 flex max-w-5xl items-center gap-2 rounded-[2rem] border border-[#e8dfcc] bg-white/90 p-2 shadow-[0_12px_45px_rgba(30,40,70,0.08)] sm:mt-0 sm:gap-3 sm:p-3"
        >
          <div className="flex h-11 w-10 shrink-0 items-center justify-center text-2xl text-[#d6a72c] sm:h-12 sm:w-12">
            💡
          </div>

          <input
            aria-label="Your question or idea"
            value={idea}
            onChange={(event) => {
              setIdea(event.target.value);
              setError("");
            }}
            placeholder="What's on your mind?"
            className="h-12 min-w-0 flex-1 bg-transparent px-1 text-base text-[#14213d] outline-none placeholder:text-[#8b9ab2] sm:text-lg"
          />

          <button
            type="submit"
            aria-label="Explore your idea"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8d98a] text-2xl text-[#14213d] transition hover:scale-105 hover:bg-[#d6a72c] sm:h-14 sm:w-14"
          >
            ↑
          </button>
        </form>

        {error && (
          <p role="alert" className="mx-auto mt-3 max-w-5xl text-sm text-red-700">
            {error}
          </p>
        )}

        <p className="mt-5 text-center text-xs text-[#52627d] sm:text-sm">
          Bring your questions. Explore what unfolds.
        </p>
      </section>

      {/* Purpose */}
      <section className="border-t border-[#14213d]/10 bg-white/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-10 sm:py-16 md:grid-cols-3 lg:px-12">
          <PurposeCard
            number="01"
            title="Explore"
            description="Look beyond the obvious and discover new perspectives."
          />

          <PurposeCard
            number="02"
            title="Question"
            description="Challenge assumptions and make room for deeper thinking."
          />

          <PurposeCard
            number="03"
            title="Reflect"
            description="Connect your ideas to your experiences, values, and beliefs."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
        <div>
          <p className="font-bold tracking-wide">
            IDEA<span className="text-[#d6a72c]">BULB</span>.AI
          </p>
          <p className="mt-1 text-xs tracking-wider text-[#52627d]">
            THINK BEYOND THE PROMPT.
          </p>
        </div>

        <p className="text-sm text-[#52627d]">
          Your questions matter. Your thinking matters.
        </p>

        <div className="flex gap-5 text-sm font-medium">
          <Link href="/login" className="hover:text-[#b18a20]">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-[#b18a20]">
            Create Account
          </Link>
        </div>
      </footer>
    </main>
  );
}

function BulbLogo() {
  return (
    <svg
      viewBox="0 0 48 56"
      className="h-11 w-9 shrink-0"
      fill="none"
      role="img"
      aria-label="IdeaBulb cross logo"
    >
      <circle cx="24" cy="22" r="17" stroke="#d6a72c" strokeWidth="3" />
      <path
        d="M24 11V33M13 22H35"
        stroke="#d6a72c"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M15 43H33M18 48H30M21 52H27"
        stroke="#d6a72c"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PurposeCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[#14213d]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7">
      <p className="text-xs font-black tracking-[0.2em] text-[#c3951e]">
        {number}
      </p>

      <h2 className="mt-3 text-2xl font-extrabold">{title}</h2>

      <p className="mt-3 leading-7 text-[#52627d]">{description}</p>
    </article>
  );
}
