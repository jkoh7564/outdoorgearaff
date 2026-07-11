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
      <header className="border-b border-[#d9d4c7] bg-[#fffdf7]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">OutdoorGearAff</Link>
          <nav className="flex items-center gap-5 text-sm font-bold text-[#425047]">
            <Link href="/">Guides</Link>
            <Link href="/admin/dashboard" className="hidden sm:inline">Editorial Studio</Link>
          </nav>
        </div>
      </header>

      <article>
        <section className="mx-auto max-w-6xl px-5 py-8">
          <div className="grid gap-6 border border-[#d9d4c7] bg-[#fffdf7] p-4 shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:p-6">
            {post.hero_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.hero_image_url} alt="" className="h-72 w-full object-cover sm:h-[460px]" />
            ) : null}
            <div className="flex flex-col justify-center p-2 sm:p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#176b4d]">
                Gear guide
              </p>
              <h1 className="text-4xl font-black leading-[1.04] text-[#18231d] sm:text-6xl">{post.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#56635b]">
                {post.seo_description || "A practical outdoor gear guide with product notes, benefits, and affiliate recommendations."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.08em] text-[#66736a]">
                <span className="border border-[#d9d4c7] bg-white px-3 py-2">{post.gear_items.length} gear picks</span>
                <span className="border border-[#d9d4c7] bg-white px-3 py-2">Reader-supported guide</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-12 lg:grid-cols-[1fr_380px]">
          <div className="border border-[#d9d4c7] bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-[#176b4d]">
              Gear guide
            </p>
            <div className="whitespace-pre-wrap text-lg leading-8 text-[#37443b]">
              {post.body}
            </div>
            <div className="mt-8 border-t border-[#e5dfd2] pt-5 text-sm leading-6 text-[#66736a]">
              Affiliate disclosure: shopping links may support the site, and clicks are recorded for analytics.
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="border border-[#d9d4c7] bg-[#1d2520] p-5 text-white shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d9c48f]">Recommended gear</p>
              <h2 className="mt-2 text-2xl font-black">Shop the picks</h2>
              <p className="mt-2 text-sm leading-6 text-[#d8ded9]">
                Compare the highlighted items and open the affiliate link when one fits your kit.
              </p>
            </div>
            {post.gear_items.length > 0 ? (
              post.gear_items.map((item) => (
                <section key={item.id} className="overflow-hidden border border-[#d9d4c7] bg-white shadow-sm">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt="" className="h-44 w-full object-cover" />
                  ) : null}
                  <div className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-[#66736a]">
                          {item.category || "Gear"}
                        </p>
                        <h3 className="mt-1 text-2xl font-black leading-tight text-[#18231d]">{item.name}</h3>
                      </div>
                      {item.price_display ? (
                        <span className="shrink-0 bg-[#f0ece2] px-3 py-2 font-black text-[#176b4d]">{item.price_display}</span>
                      ) : null}
                    </div>
                    {item.features?.length ? (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-black">Features</h4>
                        <ul className="grid gap-2 text-sm text-[#4c5a51]">
                          {item.features.map((feature) => <li key={feature} className="border-l-2 border-[#d9c48f] pl-3">{feature}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {item.benefits?.length ? (
                      <div className="mb-5">
                        <h4 className="mb-2 text-sm font-black">Benefits</h4>
                        <ul className="grid gap-2 text-sm text-[#4c5a51]">
                          {item.benefits.map((benefit) => <li key={benefit} className="border-l-2 border-[#176b4d] pl-3">{benefit}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    <ShopButton postId={post.id} gearItemId={item.id} />
                    <p className="mt-3 text-xs leading-5 text-[#66736a]">
                      Opens affiliate destination after recording the click.
                    </p>
                  </div>
                </section>
              ))
            ) : (
              <section className="border border-[#d9d4c7] bg-white p-5 text-[#66736a]">
                No gear items are attached to this post yet.
              </section>
            )}
          </aside>
        </section>
      </article>
    </main>
  );
}
