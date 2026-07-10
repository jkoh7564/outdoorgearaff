"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/app/admin/actions";

export function PostDeleteButton({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function confirmDelete() {
    setError("");
    startTransition(async () => {
      const result = await deletePost(postId);
      if (!result.ok) {
        setError((result.errors ?? ["Could not delete post."]).join(" "));
        return;
      }
      setOpen(false);
      window.location.reload();
    });
  }

  return (
    <>
      <button type="button" className="font-bold text-red-700" onClick={() => setOpen(true)}>Delete</button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
          <div className="w-full max-w-md border border-[#d9d4c7] bg-white p-5 shadow-xl">
            <h2 className="text-xl font-bold">Delete this post?</h2>
            <p className="mt-2 text-sm text-[#66736a]">This also removes attached gear items, views, and clicks.</p>
            {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="border border-[#c9c2b4] px-4 py-2 font-bold" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" disabled={isPending} className="bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-60" onClick={confirmDelete}>
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
