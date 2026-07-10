"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertPostWithGear } from "@/lib/posts";
import type { PostEditorInput } from "@/lib/types";

export async function savePost(input: PostEditorInput) {
  const result = await upsertPostWithGear(input);
  if (!result.ok) return result;

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  redirect(`/admin/posts/${result.id}/edit?saved=1`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { ok: false, errors: [error.message] };

  await supabase.from("audit_logs").insert({
    actor: "owner",
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
  const supabase = await createClient();
  const { error } = await supabase.from("gear_items").delete().eq("id", gearItemId);
  if (error) return { ok: false, errors: [error.message] };

  await supabase.from("audit_logs").insert({
    actor: "owner",
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
