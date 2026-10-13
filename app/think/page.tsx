
"use client";

import { useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";

type ThinkingResponse = {
  explore: string;
  challenge: string;
  reflect: string;
  create: string;
  reflectionQuestions: string[];
};

type ReflectionResponse = {
  response: string;
  reflectionQuestions: string[];
};

type SafetyNotice = {
  blocked: true;
  safetyType: "self-harm" | "violence";
  title: string;
  message: string;
  support: string;
};

type VisionRedirect = {
  visionRedirect: true;
  title: string;
  reason: string;
  guidance: string;
  reframeQuestions: string[];
};

type SavedDraft = {
  title: string;
  original_idea: string;
  thinking_response: ThinkingResponse;
  reflection_question: string | null;
  personal_reflection: string | null;
  ai_reflection_response: string | null;
};

const thinkingSteps = [
  { number: "01", title: "Explore", key: "explore" },
  { number: "02", title: "Challenge", key: "challenge" },
  { number: "03", title: "Reflect", key: "reflect" },
  { number: "04", title: "Create", key: "create" },
] as const;

export default function ThinkPage() {
  const [idea, setIdea] = useState("");
  const [thinking, setThinking] = useState<ThinkingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [reflection, setReflection] = useState("");
  const [reflectionResponse, setReflectionResponse] =
    useState<ReflectionResponse | null>(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [safetyNotice, setSafetyNotice] =
    useState<SafetyNotice | null>(null);
  const [visionRedirect, setVisionRedirect] =
    useState<VisionRedirect | null>(null);
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const savedIdea = sessionStorage.getItem("ideabulb_home_idea");

    if (!savedIdea?.trim()) return;

    sessionStorage.removeItem("ideabulb_home_idea");
    setIdea(savedIdea);
    void thinkWithMe(savedIdea);

    // Run once when Think opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function thinkWithMe(prompt?: string) {
    const ideaToThink = (prompt ?? idea).trim();

    if (!ideaToThink || loading) return;

    setIdea(ideaToThink);
    setLoading(true);
    setSafetyNotice(null);
    setVisionRedirect(null);
    setThinking(null);
    setReflectionResponse(null);
    setSelectedQuestion("");
    setReflection("");
    setSaveMessage("");
    setShowSignInPrompt(false);

    try {
      const response = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "initial",
          idea: ideaToThink,
          history: sessionHistory,
        }),
      });

      const data = await response.json();

      if (data.blocked) {
        setSafetyNotice(data);
        return;
      }

      if (data.visionRedirect) {
        setVisionRedirect(data);
        setSessionHistory((previous) => [...previous, ideaToThink]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setThinking(data);
      setSessionHistory((previous) => [...previous, ideaToThink]);

      setTimeout(() => {
        document.getElementById("thinking-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error(error);

      setVisionRedirect({
        visionRedirect: true,
        title: "IDEABULB COULDN'T CONTINUE",
        reason:
          "Something interrupted the thinking session before IDEABULB could respond.",
        guidance: "Please try again in a moment.",
        reframeQuestions: [
          "What are you trying to understand?",
          "What part of this matters most to you?",
          "What would you like to explore next?",
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  function chooseReflectionQuestion(question: string) {
    setSelectedQuestion(question);
    setReflection("");
    setReflectionResponse(null);
    setSafetyNotice(null);
    setVisionRedirect(null);
    setSaveMessage("");

    setTimeout(() => {
      document.getElementById("reflection-box")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  function chooseReframeQuestion(question: string) {
    setIdea(question);
    setVisionRedirect(null);
    setSafetyNotice(null);
    setThinking(null);
    setReflectionResponse(null);
    setSelectedQuestion("");
    setReflection("");
    setSaveMessage("");

    setTimeout(() => {
      document.getElementById("think-input")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  }

  async function continueThinking() {
    if (!selectedQuestion || !reflection.trim() || reflectionLoading) {
      return;
    }

    setReflectionLoading(true);
    setSafetyNotice(null);
    setVisionRedirect(null);
    setSaveMessage("");

    try {
      const response = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reflection",
          idea,
          question: selectedQuestion,
          reflection,
          history: sessionHistory,
        }),
      });

      const data = await response.json();

      if (data.blocked) {
        setSafetyNotice(data);
        return;
      }

      if (data.visionRedirect) {
        setVisionRedirect(data);
        setSessionHistory((previous) => [
          ...previous,
          reflection.trim(),
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setReflectionResponse(data);
      setSessionHistory((previous) => [
        ...previous,
        reflection.trim(),
      ]);

      setTimeout(() => {
        document.getElementById("ideabulb-response")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    } catch (error) {
      console.error(error);

      setVisionRedirect({
        visionRedirect: true,
        title: "IDEABULB COULDN'T CONTINUE",
        reason:
          "Something interrupted the thinking session before IDEABULB could respond.",
        guidance: "Please try again in a moment.",
        reframeQuestions: [
          "What are you trying to understand?",
          "What part of this matters most to you?",
          "What would you like to explore next?",
        ],
      });
    } finally {
      setReflectionLoading(false);
    }
  }

  function resetThinkSession() {
    setIdea("");
    setThinking(null);
    setSelectedQuestion("");
    setReflection("");
    setReflectionResponse(null);
    setSafetyNotice(null);
    setVisionRedirect(null);
    setSessionHistory([]);
    setSaveMessage("");
    setShowSignInPrompt(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void thinkWithMe();
  }

  async function saveToThinkTank() {
    if (!thinking || saveLoading) return;

    setSaveLoading(true);
    setSaveMessage("");
    setShowSignInPrompt(false);

    try {
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError || !data.user) {
        const draft: SavedDraft = {
          title: idea.trim().slice(0, 100) || "My Idea",
          original_idea: idea.trim(),
          thinking_response: thinking,
          reflection_question: selectedQuestion || null,
          personal_reflection: reflection.trim() || null,
          ai_reflection_response: reflectionResponse?.response || null,
        };

        sessionStorage.setItem(
          "ideabulb_pending_think_tank_entry",
          JSON.stringify(draft)
        );

        setShowSignInPrompt(true);
        return;
      }

      const { error } = await supabase
        .from("think_tank_entries")
        .insert({
          user_id: data.user.id,
          title: idea.trim().slice(0, 100) || "My Idea",
          original_idea: idea.trim(),
          thinking_response: thinking,
          reflection_question: selectedQuestion || null,
          personal_reflection: reflection.trim() || null,
          ai_reflection_response: reflectionResponse?.response || null,
        });

      if (error) {
        console.error("Think Tank save error:", error);
        setSaveMessage(
          "We couldn't save this entry. Please try again. If it continues, check that your Think Tank table and security policies are set up."
        );
        return;
      }

      setSaveMessage("Saved to your Think Tank!");
      sessionStorage.removeItem("ideabulb_pending_think_tank_entry");
    } catch (error) {
      console.error(error);
      setSaveMessage(
        "Something went wrong while saving. Please try again."
      );
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] text-[#14213d]">
      <nav className="border-b border-[#14213d]/10 bg-[#f8f5ed]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-9 w-9 rounded-full border-[3px] border-[#d6a72c]" />
              <div className="absolute h-5 w-[3px] bg-[#d6a72c]" />
              <div className="absolute h-[3px] w-5 bg-[#d6a72c]" />
            </div>
            <span className="text-xl font-black tracking-tight">
              IDEA<span className="text-[#d6a72c]">BULB</span>.AI
            </span>
          </a>

          <div className="flex items-center gap-5 text-sm font-medium">
            <a href="/" className="hidden transition hover:text-[#d6a72c] sm:block">
              Home
            </a>
            <a
              href="/think-tank"
              className="transition hover:text-[#d6a72c]"
            >
              Think Tank
            </a>
            <span className="rounded-full border border-[#d6a72c]/40 bg-[#d6a72c]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b6b11]">
              Think
            </span>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6a72c]/40 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8b6b11]">
          <span className="h-2 w-2 rounded-full bg-[#d6a72c]" />
          Your space to explore
        </div>

        <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
          What are you
          <span className="block text-[#d6a72c]">thinking about?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#14213d]/70">
          Bring the idea. Bring the question. Bring the uncertainty.
          IDEABULB helps you explore it without taking your thinking away
          from you.
        </p>

        <form
          id="think-input"
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-[#14213d]/10 bg-white p-4 shadow-[0_20px_70px_rgba(20,33,61,0.08)]"
        >
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="What's on your mind?"
            aria-label="What's on your mind?"
            className="min-h-36 w-full resize-y rounded-2xl border-0 bg-[#f8f5ed] p-6 text-lg outline-none placeholder:text-[#14213d]/35 focus:ring-2 focus:ring-[#d6a72c]/50"
          />

          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="px-2 text-left text-xs leading-5 text-[#14213d]/45">
              IDEABULB is designed to help you think — not think for you.
            </p>
            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="w-full rounded-full bg-[#14213d] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#1c2e52] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {loading ? "Thinking..." : "Explore My Question →"}
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="mx-auto max-w-3xl px-6 pb-12 text-center" role="status">
          <div className="mx-auto mb-4 h-2 w-40 overflow-hidden rounded-full bg-[#d6a72c]/20">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#d6a72c]" />
          </div>
          <p className="text-sm text-[#14213d]/60">
            Let's explore this together...
          </p>
        </div>
      )}

      {safetyNotice && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="overflow-hidden rounded-[2rem] bg-[#14213d] text-white shadow-lg">
            <div className="border-b border-white/10 px-7 py-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d6a72c]">
                Safety Gate
              </p>
              <h2 className="mt-2 text-xl font-black">{safetyNotice.title}</h2>
            </div>
            <div className="px-7 py-8">
              <p className="text-lg font-semibold leading-8">
                {safetyNotice.message}
              </p>
              <p className="mt-5 leading-7 text-white/70">
                {safetyNotice.support}
              </p>
              <button
                onClick={resetThinkSession}
                className="mt-7 rounded-full bg-[#d6a72c] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#14213d]"
              >
                Start a Different Thought
              </button>
            </div>
          </div>
        </section>
      )}

      {visionRedirect && !safetyNotice && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <div className="overflow-hidden rounded-[2rem] border border-[#d6a72c]/30 bg-white shadow-lg">
            <div className="bg-[#14213d] px-7 py-7 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d6a72c]">
                IDEABULB
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {visionRedirect.title}
              </h2>
            </div>

            <div className="px-7 pt-8">
              <p className="text-lg font-semibold leading-8">
                {visionRedirect.reason}
              </p>
              <div className="mt-6 rounded-2xl bg-[#f8f5ed] p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6b11]">
                  A Different Way Forward
                </p>
                <p className="mt-3 leading-7 text-[#14213d]/75">
                  {visionRedirect.guidance}
                </p>
              </div>
            </div>

            <div className="px-7 pb-8 pt-8">
              <h3 className="text-2xl font-black">Start here</h3>
              <div className="mt-6 grid gap-4">
                {(visionRedirect.reframeQuestions ?? []).map(
                  (question, index) => (
                    <button
                      key={`${question}-${index}`}
                      onClick={() => chooseReframeQuestion(question)}
                      className="rounded-2xl border border-[#14213d]/10 bg-[#f8f5ed] p-6 text-left transition hover:border-[#d6a72c]/70 hover:bg-white"
                    >
                      <span className="mr-4 font-black text-[#d6a72c]">
                        0{index + 1}
                      </span>
                      <span className="font-semibold">{question}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {thinking && !safetyNotice && !visionRedirect && (
        <section
          id="thinking-results"
          className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-20"
        >
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b6b11]">
              Your Question
            </p>
            <h2 className="mt-3 break-words text-3xl font-black sm:text-4xl">
              {idea}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {thinkingSteps.map((step) => (
              <article
                key={step.key}
                className="rounded-[2rem] border border-[#14213d]/10 bg-white p-7 shadow-[0_15px_50px_rgba(20,33,61,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.2em] text-[#d6a72c]">
                    {step.number}
                  </span>
                  <span className="rounded-full bg-[#f8f5ed] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#14213d]/50">
                    {step.title}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-black">{step.title}</h3>
                <div className="prose prose-slate mt-4 max-w-none text-[#14213d]/75">
                  <ReactMarkdown>{thinking[step.key]}</ReactMarkdown>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#14213d] text-white">
            <div className="px-7 py-10 sm:px-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d6a72c]">
                Keep Thinking
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Now bring your voice into it.
              </h2>
              <p className="mt-4 leading-7 text-white/65">
                Choose a question that speaks to you. Take a moment to reflect
                on it, then continue exploring.
              </p>

              <div className="mt-8 grid gap-4">
                {(thinking.reflectionQuestions ?? []).map(
                  (question, index) => (
                    <button
                      key={`${question}-${index}`}
                      onClick={() => chooseReflectionQuestion(question)}
                      className={`group rounded-2xl border p-5 text-left transition ${
                        selectedQuestion === question
                          ? "border-[#d6a72c] bg-white/10"
                          : "border-white/10 bg-white/[0.05] hover:border-[#d6a72c]/60 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="mr-4 text-sm font-black text-[#d6a72c]">
                        0{index + 1}
                      </span>
                      <span className="font-semibold leading-7 text-white/85 group-hover:text-white">
                        {question}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {selectedQuestion && (
            <section
              id="reflection-box"
              className="mt-8 rounded-[2rem] border border-[#14213d]/10 bg-white p-7 shadow-sm sm:p-10"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6b11]">
                Your Reflection
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {selectedQuestion}
              </h2>
              <p className="mt-3 leading-7 text-[#14213d]/65">
                There is no right or wrong answer. This is your space to
                think honestly and in your own words.
              </p>

              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="What comes to mind as you sit with this question?"
                className="mt-6 min-h-40 w-full rounded-2xl border border-[#14213d]/10 bg-[#f8f5ed] p-5 leading-7 outline-none focus:border-[#d6a72c] focus:ring-2 focus:ring-[#d6a72c]/20"
              />

              <button
                onClick={() => void continueThinking()}
                disabled={reflectionLoading || !reflection.trim()}
                className="mt-5 rounded-full bg-[#14213d] px-7 py-4 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#1c2e52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {reflectionLoading
                  ? "Exploring Your Reflection..."
                  : "Explore My Reflection →"}
              </button>
            </section>
          )}

          {reflectionResponse && (
            <section
              id="ideabulb-response"
              className="mt-8 rounded-[2rem] border border-[#d6a72c]/30 bg-white p-7 shadow-sm sm:p-10"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6b11]">
                A Thought Partner
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Let's sit with that.
              </h2>
              <div className="prose prose-slate mt-6 max-w-none leading-7">
                <ReactMarkdown>{reflectionResponse.response}</ReactMarkdown>
              </div>

              {reflectionResponse.reflectionQuestions?.length > 0 && (
                <div className="mt-8 border-t border-[#14213d]/10 pt-6">
                  <h3 className="text-lg font-black">Keep exploring</h3>
                  <div className="mt-4 grid gap-3">
                    {reflectionResponse.reflectionQuestions.map(
                      (question, index) => (
                        <button
                          key={`${question}-${index}`}
                          onClick={() => chooseReflectionQuestion(question)}
                          className="rounded-xl border border-[#14213d]/10 bg-[#f8f5ed] p-4 text-left transition hover:border-[#d6a72c]/70"
                        >
                          {question}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="mt-8 rounded-[2rem] border border-[#d6a72c]/30 bg-white p-7 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6b11]">
                  Keep This Thought
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Add it to your Think Tank.
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-[#14213d]/65">
                  Save your original question, the ideas you explored, and
                  your personal reflection so you can revisit them later.
                </p>
              </div>

              <button
                onClick={() => void saveToThinkTank()}
                disabled={saveLoading}
                className="shrink-0 rounded-full bg-[#d6a72c] px-7 py-4 text-sm font-black uppercase tracking-[0.1em] text-[#14213d] transition hover:bg-[#e3b83d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saveLoading ? "Saving..." : "＋ Add to Think Tank"}
              </button>
            </div>

            {saveMessage && (
              <p
                role="status"
                className="mt-5 rounded-xl bg-[#f8f5ed] p-4 text-sm font-semibold"
              >
                {saveMessage}
              </p>
            )}

            {showSignInPrompt && (
              <div className="mt-6 rounded-2xl bg-[#f8f5ed] p-6">
                <h3 className="text-xl font-black">
                  Your ideas deserve a place to live.
                </h3>
                <p className="mt-2 leading-7 text-[#14213d]/70">
                  Create an account or sign in to save this entry to your
                  personal Think Tank. Your current question and reflection
                  are being held in this browser while you choose.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="/signup"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#14213d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1c2e52]"
                  >
                    Create Account
                  </a>
                  <a
                    href="/login"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[#14213d]/20 px-6 py-3 text-sm font-bold transition hover:bg-white"
                  >
                    Sign In
                  </a>
                </div>
                <p className="mt-4 text-xs leading-5 text-[#14213d]/55">
                  After signing in, return to this tab and click “Add to
                  Think Tank” again to save your entry.
                </p>
              </div>
            )}
          </section>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#14213d]/10 pt-8 sm:flex-row">
            <p className="text-sm text-[#14213d]/55">
              Keep asking questions. Keep making room for new ideas.
            </p>
            <button
              onClick={resetThinkSession}
              className="rounded-full border border-[#14213d]/15 px-6 py-3 text-sm font-bold transition hover:border-[#d6a72c] hover:bg-white"
            >
              Explore Another Thought
            </button>
          </div>
        </section>
      )}

      <footer className="border-t border-[#14213d]/10 px-6 py-8 text-center text-xs tracking-wide text-[#14213d]/45">
        THINK BEYOND THE PROMPT. · IDEABULB.AI
      </footer>
    </main>
  );
}
