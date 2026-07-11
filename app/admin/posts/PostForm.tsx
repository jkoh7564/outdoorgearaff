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
  const [scheduledAt, setScheduledAt] = useState(post?.scheduled_at ? post.scheduled_at.slice(0, 16) : "");
  const [isFeatured, setIsFeatured] = useState(Boolean(post?.is_featured));
  const [heroPriority, setHeroPriority] = useState(post?.hero_priority ?? 100);
  const [gearItems, setGearItems] = useState<GearItemInput[]>(gearInputFromPost(post));
  const [errors, setErrors] = useState<string[]>([]);
  const [suggestionError, setSuggestionError] = useState("");
  const [suggestingIndex, setSuggestingIndex] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<{
    index: number;
    features: string[];
    benefits: string[];
    confidence: number;
  } | null>(null);
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
      scheduled_at: scheduledAt,
      is_featured: isFeatured,
      hero_priority: heroPriority,
      gearItems,
    };

    startTransition(async () => {
      const result = await savePost(input);
      if (result && !result.ok) setErrors(result.errors ?? ["Could not save post."]);
    });
  }

  async function suggestGearCopy(index: number) {
    setSuggestionError("");
    setSuggestion(null);
    setSuggestingIndex(index);
    const item = gearItems[index];
    const response = await fetch("/api/ai/suggest-gear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        category: item.category,
        affiliate_url: item.affiliate_url,
        notes: `${title}\n${body}`,
      }),
    });
    const payload = await response.json();
    setSuggestingIndex(null);

    if (!response.ok) {
      setSuggestionError(payload.error ?? "Could not generate gear suggestions.");
      return;
    }

    setSuggestion({
      index,
      features: payload.features,
      benefits: payload.benefits,
      confidence: payload.confidence,
    });
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    updateGear(suggestion.index, {
      featuresText: suggestion.features.join("\n"),
      benefitsText: suggestion.benefits.join("\n"),
    });
    setSuggestion(null);
  }

  return (
    <div className="space-y-6">
      {errors.length > 0 ? (
        <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      ) : null}

      <section className="grid gap-5 border border-[#d9d4c7] bg-white p-5 shadow-sm">
        <div className="border-b border-[#e5dfd2] pb-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Content</p>
          <h2 className="mt-1 text-xl font-black text-[#18231d]">Article basics</h2>
        </div>
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
      </section>

      <section className="grid gap-5 border border-[#d9d4c7] bg-white p-5 shadow-sm">
        <div className="border-b border-[#e5dfd2] pb-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Homepage and SEO</p>
          <h2 className="mt-1 text-xl font-black text-[#18231d]">Discovery controls</h2>
        </div>
        <div className="grid gap-5 border border-[#e5dfd2] bg-[#fffdf7] p-4 md:grid-cols-[1fr_180px] md:items-end">
          <label className="flex items-start gap-3 text-sm font-bold">
            <input
              type="checkbox"
              className="mt-1"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
            />
            <span>
              Featured on homepage
              <span className="mt-1 block font-normal leading-6 text-[#66736a]">
                Use this post as a premium homepage hero candidate.
              </span>
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Hero priority
            <input
              type="number"
              className="border border-[#c9c2b4] px-3 py-2 font-normal"
              value={heroPriority}
              onChange={(event) => setHeroPriority(Number(event.target.value))}
            />
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

      <section className="grid gap-5 border border-[#d9d4c7] bg-white p-5 shadow-sm">
        <div className="border-b border-[#e5dfd2] pb-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Scheduling</p>
          <h2 className="mt-1 text-xl font-black text-[#18231d]">Publishing plan</h2>
        </div>
        <label className="grid gap-2 text-sm font-bold">
          Scheduled publish time
          <input
            type="datetime-local"
            className="border border-[#c9c2b4] px-3 py-2 font-normal"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
          />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#176b4d]">Affiliate products</p>
            <h2 className="mt-1 text-2xl font-black text-[#18231d]">Gear items</h2>
          </div>
          <button type="button" className="border border-[#176b4d] px-4 py-2 text-sm font-bold text-[#176b4d]" onClick={() => setGearItems((items) => [...items, { ...emptyGearItem }])}>
            Add gear
          </button>
        </div>
        {suggestionError ? (
          <div className="border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            {suggestionError}
          </div>
        ) : null}
        {gearItems.map((item, index) => (
          <div key={item.id ?? index} className="grid gap-4 border border-[#d9d4c7] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Gear item {index + 1}</h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={suggestingIndex !== null}
                  className="text-sm font-bold text-[#176b4d] disabled:opacity-60"
                  onClick={() => suggestGearCopy(index)}
                >
                  {suggestingIndex === index ? "Suggesting..." : "Suggest copy"}
                </button>
                {gearItems.length > 1 ? (
                  <button type="button" className="text-sm font-bold text-red-700" onClick={() => setGearItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
            {suggestion?.index === index ? (
              <div className="border border-[#b8d8ca] bg-[#f0f8f4] p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="font-bold">Suggested copy</h4>
                  <span className="text-xs font-bold uppercase text-[#66736a]">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="mb-2 font-bold">Features</p>
                    <ul className="list-disc space-y-1 pl-5 text-[#37443b]">
                      {suggestion.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-bold">Benefits</p>
                    <ul className="list-disc space-y-1 pl-5 text-[#37443b]">
                      {suggestion.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" className="border border-[#c9c2b4] px-4 py-2 text-sm font-bold" onClick={() => setSuggestion(null)}>
                    Reject
                  </button>
                  <button type="button" className="bg-[#176b4d] px-4 py-2 text-sm font-bold text-white" onClick={acceptSuggestion}>
                    Accept
                  </button>
                </div>
              </div>
            ) : null}
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

      <div className="sticky bottom-0 z-20 flex justify-end border border-[#d9d4c7] bg-[#fffdf7]/95 p-4 shadow-sm">
        <button type="button" disabled={isPending} onClick={submit} className="min-h-12 bg-[#176b4d] px-6 py-3 font-black text-white disabled:opacity-60">
          {isPending ? "Saving..." : status === "published" ? "Save and publish" : "Save draft"}
        </button>
      </div>
    </div>
  );
}
