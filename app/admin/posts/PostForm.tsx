"use client";

import { useMemo, useState, useTransition } from "react";
import { savePost } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import type { GearItemInput, PostEditorInput, PostWithGear } from "@/lib/types";

const emptyGearItem: GearItemInput = {
  name: "",
  category: "",
  featuresText: "",
  benefitsText: "",
  affiliate_url: "https://",
  price_display: "",
  image_url: "",
};

function gearInputFromPost(post?: PostWithGear): GearItemInput[] {
  if (!post) return [{ ...emptyGearItem }];
  return post.gear_items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category ?? "",
    featuresText: item.features?.join("\n") ?? "",
    benefitsText: item.benefits?.join("\n") ?? "",
    affiliate_url: item.affiliate_url,
    price_display: item.price_display ?? "",
    image_url: item.image_url ?? "",
  }));
}

export function PostForm({ post }: { post?: PostWithGear }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [heroImageUrl, setHeroImageUrl] = useState(post?.hero_image_url ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [gearItems, setGearItems] = useState<GearItemInput[]>(gearInputFromPost(post));
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const generatedSlug = useMemo(() => slug || slugify(title), [slug, title]);

  function updateGear(index: number, patch: Partial<GearItemInput>) {
    setGearItems((items) => items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...patch } : item
    )));
  }

  function submit() {
    setErrors([]);
    const input: PostEditorInput = {
      id: post?.id,
      title,
      slug: generatedSlug,
      body,
      status,
      hero_image_url: heroImageUrl,
      seo_title: seoTitle,
      seo_description: seoDescription,
      gearItems,
    };

    startTransition(async () => {
      const result = await savePost(input);
      if (result && !result.ok) setErrors(result.errors ?? ["Could not save post."]);
    });
  }

  return (
    <div className="space-y-6">
      {errors.length > 0 ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}

      <section className="grid gap-5 border border-[#d9d4c7] bg-white p-5">
        <label className="grid gap-2 text-sm font-bold">
          Title
          <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Slug
          <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={generatedSlug} onChange={(event) => setSlug(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Body
          <textarea className="min-h-52 border border-[#c9c2b4] px-3 py-2 font-normal" value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <div className="grid gap-5 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold">
            Status
            <select className="border border-[#c9c2b4] px-3 py-2 font-normal" value={status} onChange={(event) => setStatus(event.target.value as "draft" | "published")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold md:col-span-2">
            Hero image URL
            <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={heroImageUrl} onChange={(event) => setHeroImageUrl(event.target.value)} />
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold">
            SEO title
            <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            SEO description
            <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gear items</h2>
          <button type="button" className="border border-[#176b4d] px-4 py-2 text-sm font-bold text-[#176b4d]" onClick={() => setGearItems((items) => [...items, { ...emptyGearItem }])}>
            Add gear
          </button>
        </div>
        {gearItems.map((item, index) => (
          <div key={item.id ?? index} className="grid gap-4 border border-[#d9d4c7] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Gear item {index + 1}</h3>
              {gearItems.length > 1 ? (
                <button type="button" className="text-sm font-bold text-red-700" onClick={() => setGearItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                  Remove
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Name
                <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={item.name} onChange={(event) => updateGear(index, { name: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Category
                <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={item.category} onChange={(event) => updateGear(index, { category: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Price
                <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={item.price_display} onChange={(event) => updateGear(index, { price_display: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Affiliate URL
                <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={item.affiliate_url} onChange={(event) => updateGear(index, { affiliate_url: event.target.value })} />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold">
              Image URL
              <input className="border border-[#c9c2b4] px-3 py-2 font-normal" value={item.image_url} onChange={(event) => updateGear(index, { image_url: event.target.value })} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Features, one per line
                <textarea className="min-h-32 border border-[#c9c2b4] px-3 py-2 font-normal" value={item.featuresText} onChange={(event) => updateGear(index, { featuresText: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Benefits, one per line
                <textarea className="min-h-32 border border-[#c9c2b4] px-3 py-2 font-normal" value={item.benefitsText} onChange={(event) => updateGear(index, { benefitsText: event.target.value })} />
              </label>
            </div>
          </div>
        ))}
      </section>

      <div className="flex justify-end">
        <button type="button" disabled={isPending} onClick={submit} className="min-h-12 bg-[#176b4d] px-6 py-3 font-bold text-white disabled:opacity-60">
          {isPending ? "Saving..." : status === "published" ? "Save and publish" : "Save draft"}
        </button>
      </div>
    </div>
  );
}
