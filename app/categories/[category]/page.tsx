import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShopButton } from "@/app/posts/[slug]/Trackers";

export const dynamic = "force-dynamic";

type CategoryGear = {
  id: string;
  post_id: string;
  name: string;
  category: string | null;
  features: string[] | null;
  benefits: string[] | null;
  affiliate_url: string;
  price_display: string | null;
  image_url: string | null;
  posts: {
    slug: string;
    title: string;
    status: string;
  };
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = decodeURIComponent(category);
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("gear_items")
    .select("*, posts!inner(slug, title, status)")
    .eq("category", categoryName)
    .eq("posts.status", "published")
    .order("created_at", { ascending: false })
    .returns<CategoryGear[]>();

  if (error) {
    throw new Error(error.message);
  }

  if (!items || items.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <header className="border-b border-[#d9d4c7] bg-[#fffdf7]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-xl font-black tracking-tight">OutdoorGearAff</Link>
          <nav className="flex items-center gap-5 text-sm font-bold text-[#425047]">
            <Link href="/#guides">Guides</Link>
            <Link href="/#newsletter">Newsletter</Link>
            <Link href="/admin/posts" className="hidden sm:inline">Editorial Studio</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="mb-8 border border-[#d9d4c7] bg-[#fffdf7] p-6 shadow-sm">
          <Link href="/" className="text-sm font-black text-[#176b4d]">Back to guides</Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-[#176b4d]">
            Category
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight text-[#18231d] sm:text-5xl">
            {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#56635b]">
            All recommended products currently tagged under {categoryName}, with links back to the guide where each item appears.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden border border-[#d9d4c7] bg-white shadow-sm">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-52 w-full object-cover" />
              ) : null}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-[#66736a]">
                      {item.category || "Gear"}
                    </p>
                    <h2 className="mt-1 text-2xl font-black leading-tight text-[#18231d]">{item.name}</h2>
                  </div>
                  {item.price_display ? (
                    <span className="shrink-0 bg-[#f0ece2] px-3 py-2 font-black text-[#176b4d]">
                      {item.price_display}
                    </span>
                  ) : null}
                </div>

                {item.features?.length ? (
                  <div>
                    <p className="mb-2 text-sm font-black">Features</p>
                    <ul className="grid gap-2 text-sm text-[#4c5a51]">
                      {item.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="border-l-2 border-[#d9c48f] pl-3">{feature}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {item.benefits?.length ? (
                  <div>
                    <p className="mb-2 text-sm font-black">Benefits</p>
                    <ul className="grid gap-2 text-sm text-[#4c5a51]">
                      {item.benefits.slice(0, 3).map((benefit) => (
                        <li key={benefit} className="border-l-2 border-[#176b4d] pl-3">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="border-t border-[#e5dfd2] pt-4">
                  <Link href={`/posts/${item.posts.slug}`} className="mb-3 inline-flex font-black text-[#176b4d]">
                    Read guide: {item.posts.title}
                  </Link>
                  <ShopButton postId={item.post_id} gearItemId={item.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
