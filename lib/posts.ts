import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import type { GearItemInput, PostEditorInput, PostWithGear } from "@/lib/types";

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function validatePostInput(input: PostEditorInput) {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push("Title is required.");
  const slug = slugify(input.slug || input.title);
  if (!slug) errors.push("Slug is required.");
  if (!["draft", "published"].includes(input.status)) errors.push("Status is invalid.");
  if (input.gearItems.length === 0) errors.push("Add at least one gear item.");

  input.gearItems.forEach((item, index) => {
    if (!item.name.trim()) errors.push(`Gear item ${index + 1} needs a name.`);
    if (!item.affiliate_url.startsWith("https://")) {
      errors.push(`Gear item ${index + 1} affiliate URL must start with https://.`);
    }
  });

  return { errors, slug };
}

export async function getPublishedPosts() {
  const supabase = await createClient();
  return supabase
    .from("posts")
    .select("*, gear_items(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .returns<PostWithGear[]>();
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("posts")
    .select("*, gear_items(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single<PostWithGear>();
}

export async function getAdminPosts() {
  const supabase = await createClient();
  return supabase
    .from("posts")
    .select("*, gear_items(*)")
    .order("created_at", { ascending: false })
    .returns<PostWithGear[]>();
}

export async function getAdminPost(id: string) {
  const supabase = await createClient();
  return supabase.from("posts").select("*, gear_items(*)").eq("id", id).single<PostWithGear>();
}

export async function upsertPostWithGear(input: PostEditorInput) {
  const { errors, slug } = validatePostInput(input);
  if (errors.length > 0) return { ok: false, errors };

  const supabase = await createClient();
  const publishedAt = input.status === "published" ? new Date().toISOString() : null;
  const postPayload = {
    title: input.title.trim(),
    slug,
    body: input.body.trim() || null,
    status: input.status,
    hero_image_url: input.hero_image_url.trim() || null,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
    published_at: publishedAt,
  };

  const postResult = input.id
    ? await supabase.from("posts").update(postPayload).eq("id", input.id).select("id").single()
    : await supabase.from("posts").insert(postPayload).select("id").single();

  if (postResult.error) return { ok: false, errors: [postResult.error.message] };

  const postId = postResult.data.id as string;
  const keptIds: string[] = [];

  for (const item of input.gearItems) {
    const gearPayload = toGearPayload(postId, item);
    const result = item.id
      ? await supabase.from("gear_items").update(gearPayload).eq("id", item.id).select("id").single()
      : await supabase.from("gear_items").insert(gearPayload).select("id").single();
    if (result.error) return { ok: false, errors: [result.error.message] };
    keptIds.push(result.data.id as string);
  }

  if (input.id) {
    let deleteQuery = supabase.from("gear_items").delete().eq("post_id", postId);
    if (keptIds.length > 0) deleteQuery = deleteQuery.not("id", "in", `(${keptIds.join(",")})`);
    const deleteResult = await deleteQuery;
    if (deleteResult.error) return { ok: false, errors: [deleteResult.error.message] };
  }

  await supabase.from("audit_logs").insert({
    actor: "owner",
    tool_name: input.id ? "update_post" : "create_post",
    target_table: "posts",
    target_id: postId,
    payload_json: { status: input.status, gear_count: input.gearItems.length },
    outcome: "success",
  });

  return { ok: true, id: postId, slug };
}

function toGearPayload(postId: string, item: GearItemInput) {
  return {
    post_id: postId,
    name: item.name.trim(),
    category: item.category.trim() || null,
    features: linesToArray(item.featuresText),
    benefits: linesToArray(item.benefitsText),
    affiliate_url: item.affiliate_url.trim(),
    price_display: item.price_display.trim() || null,
    image_url: item.image_url.trim() || null,
  };
}
