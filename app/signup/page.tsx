
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        setMessage(
          "Your account was created successfully! You are signed in."
        );
      } else {
        setMessage(
          "Thanks for joining IdeaBulb! Check your email for a confirmation link before signing in."
        );
      }

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("IdeaBulb sign-up error:", err);

      setError(
        err instanceof Error
          ? `Sign-up error: ${err.message}`
          : "An unexpected error occurred. Check the browser console."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] px-5 py-12 text-[#14213d]">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-semibold hover:underline">
          ← Back to IdeaBulb
        </Link>

        <div className="mt-8 rounded-3xl border border-[#14213d]/10 bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-7 text-center">
            {/* IdeaBulb logo with cross */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#14213d]">
              <svg
                viewBox="0 0 64 64"
                className="h-12 w-12"
                fill="none"
                aria-label="IdeaBulb lightbulb with a cross"
                role="img"
              >
                <path
                  d="M32 7C20 7 12 16 12 27c0 8 4 13 10 19h20c6-6 10-11 10-19C52 16 44 7 32 7Z"
                  stroke="#d6a72c"
                  strokeWidth="3"
                />
                <path
                  d="M32 17v25M21 29h22"
                  stroke="#d6a72c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M23 48h18M25 53h14M28 58h8"
                  stroke="#d6a72c"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold tracking-[0.2em] text-[#b18a20]">
              THINK BEYOND THE PROMPT.
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Make room for new ideas, deeper questions, and personal
              reflection.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Your name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d6a72c] focus:ring-2 focus:ring-[#d6a72c]/30"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d6a72c] focus:ring-2 focus:ring-[#d6a72c]/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d6a72c] focus:ring-2 focus:ring-[#d6a72c]/30"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#d6a72c] focus:ring-2 focus:ring-[#d6a72c]/30"
                placeholder="Enter your password again"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-xl bg-green-50 p-3 text-sm leading-6 text-green-800"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#14213d] px-5 py-3 font-semibold text-white transition hover:bg-[#203456] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating your account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#14213d] underline decoration-[#d6a72c] underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-gray-500">
          Your ideas are yours. We&apos;re building IdeaBulb to give you space
          to explore and reflect.
        </p>
      </div>
    </main>
  );
}
