"use client";

import { useState, useTransition } from "react";
import type { PostWithGear } from "@/lib/types";

export function SeoPanel({ post }: { post: PostWithGear }) {
  const [score, setScore] = useState<number | null>(post.seo_score);
  const [notes, setNotes] = useState(post.seo_score_notes ?? "");
  const [seoTitle, setSeoTitle] = useState(post.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post.seo_description ?? "");
  const [headlines, setHeadlines] = useState<string[]>(post.headline_suggestions ?? []);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function generateSeo() {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/ai/seo-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Could not generate SEO suggestions.");
        return;
      }

      setScore(payload.score);
      setNotes(payload.notes);
      setSeoTitle(payload.seo_title);
      setSeoDescription(payload.seo_description);
      setHeadlines(payload.headlines);
    });
  }

  return (
    <section className="mb-6 border border-[#d9d4c7] bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">SEO score and headlines</h2>
          <p className="mt-1 text-sm leading-6 text-[#66736a]">
            Score the post and store search-friendly metadata plus headline ideas.
          </p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={generateSeo}
          className="min-h-11 bg-[#176b4d] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {isPending ? "Scoring..." : "Score SEO"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          {error}
        </div>
      ) : null}

      {score !== null ? (
        <div className="mt-4 grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#176b4d] px-3 py-2 text-lg font-bold text-white">{score}/100</span>
            <p className="text-sm leading-6 text-[#37443b]">{notes}</p>
          </div>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="border border-[#d9d4c7] p-3">
              <p className="font-bold">SEO title</p>
              <p className="mt-1 text-[#37443b]">{seoTitle}</p>
            </div>
            <div className="border border-[#d9d4c7] p-3">
              <p className="font-bold">SEO description</p>
              <p className="mt-1 text-[#37443b]">{seoDescription}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Headline ideas</p>
            <ul className="grid gap-2 text-sm text-[#37443b]">
              {headlines.map((headline) => (
                <li key={headline} className="border border-[#d9d4c7] px-3 py-2">{headline}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
