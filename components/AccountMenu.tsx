
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountMenu() {
  const [checked, setChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setSignedIn(!!data.user);
      setChecked(true);
    }

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
      setChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setBusy(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error.message);
      setBusy(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-end gap-2 rounded-2xl border border-[#14213d]/10 bg-[#f8f5ed]/95 p-3 shadow-lg backdrop-blur">
      <a
        href="/think-tank"
        className="rounded-full px-3 py-2 text-xs font-bold text-[#14213d] hover:bg-white"
      >
        Think Tank
      </a>

      <a
        href="/bible"
        className="rounded-full bg-[#d6a72c]/15 px-3 py-2 text-xs font-bold text-[#14213d] hover:bg-[#d6a72c]/30"
      >
        Bible
      </a>

      {!checked ? (
        <span className="px-3 py-2 text-xs text-[#14213d]/50">
          Account...
        </span>
      ) : signedIn ? (
        <>
          <a
            href="/profile"
            className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#14213d] hover:text-[#8b6b11]"
          >
            My Profile
          </a>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={busy}
            className="rounded-full bg-[#14213d] px-3 py-2 text-xs font-bold text-white hover:bg-[#1c2e52] disabled:opacity-50"
          >
            {busy ? "Signing out..." : "Sign Out"}
          </button>
        </>
      ) : (
        <>
          <a
            href="/login"
            className="rounded-full px-3 py-2 text-xs font-bold text-[#14213d] hover:bg-white"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="rounded-full bg-[#d6a72c] px-3 py-2 text-xs font-bold text-[#14213d] hover:bg-[#e3b83d]"
          >
            Sign Up
          </a>
        </>
      )}
    </div>
  );
}
