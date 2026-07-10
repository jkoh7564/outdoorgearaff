import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { ShopButton, ViewTracker } from "./Trackers";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post, error } = await getPostBySlug(slug);

  if (error || !post) notFound();

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <ViewTracker postId={post.id} />
      <header className="border-b border-[#d9d4c7] bg-[#fffdf7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-bold">OutdoorGearAff</Link>
          <Link href="/admin/dashboard" className="text-sm font-bold text-[#176b4d]">Dashboard</Link>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-5 py-8">
        {post.hero_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.hero_image_url} alt="" className="mb-8 h-[360px] w-full object-cover" />
        ) : null}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-[#176b4d]">
              Gear guide
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
            <div className="mt-6 whitespace-pre-wrap text-lg leading-8 text-[#37443b]">
              {post.body}
            </div>
          </div>

          <aside className="space-y-4">
            {post.gear_items.length > 0 ? (
              post.gear_items.map((item) => (
                <section key={item.id} className="border border-[#d9d4c7] bg-white p-5">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt="" className="mb-4 h-40 w-full object-cover" />
                  ) : null}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#66736a]">
                        {item.category || "Gear"}
                      </p>
                      <h2 className="mt-1 text-xl font-bold">{item.name}</h2>
                    </div>
                    {item.price_display ? (
                      <span className="shrink-0 font-bold text-[#176b4d]">{item.price_display}</span>
                    ) : null}
                  </div>
                  {item.features?.length ? (
                    <div className="mb-4">
                      <h3 className="mb-2 text-sm font-bold">Features</h3>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#4c5a51]">
                        {item.features.map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  {item.benefits?.length ? (
                    <div className="mb-5">
                      <h3 className="mb-2 text-sm font-bold">Benefits</h3>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#4c5a51]">
                        {item.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  <ShopButton postId={post.id} gearItemId={item.id} />
                </section>
              ))
            ) : (
              <section className="border border-[#d9d4c7] bg-white p-5 text-[#66736a]">
                No gear items are attached to this post yet.
              </section>
            )}
          </aside>
        </div>
      </article>
    </main>
  );
}
