import { notFound } from "next/navigation";
import { AdminNav } from "@/app/admin/AdminNav";
import { getAdminPost } from "@/lib/posts";
import { PostForm } from "../../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: post, error } = await getAdminPost(id);
  if (error || !post) notFound();

  return (
    <AdminNav>
      <section className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="mb-6 text-3xl font-bold">Edit post</h1>
        <PostForm post={post} />
      </section>
    </AdminNav>
  );
}
