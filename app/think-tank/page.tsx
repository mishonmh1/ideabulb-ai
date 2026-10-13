
"use client";

import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";

type ThinkTankEntry = {
  id: string;
  title: string;
  original_idea: string;
  thinking_response: {
    explore?: string;
    challenge?: string;
    reflect?: string;
    create?: string;
    reflectionQuestions?: string[];
  } | null;
  reflection_question: string | null;
  personal_reflection: string | null;
  ai_reflection_response: string | null;
  created_at: string;
};

export default function ThinkTankPage() {
  const [entries, setEntries] = useState<ThinkTankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        setSignedIn(false);
        setEntries([]);
        return;
      }

      setSignedIn(true);

      // Automatically save a pending entry after authentication.
      const pendingDraft = sessionStorage.getItem(
        "ideabulb_pending_think_tank_entry"
      );

      if (pendingDraft) {
        try {
          const draft = JSON.parse(pendingDraft);

          const { error: saveError } = await supabase
            .from("think_tank_entries")
            .insert({
              user_id: authData.user.id,
              title: draft.title,
              original_idea: draft.original_idea,
              thinking_response: draft.thinking_response,
              reflection_question: draft.reflection_question ?? null,
              personal_reflection: draft.personal_reflection ?? null,
              ai_reflection_response:
                draft.ai_reflection_response ?? null,
            });

          if (saveError) throw saveError;

          sessionStorage.removeItem(
            "ideabulb_pending_think_tank_entry"
          );
        } catch (draftError) {
          console.error("Pending entry save failed:", draftError);
          setError(
            "You're signed in, but we couldn't save your pending entry. Please try again."
          );
        }
      }

      // Load the signed-in user's entries. Supabase RLS protects ownership.
      const { data, error: queryError } = await supabase
        .from("think_tank_entries")
        .select(
          "id, title, original_idea, thinking_response, reflection_question, personal_reflection, ai_reflection_response, created_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setEntries((data ?? []) as ThinkTankEntry[]);
    } catch (err) {
      console.error("Think Tank load error:", err);
      setError(
        "We couldn't load your Think Tank. Please refresh the page and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  async function deleteEntry(id: string) {
    if (
      !window.confirm(
        "Delete this Think Tank entry? This cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const supabase = createClient();

      const { error: deleteError } = await supabase
        .from("think_tank_entries")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setEntries((previous) =>
        previous.filter((entry) => entry.id !== id)
      );

      setExpandedId(null);
    } catch (err) {
      console.error(err);
      setError("We couldn't delete that entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] text-[#14213d]">
      <nav className="border-b border-[#14213d]/10">
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

          <div className="flex items-center gap-5 text-sm font-semibold">
            <a href="/" className="hover:text-[#8b6b11]">Home</a>
            <a href="/think" className="hover:text-[#8b6b11]">Think</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b6b11]">
            Your personal space
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">
            The <span className="text-[#d6a72c]">Think Tank.</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#14213d]/70">
            A place for the ideas you're exploring, the questions you're
            asking, and the reflections you want to revisit.
          </p>
        </div>

        {loading && (
          <div className="mt-12 rounded-3xl bg-white p-10 text-center">
            <p className="font-semibold">Opening your Think Tank...</p>
          </div>
        )}

        {!loading && !signedIn && (
          <div className="mt-12 rounded-[2rem] border border-[#d6a72c]/30 bg-white p-8 sm:p-12">
            <h2 className="text-3xl font-black">
              Your ideas belong here.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#14213d]/70">
              Sign in to revisit your saved thoughts, or create a free
              account to start building your collection. You can still
              use Think without an account.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/signup"
                className="rounded-full bg-[#14213d] px-7 py-4 text-sm font-black text-white hover:bg-[#1c2e52]"
              >
                Create Free Account
              </a>
              <a
                href="/login"
                className="rounded-full border border-[#14213d]/20 px-7 py-4 text-sm font-bold hover:bg-[#f8f5ed]"
              >
                Sign In
              </a>
            </div>
          </div>
        )}

        {!loading && signedIn && (
          <>
            <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Your saved ideas</h2>
                <p className="mt-1 text-sm text-[#14213d]/60">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"} saved
                </p>
              </div>
              <a
                href="/think"
                className="inline-flex w-fit rounded-full bg-[#d6a72c] px-6 py-3 text-sm font-black text-[#14213d] hover:bg-[#e3b83d]"
              >
                + Explore a New Idea
              </a>
            </div>

            {entries.length === 0 && (
              <div className="mt-6 rounded-[2rem] border border-dashed border-[#14213d]/20 bg-white p-10 text-center sm:p-14">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d6a72c]/15 text-3xl">
                  ✦
                </div>
                <h3 className="mt-5 text-2xl font-black">
                  Your next big thought starts here.
                </h3>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-[#14213d]/65">
                  Explore an idea on the Think page and select
                  “Add to Think Tank” to save it here.
                </p>
                <a
                  href="/think"
                  className="mt-6 inline-flex rounded-full bg-[#14213d] px-7 py-4 text-sm font-bold text-white hover:bg-[#1c2e52]"
                >
                  Start Thinking
                </a>
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {entries.map((entry) => {
                const expanded = expandedId === entry.id;

                const sections = [
                  ["Explore", entry.thinking_response?.explore],
                  ["Challenge", entry.thinking_response?.challenge],
                  ["Reflect", entry.thinking_response?.reflect],
                  ["Create", entry.thinking_response?.create],
                ] as const;

                return (
                  <article
                    key={entry.id}
                    className="overflow-hidden rounded-[1.75rem] border border-[#14213d]/10 bg-white shadow-sm"
                  >
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[#f8f5ed] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#8b6b11]">
                          Saved thought
                        </span>
                        <span className="text-xs text-[#14213d]/45">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="mt-5 break-words text-2xl font-black">
                        {entry.title}
                      </h3>
                      <p className="mt-3 whitespace-pre-wrap leading-7 text-[#14213d]/70">
                        {entry.original_idea}
                      </p>

                      {entry.personal_reflection && (
                        <div className="mt-5 rounded-2xl bg-[#f8f5ed] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8b6b11]">
                            Your reflection
                          </p>
                          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[#14213d]/75">
                            {entry.personal_reflection}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            setExpandedId(expanded ? null : entry.id)
                          }
                          className="rounded-full bg-[#14213d] px-5 py-3 text-sm font-bold text-white hover:bg-[#1c2e52]"
                        >
                          {expanded ? "Show Less" : "Read Entry"}
                        </button>
                        <button
                          onClick={() => void deleteEntry(entry.id)}
                          disabled={deletingId === entry.id}
                          className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === entry.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>

                      {expanded && (
                        <div className="mt-7 space-y-6 border-t border-[#14213d]/10 pt-6">
                          {entry.reflection_question && (
                            <div>
                              <h4 className="font-black">Reflection question</h4>
                              <p className="mt-2 leading-7 text-[#14213d]/70">
                                {entry.reflection_question}
                              </p>
                            </div>
                          )}

                          {sections.map(([heading, content]) =>
                            content ? (
                              <div key={heading}>
                                <h4 className="font-black">{heading}</h4>
                                <div className="prose prose-slate mt-2 max-w-none text-sm leading-7">
                                  <ReactMarkdown>{content}</ReactMarkdown>
                                </div>
                              </div>
                            ) : null
                          )}

                          {entry.personal_reflection && (
                            <div>
                              <h4 className="font-black">Your reflection</h4>
                              <p className="mt-2 whitespace-pre-wrap leading-7 text-[#14213d]/70">
                                {entry.personal_reflection}
                              </p>
                            </div>
                          )}

                          {entry.ai_reflection_response && (
                            <div>
                              <h4 className="font-black">IDEABULB's response</h4>
                              <div className="prose prose-slate mt-2 max-w-none text-sm leading-7">
                                <ReactMarkdown>
                                  {entry.ai_reflection_response}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {error && (
          <div role="alert" className="mt-6 rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-800">
            {error}
            <button
              onClick={() => void loadEntries()}
              className="ml-3 underline"
            >
              Try again
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-[#14213d]/10 px-6 py-8 text-center text-xs tracking-wide text-[#14213d]/45">
        THINK BEYOND THE PROMPT. · IDEABULB.AI
      </footer>
    </main>
  );
}
