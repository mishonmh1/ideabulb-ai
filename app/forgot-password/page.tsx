
"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendResetEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) throw resetError;

      setMessage(
        "If an account exists for that email, a password-reset link will be sent. Check your inbox and spam folder."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't request a password reset. Please try again."
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
          Account recovery
        </p>
        <h1 className="mt-3 text-4xl font-black">Forgot password?</h1>
        <p className="mt-4 leading-7 text-[#14213d]/65">
          Enter the email address associated with your account. We'll send
          instructions to reset your password if an account matches.
        </p>

        <form onSubmit={sendResetEmail} className="mt-8 space-y-5">
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
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
            />
          </div>

          {message && (
            <p role="status" className="rounded-xl bg-green-50 p-4 text-sm leading-6 text-green-800">
              {message}
            </p>
          )}

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#14213d] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-white hover:bg-[#1c2e52] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <a
          href="/login"
          className="mt-6 block text-center text-sm font-bold text-[#8b6b11] underline"
        >
          Back to Sign In
        </a>
      </div>
    </main>
  );
}
