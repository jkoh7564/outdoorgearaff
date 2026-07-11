import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { ensureSeedData } from "@/lib/seed";
import { NewsletterForm } from "./NewsletterForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSeedData();
  const { data: posts, error } = await getPublishedPosts();
  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1) ?? [];
  const categories = Array.from(
    new Set((posts ?? []).flatMap((post) => post.gear_items.map((item) => item.category).filter(Boolean))),
  ).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <header className="border-b border-[#d9d4c7] bg-[#fffdf7]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">OutdoorGearAff</Link>
          <nav className="flex items-center gap-5 text-sm font-bold text-[#425047]">
            <Link href="#guides">Guides</Link>
            <Link href="#newsletter">Newsletter</Link>
            <Link href="/admin/posts" className="hidden sm:inline">Owner</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        {error ? (
          <div className="border border-red-200 bg-red-50 p-5 text-red-700">
            Could not load posts: {error.message}
          </div>
        ) : featuredPost ? (
          <>
            <section className="grid gap-6 border border-[#d9d4c7] bg-[#fffdf7] p-4 shadow-sm lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
              <div className="flex flex-col justify-between gap-8 p-2 sm:p-4">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#176b4d]">
                    Field-tested outdoor buying guides
                  </p>
                  <h1 className="max-w-3xl text-4xl font-black leading-[1.02] text-[#18231d] sm:text-6xl">
                    Confident gear decisions for the next trail day.
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-[#56635b] sm:text-lg">
                    Practical product notes, clear benefits, and tracked affiliate recommendations for hikers, campers, and weekend explorers.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/posts/${featuredPost.slug}`}
                    className="inline-flex min-h-12 items-center justify-center bg-[#176b4d] px-6 py-3 text-sm font-black text-white"
                  >
                    Read latest guide
                  </Link>
                  <Link
                    href="#guides"
                    className="inline-flex min-h-12 items-center justify-center border border-[#b8ad9d] px-6 py-3 text-sm font-black text-[#1d2520]"
                  >
                    Browse all guides
                  </Link>
                </div>
              </div>
              <Link href={`/posts/${featuredPost.slug}`} className="group overflow-hidden bg-[#1d2520]">
                {featuredPost.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredPost.hero_image_url}
                    alt=""
                    className="h-72 w-full object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] sm:h-[460px]"
                  />
                ) : null}
                <div className="bg-[#1d2520] p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d9c48f]">
                    Featured guide
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-tight">{featuredPost.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#d8ded9]">
                    {featuredPost.seo_description || featuredPost.body}
                  </p>
                </div>
              </Link>
            </section>

            {categories.length > 0 ? (
              <section className="mt-8 flex flex-wrap items-center gap-3">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[#66736a]">Popular categories</span>
                {categories.map((category) => (
                  <span key={category} className="border border-[#d9d4c7] bg-white px-3 py-2 text-sm font-bold text-[#37443b]">
                    {category}
                  </span>
                ))}
              </section>
            ) : null}

            <section id="guides" className="mt-12">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Latest gear guides</p>
                  <h2 className="mt-2 text-3xl font-black text-[#18231d]">Recently published</h2>
                </div>
                <p className="text-sm font-bold text-[#66736a]">{posts?.length ?? 0} guides available</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {[featuredPost, ...otherPosts].map((post) => (
                  <article key={post.id} className="group overflow-hidden border border-[#d9d4c7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <Link href={`/posts/${post.slug}`}>
                      {post.hero_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.hero_image_url}
                          alt=""
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </Link>
                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.08em] text-[#66736a]">
                        <span className="text-[#176b4d]">{post.gear_items?.[0]?.category ?? "Gear guide"}</span>
                        <span>{post.gear_items?.length ?? 0} picks</span>
                      </div>
                      <h3 className="text-2xl font-black leading-tight text-[#18231d]">
                        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="line-clamp-3 text-sm leading-6 text-[#56635b]">
                        {post.seo_description || post.body || "Open the guide for the full rundown."}
                      </p>
                      <Link href={`/posts/${post.slug}`} className="inline-flex min-h-10 items-center font-black text-[#176b4d]">
                        Read guide
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="border border-[#d9d4c7] bg-white p-8">
            <h2 className="text-2xl font-bold">No posts yet</h2>
            <p className="mt-2 text-[#66736a]">Create and publish the first gear guide to make it visible here.</p>
          </div>
        )}
        <div id="newsletter">
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
