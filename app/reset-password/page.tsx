
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();

      // Supabase processes the recovery link and establishes a session
      // when the recovery token is valid.
      const { data, error: sessionError } = await supabase.auth.getSession();

      setReady(!sessionError && !!data.session);
      setChecking(false);
    }

    void checkSession();
  }, []);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
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

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setMessage("Your password has been updated. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
      setReady(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't update your password. Request a new reset link and try again."
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
          Account security
        </p>
        <h1 className="mt-3 text-4xl font-black">New password</h1>

        {checking ? (
          <p className="mt-6 text-[#14213d]/65">Checking your reset link...</p>
        ) : message ? (
          <div className="mt-6">
            <p role="status" className="rounded-xl bg-green-50 p-4 text-sm leading-6 text-green-800">
              {message}
            </p>
            <a
              href="/login"
              className="mt-6 inline-flex rounded-full bg-[#14213d] px-6 py-3 text-sm font-bold text-white"
            >
              Go to Sign In
            </a>
          </div>
        ) : !ready ? (
          <div className="mt-6">
            <p className="leading-7 text-[#14213d]/70">
              This reset link may have expired or already been used. Request
              a new link to continue.
            </p>
            <a
              href="/forgot-password"
              className="mt-6 inline-flex rounded-full bg-[#14213d] px-6 py-3 text-sm font-bold text-white"
            >
              Request New Link
            </a>
          </div>
        ) : (
          <>
            <p className="mt-4 leading-7 text-[#14213d]/65">
              Choose a new password with at least 8 characters.
            </p>

            <form onSubmit={updatePassword} className="mt-8 space-y-5">
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#14213d] px-6 py-4 text-sm font-black uppercase tracking-[0.1em] text-white hover:bg-[#1c2e52] disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
