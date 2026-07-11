import Link from "next/link";
import { AdminNav } from "@/app/admin/AdminNav";
import { getAdminPosts } from "@/lib/posts";
import { PostDeleteButton } from "./PostDeleteButton";

export const dynamic = "force-dynamic";

const filters = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Featured", value: "featured" },
  { label: "Scheduled", value: "scheduled" },
];

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const { data: posts, error } = await getAdminPosts();
  const filteredPosts = (posts ?? []).filter((post) => {
    if (filter === "published") return post.status === "published";
    if (filter === "draft") return post.status === "draft";
    if (filter === "featured") return Boolean(post.is_featured);
    if (filter === "scheduled") return Boolean(post.scheduled_at);
    return true;
  });

  return (
    <AdminNav>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Content library</p>
            <h1 className="mt-2 text-3xl font-black text-[#18231d]">Posts</h1>
            <p className="mt-1 text-[#66736a]">Create, edit, publish, unpublish, and remove gear guides.</p>
          </div>
          <Link href="/admin/posts/new" className="inline-flex min-h-11 items-center bg-[#176b4d] px-4 py-2 font-bold text-white">New post</Link>
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <Link
              key={item.value}
              href={item.value === "all" ? "/admin/posts" : `/admin/posts?filter=${item.value}`}
              className={[
                "border px-3 py-2 text-sm font-bold",
                filter === item.value
                  ? "border-[#176b4d] bg-[#176b4d] text-white"
                  : "border-[#d9d4c7] bg-white text-[#425047]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{error.message}</div>
        ) : filteredPosts.length > 0 ? (
          <div className="overflow-x-auto border border-[#d9d4c7] bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#f0ece2]">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Signals</th>
                  <th className="p-4">Gear</th>
                  <th className="p-4">SEO</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t border-[#e5dfd2]">
                    <td className="p-4">
                      <p className="font-black text-[#18231d]">{post.title}</p>
                      <p className="mt-1 text-xs text-[#66736a]">{post.slug}</p>
                    </td>
                    <td className="p-4">
                      <span className={post.status === "published" ? "bg-green-100 px-2 py-1 font-bold text-green-800" : "bg-stone-200 px-2 py-1 font-bold text-stone-700"}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {post.is_featured ? <span className="bg-[#edf7f1] px-2 py-1 text-xs font-bold text-[#176b4d]">Featured</span> : null}
                        {post.scheduled_at ? <span className="bg-[#fff4d6] px-2 py-1 text-xs font-bold text-[#8a5a10]">Scheduled</span> : null}
                        {!post.is_featured && !post.scheduled_at ? <span className="text-[#66736a]">-</span> : null}
                      </div>
                    </td>
                    <td className="p-4">{post.gear_items.length}</td>
                    <td className="p-4">{post.seo_score === null ? "-" : `${post.seo_score}/100`}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-4">
                        {post.status === "published" ? <Link className="font-bold text-[#176b4d]" href={`/posts/${post.slug}`}>View</Link> : null}
                        <Link className="font-bold text-[#176b4d]" href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                        <PostDeleteButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-6">No posts yet.</div>
        )}
      </section>
    </AdminNav>
  );
}
