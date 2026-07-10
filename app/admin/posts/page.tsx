import Link from "next/link";
import { AdminNav } from "@/app/admin/AdminNav";
import { getAdminPosts } from "@/lib/posts";
import { PostDeleteButton } from "./PostDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const { data: posts, error } = await getAdminPosts();

  return (
    <main className="min-h-screen">
      <AdminNav />
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts</h1>
            <p className="mt-1 text-[#66736a]">Create, edit, publish, unpublish, and remove gear guides.</p>
          </div>
          <Link href="/admin/posts/new" className="bg-[#176b4d] px-4 py-3 font-bold text-white">New post</Link>
        </div>
        {error ? (
          <div className="border border-red-200 bg-red-50 p-4 text-red-700">{error.message}</div>
        ) : posts && posts.length > 0 ? (
          <div className="overflow-x-auto border border-[#d9d4c7] bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#f0ece2]">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Gear</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-[#e5dfd2]">
                    <td className="p-4 font-bold">{post.title}</td>
                    <td className="p-4">
                      <span className={post.status === "published" ? "bg-green-100 px-2 py-1 font-bold text-green-800" : "bg-stone-200 px-2 py-1 font-bold text-stone-700"}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">{post.gear_items.length}</td>
                    <td className="p-4 text-[#66736a]">{post.slug}</td>
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
    </main>
  );
}
