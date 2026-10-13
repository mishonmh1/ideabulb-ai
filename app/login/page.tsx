
"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      window.location.assign("/think-tank");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed] px-6 py-12 text-[#14213d]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#14213d]/10 bg-white p-8 shadow-lg sm:p-10">
        <a href="/" className="text-xl font-black tracking-tight">
          IDEA<span className="text-[#d6a72c]">BULB</span>.AI
        </a>

        <p className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-[#8b6b11]">
          Welcome back
        </p>
        <h1 className="mt-3 text-4xl font-black">Sign in.</h1>
        <p className="mt-3 leading-7 text-[#14213d]/65">
          Return to your ideas, questions, and reflections.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
              placeholder="Enter your password"
            />
            <div className="mt-2 text-right">
              <a
                href="/forgot-password"
                className="text-sm font-semibold text-[#8b6b11] underline"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#14213d] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white hover:bg-[#1c2e52] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#14213d]/65">
          Don't have an account?{" "}
          <a href="/signup" className="font-bold text-[#8b6b11] underline">
            Create one
          </a>
        </p>

        <a
          href="/"
          className="mt-5 block text-center text-sm font-semibold text-[#14213d]/55 hover:text-[#14213d]"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}
