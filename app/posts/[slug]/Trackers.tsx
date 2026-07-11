"use client";

import { useEffect, useState } from "react";

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    void fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, referrer: document.referrer || "direct" }),
    });
  }, [postId]);

  return null;
}

export function ShopButton({
  postId,
  gearItemId,
}: {
  postId: string;
  gearItemId: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function trackAndRedirect() {
    setState("loading");
    const response = await fetch("/api/track/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        gear_item_id: gearItemId,
        referrer: document.referrer || "direct",
      }),
    });

    if (!response.ok) {
      setState("error");
      return;
    }

    const payload = (await response.json()) as { affiliate_url: string };
    window.location.href = payload.affiliate_url;
  }

  return (
    <div>
      <button
        type="button"
        onClick={trackAndRedirect}
        disabled={state === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center bg-[#176b4d] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0f4d38] disabled:opacity-60"
      >
        {state === "loading" ? "Opening..." : "Shop Now"}
      </button>
      {state === "error" ? (
        <p className="mt-2 text-sm font-semibold text-red-700">Could not track this click. Please try again.</p>
      ) : null}
    </div>
  );
}
