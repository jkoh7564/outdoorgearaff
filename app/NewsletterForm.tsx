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
    <section className="mt-12 border border-[#d9d4c7] bg-[#1d2520] p-6 text-white shadow-sm sm:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_380px] md:items-end">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[#d9c48f]">
            Trail notes by email
          </p>
          <h2 className="text-3xl font-black">Get new gear guides</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#d8ded9]">
            Join the list for fresh trail-tested picks and seasonal gear updates.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="email"
            placeholder="you@example.com"
            className="min-h-12 border border-[#657268] bg-white px-3 py-2 text-[#1d2520]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            type="button"
            disabled={isPending}
            onClick={submit}
            className="min-h-12 bg-[#d9c48f] px-5 py-2 font-black text-[#1d2520] disabled:opacity-60"
          >
            {isPending ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
      {message ? <p className="mt-3 text-sm font-bold text-[#d9c48f]">{message}</p> : null}
    </section>
  );
}
