"use client";

import { useState } from "react";

const features = [
  {
    title: "Think",
    description: "Ask better questions. Explore deeper ideas.",
    icon: "✦",
    accent: "purple",
  },
  {
    title: "Learn",
    description: "Grow your knowledge. Build new skills.",
    icon: "◫",
    accent: "gold",
  },
  {
    title: "Create",
    description: "Bring your ideas to life. Make an impact.",
    icon: "✎",
    accent: "teal",
  },
  {
    title: "Ministry",
    description: "Faith in action. Ideas for a more just world.",
    icon: "♡",
    accent: "rose",
  },
];

export default function Home() {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idea.trim()) return;

    alert(`Your idea: ${idea}`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#151827]">
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          {/* Small bulb logo */}
          <div className="relative flex h-12 w-10 items-center justify-center">
            <div className="absolute h-9 w-7 rounded-[50%] border-[3px] border-[#d99b08]" />
            <div className="absolute h-5 w-1 border-x-[3px] border-[#d99b08]" />
            <div className="absolute bottom-0 h-2 w-6 rounded-b-md border-b-[3px] border-[#d99b08]" />
            <div className="absolute h-5 w-[3px] bg-[#d99b08]" />
            <div className="absolute h-[3px] w-5 bg-[#d99b08]" />
          </div>

          <div>
            <div className="text-xl font-semibold tracking-[0.12em] md:text-2xl">
              IDEA<span className="text-[#c9900a]">BULB</span>.AI
            </div>
            <div className="hidden text-[9px] tracking-[0.35em] text-slate-500 sm:block">
              THINK BEYOND THE PROMPT.
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-10 md:flex">
          {["Think", "Learn", "Create", "Ministry", "About"].map(
            (item, index) => (
              <button
                key={item}
                className={`relative text-sm transition ${
                  index === 0
                    ? "font-medium text-[#151827]"
                    : "text-slate-600 hover:text-[#151827]"
                }`}
              >
                {item}
                {index === 0 && (
                  <span className="absolute -bottom-3 left-0 h-[2px] w-full bg-[#d99b08]" />
                )}
              </button>
            )
          )}
        </div>

        <button className="rounded-full border border-[#d99b08] px-5 py-2.5 text-sm font-medium transition hover:bg-[#d99b08] hover:text-white">
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-8 pt-12 md:px-12 md:pt-20">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Hero copy */}
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-slate-500">
              <span>FAITH</span>
              <span>×</span>
              <span>IDEAS</span>
              <span>×</span>
              <span>IMPACT</span>
            </div>

            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
              Brighter
              <br />
              Ideas for a
              <br />
              <span className="text-[#d39a10]">Bigger Tomorrow.</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              IDEABULB.AI helps you think deeper, learn faster, and create what
              matters — for your purpose, your community, and a more just
              world.
            </p>
          </div>

          {/* Cross bulb */}
          <div className="relative flex min-h-[390px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="relative flex h-[290px] w-[220px] flex-col items-center">
              {/* Glass bulb */}
              <div className="relative h-[245px] w-[210px] rounded-[50%_50%_46%_46%] border-[5px] border-white/80 bg-white/25 shadow-[0_0_60px_rgba(231,174,35,0.35)] backdrop-blur-sm">
                {/* Cross */}
                <div className="absolute left-1/2 top-1/2 h-[150px] w-[28px] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#ffd75c] shadow-[0_0_25px_rgba(255,190,40,0.95)]" />

                <div className="absolute left-1/2 top-[43%] h-[28px] w-[125px] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#ffd75c] shadow-[0_0_25px_rgba(255,190,40,0.95)]" />

                {/* Glass highlight */}
                <div className="absolute left-8 top-10 h-24 w-5 rotate-[18deg] rounded-full bg-white/60 blur-sm" />
              </div>

              {/* Bulb neck */}
              <div className="-mt-2 h-8 w-24 rounded-b-lg bg-gradient-to-b from-[#e7b33a] to-[#b87900] shadow-lg" />

              {/* Bulb screw */}
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
              <div className="mt-1 h-4 w-36 rounded-full bg-[#d5ad52] shadow-xl" />
            </div>
          </div>
        </div>

        {/* Idea input */}
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-6 flex max-w-5xl items-center rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_12px_45px_rgba(30,40,70,0.08)]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl text-[#d99b08]">
            💡
          </div>

          <input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="What's on your mind?"
            className="h-12 flex-1 bg-transparent px-2 text-lg outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5c85a] text-2xl transition hover:scale-105 hover:bg-[#e9b52f]"
          >
            ↑
          </button>
        </form>

        {/* Quick actions */}
        <div className="mx-auto mt-5 grid max-w-5xl gap-4 md:grid-cols-3">
          <ActionCard
            title="Explore an Idea"
            description="Discover new possibilities"
            icon="✦"
            style="purple"
          />

          <ActionCard
            title="Challenge My Thinking"
            description="Get a fresh perspective"
            icon="↗"
            style="teal"
          />

          <ActionCard
            title="Create Something"
            description="Turn ideas into action"
            icon="✎"
            style="orange"
          />
        </div>
      </section>

      {/* Main feature cards */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Footer statement */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-10 pt-6 md:flex-row md:items-end md:justify-between md:px-12">
        <div className="border-l-2 border-[#e1ad2b] pl-5">
          <p className="font-serif text-lg italic text-slate-700">
            “For where your treasure is, there your heart will be also.”
          </p>
          <p className="mt-2 text-xs tracking-[0.25em] text-slate-500">
            MATTHEW 6:21
          </p>
        </div>

        <div className="flex gap-6 text-xs tracking-[0.2em] text-slate-500">
          <span>PEOPLE</span>
          <span>IDEAS</span>
          <span>PURPOSE</span>
          <span>IMPACT</span>
        </div>
      </footer>
    </main>
  );
}

function ActionCard({
  title,
  description,
  icon,
  style,
}: {
  title: string;
  description: string;
  icon: string;
  style: "purple" | "teal" | "orange";
}) {
  const styles = {
    purple: "border-purple-200 bg-purple-50/70 text-purple-600",
    teal: "border-teal-200 bg-teal-50/70 text-teal-600",
    orange: "border-orange-200 bg-orange-50/70 text-orange-600",
  };

  return (
    <button
      className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${styles[style]}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold text-slate-800">{title}</span>
        <span className="text-sm text-slate-500">{description}</span>
      </span>
      <span className="text-xl">→</span>
    </button>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  accent,
}: {
  title: string;
  description: string;
  icon: string;
  accent: string;
}) {
  const accents: Record<string, string> = {
    purple: "text-purple-600 bg-purple-50",
    gold: "text-amber-600 bg-amber-50",
    teal: "text-teal-600 bg-teal-50",
    rose: "text-rose-500 bg-rose-50",
  };

  return (
    <button className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${accents[accent]}`}
      >
        {icon}
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 leading-6 text-slate-500">{description}</p>

      <div className="mt-5 text-right text-slate-400 transition group-hover:translate-x-1">
        →
      </div>
    </button>
  );
}