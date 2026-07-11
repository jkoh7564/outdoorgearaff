"use client";

import { useState, useTransition } from "react";
import { bulkSchedulePosts } from "@/app/admin/actions";

type SchedulablePost = {
  id: string;
  title: string;
  status: string;
  scheduled_at: string | null;
};

export function BulkScheduler({ posts }: { posts: SchedulablePost[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [startAt, setStartAt] = useState("");
  const [spacingDays, setSpacingDays] = useState(2);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function schedule() {
    setMessage("");
    startTransition(async () => {
      const result = await bulkSchedulePosts(selected, startAt, spacingDays);
      setMessage(result.ok ? "Schedule updated." : result.errors?.join(" ") ?? "Could not schedule posts.");
    });
  }

  return (
    <section className="border border-[#d9d4c7] bg-white p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Bulk schedule posts</h2>
        <p className="mt-1 text-sm leading-6 text-[#66736a]">Select draft or planned posts, then stagger scheduled dates.</p>
      </div>
      <div className="grid gap-3">
        {posts.map((post) => (
          <label key={post.id} className="flex items-center justify-between gap-3 border border-[#e5dfd2] px-3 py-2 text-sm">
            <span>
              <input type="checkbox" className="mr-3" checked={selected.includes(post.id)} onChange={() => toggle(post.id)} />
              <span className="font-bold">{post.title}</span>
            </span>
            <span className="text-[#66736a]">{post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : post.status}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto] md:items-end">
        <label className="grid gap-2 text-sm font-bold">
          Start date
          <input type="datetime-local" className="border border-[#c9c2b4] px-3 py-2 font-normal" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Spacing days
          <input type="number" min="0" className="border border-[#c9c2b4] px-3 py-2 font-normal" value={spacingDays} onChange={(event) => setSpacingDays(Number(event.target.value))} />
        </label>
        <button type="button" disabled={isPending} onClick={schedule} className="min-h-11 bg-[#176b4d] px-5 py-2 font-bold text-white disabled:opacity-60">
          {isPending ? "Scheduling..." : "Schedule"}
        </button>
      </div>
      {message ? <p className="mt-3 text-sm font-semibold text-[#176b4d]">{message}</p> : null}
    </section>
  );
}
