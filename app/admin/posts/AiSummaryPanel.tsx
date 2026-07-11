"use client";

import { useState, useTransition } from "react";
import type { PostWithGear } from "@/lib/types";

export function AiSummaryPanel({ post }: { post: PostWithGear }) {
  const [summary, setSummary] = useState(post.ai_summary ?? "");
  const [source, setSource] = useState(post.ai_summary_source ?? "");
  const [confidence, setConfidence] = useState<number | null>(post.ai_summary_confidence);
  const [reviewStatus, setReviewStatus] = useState(post.ai_summary_review_status ?? "unreviewed");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function generateSummary() {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/ai/summarise-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Could not generate summary.");
        return;
      }

      setSummary(payload.summary);
      setSource(payload.source);
      setConfidence(payload.confidence);
      setReviewStatus(payload.review_status);
    });
  }

  return (
    <section className="mb-6 border border-[#d9d4c7] bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">AI post summary</h2>
          <p className="mt-1 text-sm leading-6 text-[#66736a]">
            Generate a review-ready summary with source, confidence, and review status stored on the post.
          </p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={generateSummary}
          className="min-h-11 bg-[#176b4d] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {isPending ? "Generating..." : "Generate summary"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          {error}
        </div>
      ) : null}

      {summary ? (
        <div className="mt-4 grid gap-3">
          <p className="whitespace-pre-wrap text-sm leading-6 text-[#37443b]">{summary}</p>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#66736a]">
            <span className="border border-[#d9d4c7] px-2 py-1">{source || "source pending"}</span>
            <span className="border border-[#d9d4c7] px-2 py-1">
              {confidence === null ? "confidence pending" : `${Math.round(confidence * 100)}% confidence`}
            </span>
            <span className="border border-[#d9d4c7] px-2 py-1">{reviewStatus}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
