import Link from "next/link";
import { AdminNav } from "@/app/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { BulkScheduler } from "./BulkScheduler";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .returns<Post[]>();

  const rows = posts ?? [];
  const planned = rows.filter((post) => post.scheduled_at || post.status === "draft");

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Content calendar</h1>
          <p className="mt-1 text-[#66736a]">Plan drafts, scheduled posts, and published guides in one place.</p>
        </div>
        {error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{error.message}</div>
        ) : (
          <>
            <div className="mb-6">
              <BulkScheduler posts={planned.map((post) => ({
                id: post.id,
                title: post.title,
                status: post.status,
                scheduled_at: post.scheduled_at,
              }))} />
            </div>
            <div className="grid gap-3">
              {rows.map((post) => (
                <article key={post.id} className="border border-[#d9d4c7] bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase text-[#66736a]">
                        {post.scheduled_at ? new Date(post.scheduled_at).toLocaleString() : post.status}
                      </p>
                      <h2 className="mt-1 text-lg font-bold">{post.title}</h2>
                    </div>
                    <Link className="font-bold text-[#176b4d]" href={`/admin/posts/${post.id}/edit`}>
                      Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </AdminNav>
  );
}
