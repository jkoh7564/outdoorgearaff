import Link from "next/link";
import { AdminNav } from "@/app/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = {
  post: Post;
  views: number;
  clicks: number;
  ctr: number;
  flag: "Hot" | "Cold" | "";
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: posts, error: postsError }, { data: views }, { data: clicks }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }).returns<Post[]>(),
    supabase.from("page_views").select("post_id, created_at"),
    supabase.from("click_events").select("post_id, created_at"),
  ]);

  const rows: Row[] = (posts ?? [])
    .map((post) => {
      const viewCount = (views ?? []).filter((view) => view.post_id === post.id).length;
      const clickCount = (clicks ?? []).filter((click) => click.post_id === post.id).length;
      const recentCutoff = Date.now() - 7 * 86_400_000;
      const recentViews = (views ?? []).filter(
        (view) => view.post_id === post.id && new Date(view.created_at).getTime() >= recentCutoff,
      ).length;
      const recentClicks = (clicks ?? []).filter(
        (click) => click.post_id === post.id && new Date(click.created_at).getTime() >= recentCutoff,
      ).length;
      const recentCtr = recentViews > 0 ? recentClicks / recentViews : 0;
      const ctr = viewCount > 0 ? clickCount / viewCount : 0;
      const ageDays = post.published_at
        ? (Date.now() - new Date(post.published_at).getTime()) / 86_400_000
        : 0;
      const flag: Row["flag"] = recentCtr > 0.15 ? "Hot" : ageDays > 14 && clickCount === 0 ? "Cold" : "";
      return { post, views: viewCount, clicks: clickCount, ctr, flag };
    })
    .sort((a, b) => b.ctr - a.ctr);

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-[#66736a]">Views, clicks, CTR, and hot/cold flags are calculated from live event rows.</p>
        </div>
        {postsError ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{postsError.message}</div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto border border-[#d9d4c7] bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#f0ece2]">
                <tr>
                  <th className="p-4">Post</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Views</th>
                  <th className="p-4 text-right">Clicks</th>
                  <th className="p-4 text-right">CTR</th>
                  <th className="p-4">Flag</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.post.id} className="border-t border-[#e5dfd2]">
                    <td className="p-4 font-bold">{row.post.title}</td>
                    <td className="p-4">{row.post.status}</td>
                    <td className="p-4 text-right">{row.views}</td>
                    <td className="p-4 text-right">{row.clicks}</td>
                    <td className="p-4 text-right">{Math.round(row.ctr * 100)}%</td>
                    <td className="p-4">
                      {row.flag ? (
                        <span className={row.flag === "Hot" ? "bg-green-100 px-2 py-1 font-bold text-green-800" : "bg-amber-100 px-2 py-1 font-bold text-amber-800"}>
                          {row.flag}
                        </span>
                      ) : (
                        <span className="text-[#66736a]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link className="font-bold text-[#176b4d]" href={`/admin/posts/${row.post.id}/edit`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-6">No analytics yet.</div>
        )}
      </section>
    </AdminNav>
  );
}
