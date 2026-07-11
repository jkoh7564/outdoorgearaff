"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertPostWithGear } from "@/lib/posts";
import { requireCurrentUser } from "@/lib/auth";
import type { PostEditorInput } from "@/lib/types";

export async function savePost(input: PostEditorInput) {
  let result;
  try {
    result = await upsertPostWithGear(input);
  } catch (error) {
    return { ok: false, errors: [error instanceof Error ? error.message : "You must be logged in."] };
  }
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  redirect(`/admin/posts/${result.id}/edit?saved=1`);
}

export async function deletePost(postId: string) {
  const user = await requireCurrentUser();
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { ok: false, errors: [error.message] };

  await supabase.from("audit_logs").insert({
    actor: user.id,
    tool_name: "delete_post",
    target_table: "posts",
    target_id: postId,
    outcome: "success",
  });

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteGearItem(gearItemId: string) {
  const user = await requireCurrentUser();
  const supabase = await createClient();
  const { error } = await supabase.from("gear_items").delete().eq("id", gearItemId);
  if (error) return { ok: false, errors: [error.message] };

  await supabase.from("audit_logs").insert({
    actor: user.id,
    tool_name: "delete_gear_item",
    target_table: "gear_items",
    target_id: gearItemId,
    outcome: "success",
  });

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function bulkSchedulePosts(postIds: string[], startAt: string, spacingDays: number) {
  const user = await requireCurrentUser();
  if (postIds.length === 0) return { ok: false, errors: ["Select at least one post."] };
  if (!startAt) return { ok: false, errors: ["Choose a start date."] };

  const supabase = await createClient();
  const start = new Date(startAt);

  for (const [index, postId] of postIds.entries()) {
    const scheduled = new Date(start);
    scheduled.setDate(start.getDate() + index * spacingDays);
    const { error } = await supabase
      .from("posts")
      .update({
        user_id: user.id,
        scheduled_at: scheduled.toISOString(),
      })
      .eq("id", postId);

    if (error) return { ok: false, errors: [error.message] };
  }

  await supabase.from("audit_logs").insert({
    actor: user.id,
    tool_name: "bulk_schedule_posts",
    target_table: "posts",
    payload_json: { postIds, startAt, spacingDays },
    outcome: "success",
  });

  revalidatePath("/admin/calendar");
  revalidatePath("/admin/posts");
  return { ok: true };
}
