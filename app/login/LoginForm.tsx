"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/posts";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace(next);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md border border-[#d9d4c7] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Owner login</h1>
        <p className="mt-2 text-sm leading-6 text-[#66736a]">
          Sign in to publish posts, edit gear links, and view admin analytics.
        </p>
      </div>

      {error ? (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold">
          Email
          <input
            type="email"
            autoComplete="email"
            className="border border-[#c9c2b4] px-3 py-2 font-normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="border border-[#c9c2b4] px-3 py-2 font-normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={isPending}
          onClick={submit}
          className="min-h-12 bg-[#176b4d] px-5 py-3 font-bold text-white disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
