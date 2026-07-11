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
  const [
    { data: posts, error: postsError },
    { data: views },
    { data: clicks },
    { data: conversions },
    { count: subscriberCount },
  ] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }).returns<Post[]>(),
    supabase.from("page_views").select("post_id, created_at"),
    supabase.from("click_events").select("post_id, created_at"),
    supabase.from("affiliate_conversions").select("sale_amount, commission_amount"),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
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
  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
  const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const averageCtr = totalViews > 0 ? totalClicks / totalViews : 0;
  const totalRevenue = (conversions ?? []).reduce((sum, row) => sum + Number(row.sale_amount ?? 0), 0);
  const totalCommission = (conversions ?? []).reduce((sum, row) => sum + Number(row.commission_amount ?? 0), 0);
  const bestPost = rows[0];
  const needsAttention = rows.find((row) => row.flag === "Cold") ?? rows.filter((row) => row.views > 0).at(-1);

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Performance command center</p>
            <h1 className="mt-2 text-3xl font-black text-[#18231d]">Dashboard</h1>
            <p className="mt-1 text-[#66736a]">Views, clicks, CTR, revenue, and audience signals from live rows.</p>
          </div>
          <Link href="/admin/posts/new" className="inline-flex min-h-11 items-center justify-center bg-[#176b4d] px-4 py-2 font-bold text-white">
            New post
          </Link>
        </div>
        {postsError ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{postsError.message}</div>
        ) : rows.length > 0 ? (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Views", totalViews.toLocaleString()],
                ["Clicks", totalClicks.toLocaleString()],
                ["Avg CTR", `${Math.round(averageCtr * 100)}%`],
                ["Commission", `$${totalCommission.toFixed(2)}`],
                ["Subscribers", (subscriberCount ?? 0).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="border border-[#d9d4c7] bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#66736a]">{label}</p>
                  <p className="mt-2 text-3xl font-black text-[#18231d]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              {bestPost ? (
                <section className="border border-[#b8d8ca] bg-[#f0f8f4] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Best performing</p>
                  <h2 className="mt-2 text-xl font-black">{bestPost.post.title}</h2>
                  <p className="mt-2 text-sm text-[#56635b]">
                    {bestPost.views} views, {bestPost.clicks} clicks, {Math.round(bestPost.ctr * 100)}% CTR
                  </p>
                  <Link href={`/admin/posts/${bestPost.post.id}/edit`} className="mt-4 inline-flex font-black text-[#176b4d]">
                    Edit post
                  </Link>
                </section>
              ) : null}
              {needsAttention ? (
                <section className="border border-[#ead6a8] bg-[#fff8e7] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a5b11]">Needs attention</p>
                  <h2 className="mt-2 text-xl font-black">{needsAttention.post.title}</h2>
                  <p className="mt-2 text-sm text-[#6f5a31]">
                    {needsAttention.flag === "Cold" ? "Cold post with no clicks." : "Lowest active CTR in the current set."}
                  </p>
                  <Link href={`/admin/posts/${needsAttention.post.id}/edit`} className="mt-4 inline-flex font-black text-[#9a5b11]">
                    Refresh post
                  </Link>
                </section>
              ) : null}
            </div>

            <div className="overflow-x-auto border border-[#d9d4c7] bg-white shadow-sm">
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
          </>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-6">No analytics yet.</div>
        )}
      </section>
    </AdminNav>
  );
}
