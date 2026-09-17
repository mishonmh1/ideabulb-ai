"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const thinkingSteps = [
  {
    number: "01",
    title: "Explore",
    key: "explore",
    icon: "✦",
    description: "Expand the idea and discover possibilities.",
  },
  {
    number: "02",
    title: "Challenge",
    key: "challenge",
    icon: "↗",
    description: "Question assumptions and consider another perspective.",
  },
  {
    number: "03",
    title: "Reflect",
    key: "reflect",
    icon: "◌",
    description: "Slow down and think about what really matters.",
  },
  {
    number: "04",
    title: "Create",
    key: "create",
    icon: "✎",
    description: "Turn your thinking into something you can use.",
  },
];

type ThinkingResponse = {
  explore: string;
  challenge: string;
  reflect: string;
  create: string;
  reflectionQuestions: string[];
};

export default function ThinkPage() {
  const [idea, setIdea] = useState("");
  const [thinking, setThinking] = useState<ThinkingResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [reflection, setReflection] = useState("");

  const [reflectionResponse, setReflectionResponse] = useState("");
  const [deeperQuestions, setDeeperQuestions] = useState<string[]>([]);
  const [reflectionLoading, setReflectionLoading] = useState(false);

  async function thinkWithMe() {
    if (!idea.trim()) return;

    setLoading(true);
    setThinking(null);
    setSelectedQuestion("");
    setReflection("");
    setReflectionResponse("");
    setDeeperQuestions([]);

    try {
      const response = await fetch("/api/think", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "initial",
          idea,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setThinking(data);
    } catch (error) {
      console.error(error);

      setThinking({
        explore: "We couldn't complete the thinking session.",
        challenge: "",
        reflect: "",
        create: "",
        reflectionQuestions: [],
      });
    } finally {
      setLoading(false);
    }
  }

  function chooseReflectionQuestion(question: string) {
    setSelectedQuestion(question);
    setReflection("");
    setReflectionResponse("");
    setDeeperQuestions([]);

    setTimeout(() => {
      document.getElementById("reflection-box")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  async function continueThinking() {
    if (!selectedQuestion || !reflection.trim()) return;

    setReflectionLoading(true);
    setReflectionResponse("");
    setDeeperQuestions([]);

    try {
      const response = await fetch("/api/think", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "reflection",
          idea,
          question: selectedQuestion,
          reflection,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setReflectionResponse(data.response);
      setDeeperQuestions(data.reflectionQuestions || []);
    } catch (error) {
      console.error(error);

      setReflectionResponse(
        "I couldn't continue the reflection right now. Please try again."
      );
    } finally {
      setReflectionLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#151827]">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between border-b border-slate-200/70 px-8 py-6">
        <a href="/" className="flex items-center gap-3">
          <div className="text-3xl text-[#d99b00]">✝</div>

          <div>
            <div className="text-xl font-semibold tracking-[0.18em]">
              IDEABULB<span className="text-[#d99b00]">.AI</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-slate-500">
              THINK BEYOND THE PROMPT.
            </div>
          </div>
        </a>

        <div className="flex items-center gap-8 text-sm">
          <a
            href="/think"
            className="border-b-2 border-[#d99b00] pb-2 text-[#d99b00]"
          >
            Think
          </a>

          <a href="/" className="text-slate-600 hover:text-[#151827]">
            Learn
          </a>

          <a href="/" className="text-slate-600 hover:text-[#151827]">
            Create
          </a>

          <a href="/" className="text-slate-600 hover:text-[#151827]">
            Ministry
          </a>

          <a href="/" className="text-slate-600 hover:text-[#151827]">
            About
          </a>
        </div>

        <button className="rounded-full border border-[#d99b00] px-6 py-2 text-sm">
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <div className="mb-5 text-xs tracking-[0.4em] text-[#6b7d99]">
            THINK WITH PURPOSE
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            What are you
            <span className="block text-[#d99b00]">
              thinking about?
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Bring IDEABULB an idea, question, problem, or possibility.
            We&apos;ll help you think through it — not just answer it.
          </p>
        </div>

        {/* IDEA INPUT */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Start with an idea..."
              className="min-h-44 w-full resize-none rounded-2xl border-0 bg-transparent p-5 text-lg outline-none placeholder:text-slate-400"
            />

            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-sm text-slate-400">
                {idea.length} characters
              </span>

              <button
                onClick={thinkWithMe}
                disabled={loading || !idea.trim()}
                className="rounded-full bg-[#d99b00] px-7 py-3 font-medium text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Think With Me →"}
              </button>
            </div>
          </div>
        </div>

        {/* THINKING RESULTS */}
        {thinking && (
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="mb-8 text-center">
              <div className="text-xs tracking-[0.3em] text-[#6b7d99]">
                YOUR IDEABULB SESSION
              </div>

              <h2 className="mt-3 text-3xl font-bold">
                Let&apos;s think this through.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {thinkingSteps.map((step) => (
                <div
                  key={step.key}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.25em] text-[#d99b00]">
                        {step.number}
                      </div>

                      <h3 className="mt-2 text-2xl font-semibold">
                        {step.title}
                      </h3>
                    </div>

                    <div className="text-2xl text-[#d99b00]">
                      {step.icon}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-6 text-base leading-8 text-slate-700">
                    <ReactMarkdown>
                      {thinking[step.key as keyof ThinkingResponse] as string}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>

            {/* KEEP THINKING */}
            {thinking.reflectionQuestions.length > 0 && (
              <div className="mt-10 rounded-3xl bg-[#151827] p-8 text-white">
                <div className="text-xs tracking-[0.3em] text-[#d99b00]">
                  KEEP THINKING
                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  Choose a question to reflect on.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  There&apos;s no perfect answer. Choose the question
                  that makes you want to stop and think.
                </p>

                <div className="mt-7 space-y-3">
                  {thinking.reflectionQuestions.map(
                    (question, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          chooseReflectionQuestion(question)
                        }
                        className={`group w-full rounded-2xl border p-5 text-left transition ${
                          selectedQuestion === question
                            ? "border-[#d99b00] bg-[#d99b00]/10"
                            : "border-slate-700 hover:border-[#d99b00]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-base leading-7">
                            {question}
                          </span>

                          <span className="shrink-0 text-[#d99b00] transition group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* REFLECTION */}
            {selectedQuestion && (
              <div
                id="reflection-box"
                className="mt-8 rounded-3xl border border-[#d99b00]/40 bg-white p-8 shadow-lg"
              >
                <div className="text-xs tracking-[0.3em] text-[#d99b00]">
                  REFLECTION
                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  Let&apos;s reflect on this.
                </h2>

                <div className="mt-6 rounded-2xl bg-[#faf9f6] p-6">
                  <p className="text-lg font-medium leading-8 text-[#151827]">
                    {selectedQuestion}
                  </p>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-500">
                  Take a moment. You don&apos;t need to have the
                  perfect answer. Write what comes to mind.
                </p>

                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write your reflection here..."
                  className="mt-5 min-h-40 w-full resize-none rounded-2xl border border-slate-200 bg-white p-5 text-base outline-none focus:border-[#d99b00]"
                />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {reflection.length} characters
                  </span>

                  <button
                    type="button"
                    onClick={continueThinking}
                    disabled={
                      !reflection.trim() || reflectionLoading
                    }
                    className="rounded-full bg-[#d99b00] px-7 py-3 font-medium text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {reflectionLoading
                      ? "Thinking Deeper..."
                      : "Continue Thinking →"}
                  </button>
                </div>
              </div>
            )}

            {/* DEEPER RESPONSE */}
            {reflectionResponse && (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
                <div className="text-xs tracking-[0.3em] text-[#d99b00]">
                  IDEABULB RESPONSE
                </div>

                <h2 className="mt-3 text-2xl font-semibold">
                  Let&apos;s go a little deeper.
                </h2>

                <div className="mt-6 text-base leading-8 text-slate-700">
                  <ReactMarkdown>
                    {reflectionResponse}
                  </ReactMarkdown>
                </div>

                {deeperQuestions.length > 0 && (
                  <div className="mt-8">
                    <div className="text-xs tracking-[0.3em] text-[#6b7d99]">
                      KEEP THINKING
                    </div>

                    <h3 className="mt-2 text-xl font-semibold">
                      Where do you want to go next?
                    </h3>

                    <div className="mt-5 space-y-3">
                      {deeperQuestions.map((question, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            chooseReflectionQuestion(question)
                          }
                          className="group w-full rounded-2xl border border-slate-200 p-5 text-left transition hover:border-[#d99b00] hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="leading-7">
                              {question}
                            </span>

                            <span className="shrink-0 text-[#d99b00] transition group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* IDEABULB METHOD */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <div className="text-xs tracking-[0.3em] text-[#6b7d99]">
              THE IDEABULB METHOD
            </div>

            <h2 className="mt-3 text-3xl font-bold">
              Don&apos;t just get an answer.
              <span className="text-[#d99b00]"> Think.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {thinkingSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#d99b00]">
                    {step.number}
                  </span>

                  <span className="text-xl text-[#d99b00]">
                    {step.icon}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PHILOSOPHY */}
        <div className="mt-20 rounded-3xl bg-[#151827] px-8 py-12 text-center text-white">
          <div className="text-3xl text-[#d99b00]">💡</div>

          <h2 className="mt-4 text-2xl font-semibold">
            AI should expand your thinking,
            <br />
            not replace it.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            IDEABULB is designed to help you ask better questions,
            examine possibilities, challenge assumptions, and turn
            ideas into action.
          </p>
        </div>
      </section>
    </main>
  );
}