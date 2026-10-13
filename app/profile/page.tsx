
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError || !data.user) {
        window.location.replace("/login");
        return;
      }

      setEmail(data.user.email ?? "");
      setFullName(data.user.user_metadata?.full_name ?? "");
      setLoading(false);
    }

    void loadProfile();
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (updateError) throw updateError;

      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      window.location.replace("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign out."
      );
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ed] text-[#14213d]">
        Loading your profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ed] text-[#14213d]">
      <nav className="border-b border-[#14213d]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-black tracking-tight">
            IDEA<span className="text-[#d6a72c]">BULB</span>.AI
          </a>
          <a href="/think-tank" className="text-sm font-bold hover:text-[#8b6b11]">
            My Think Tank
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b6b11]">
          Account settings
        </p>
        <h1 className="mt-3 text-5xl font-black">My Profile</h1>
        <p className="mt-4 text-lg leading-8 text-[#14213d]/65">
          Manage your IdeaBulb account and keep your personal thinking space
          connected to you.
        </p>

        <form
          onSubmit={saveProfile}
          className="mt-9 space-y-6 rounded-[2rem] border border-[#14213d]/10 bg-white p-7 shadow-sm sm:p-10"
        >
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-bold">
              Display name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={100}
              placeholder="What should we call you?"
              className="w-full rounded-xl border border-[#14213d]/15 bg-[#f8f5ed] px-4 py-3 outline-none focus:border-[#d6a72c]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-bold">
              Email address
            </label>
            <input
              id="email"
              value={email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-[#14213d]/10 bg-gray-100 px-4 py-3 text-[#14213d]/60"
            />
            <p className="mt-2 text-xs text-[#14213d]/50">
              Your email is displayed here but cannot be changed on this page.
            </p>
          </div>

          {message && (
            <p role="status" className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
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
            disabled={saving}
            className="rounded-full bg-[#14213d] px-7 py-4 text-sm font-black text-white hover:bg-[#1c2e52] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <div className="mt-6 rounded-[2rem] border border-[#14213d]/10 bg-white p-7 sm:p-10">
          <h2 className="text-2xl font-black">Password and security</h2>
          <p className="mt-3 leading-7 text-[#14213d]/65">
            Need to change your password? Request a secure password-reset
            email.
          </p>
          <a
            href="/forgot-password"
            className="mt-5 inline-flex rounded-full border border-[#14213d]/20 px-6 py-3 text-sm font-bold hover:bg-[#f8f5ed]"
          >
            Reset Password
          </a>
        </div>

        <div className="mt-6 rounded-[2rem] border border-red-200 bg-white p-7 sm:p-10">
          <h2 className="text-2xl font-black">Sign out</h2>
          <p className="mt-3 leading-7 text-[#14213d]/65">
            Sign out of your account on this browser. Your saved Think Tank
            entries remain in your account.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            disabled={signingOut}
            className="mt-5 rounded-full border border-red-200 px-6 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </section>

      <footer className="border-t border-[#14213d]/10 px-6 py-8 text-center text-xs text-[#14213d]/45">
        THINK BEYOND THE PROMPT. · IDEABULB.AI
      </footer>
    </main>
  );
}
