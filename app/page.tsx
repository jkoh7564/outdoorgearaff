import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { ensureSeedData } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSeedData();
  const { data: posts, error } = await getPublishedPosts();

  return (
    <main className="min-h-screen">
      <header className="border-b border-[#d9d4c7] bg-[#fffdf7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-bold">OutdoorGearAff</Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-[#425047]">
            <Link href="/admin/posts">Posts</Link>
            <Link href="/admin/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#176b4d]">
              Field-tested recommendations
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Gear guides that turn trail research into confident buys.
            </h1>
          </div>
          <Link
            href="/admin/posts/new"
            className="inline-flex min-h-11 items-center justify-center bg-[#176b4d] px-5 py-3 text-sm font-bold text-white"
          >
            New post
          </Link>
        </div>

        {error ? (
          <div className="border border-red-200 bg-red-50 p-5 text-red-700">
            Could not load posts: {error.message}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden border border-[#d9d4c7] bg-white">
                {post.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.hero_image_url}
                    alt=""
                    className="h-48 w-full object-cover"
                  />
                ) : null}
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-[#66736a]">
                    <span>{post.gear_items?.[0]?.category ?? "Gear guide"}</span>
                    <span>{post.gear_items?.length ?? 0} items</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="line-clamp-3 text-sm leading-6 text-[#56635b]">
                    {post.seo_description || post.body || "Open the guide for the full rundown."}
                  </p>
                  <Link href={`/posts/${post.slug}`} className="inline-flex font-bold text-[#176b4d]">
                    Read guide
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-8">
            <h2 className="text-2xl font-bold">No posts yet</h2>
            <p className="mt-2 text-[#66736a]">Create and publish the first gear guide to make it visible here.</p>
          </div>
        )}
      </section>
    </main>
  );
}
