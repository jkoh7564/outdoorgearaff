import { AdminNav } from "@/app/admin/AdminNav";
import { PostForm } from "../PostForm";

export default function NewPostPage() {
  return (
    <main className="min-h-screen">
      <AdminNav />
      <section className="mx-auto max-w-4xl px-5 py-8">
        <h1 className="mb-6 text-3xl font-bold">New post</h1>
        <PostForm />
      </section>
    </main>
  );
}
