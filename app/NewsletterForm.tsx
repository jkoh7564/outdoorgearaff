"use client";

import { useState, useTransition } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      const payload = await response.json();
      setMessage(response.ok ? "You are on the list." : payload.error ?? "Could not subscribe.");
      if (response.ok) setEmail("");
    });
  }

  return (
    <section className="mt-10 border border-[#d9d4c7] bg-[#fffdf7] p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_360px] md:items-end">
        <div>
          <h2 className="text-2xl font-bold">Get new gear guides</h2>
          <p className="mt-2 text-sm leading-6 text-[#66736a]">
            Join the list for fresh trail-tested picks and seasonal gear updates.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="email"
            placeholder="you@example.com"
            className="min-h-11 border border-[#c9c2b4] px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="button"
            disabled={isPending}
            onClick={submit}
            className="min-h-11 bg-[#176b4d] px-5 py-2 font-bold text-white disabled:opacity-60"
          >
            {isPending ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-[#176b4d]">{message}</p> : null}
    </section>
  );
}
