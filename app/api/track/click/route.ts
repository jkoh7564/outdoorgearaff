import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    post_id?: string;
    gear_item_id?: string;
    referrer?: string;
  } | null;

  if (!body?.post_id || !body.gear_item_id) {
    return NextResponse.json({ error: "post_id and gear_item_id are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: item, error: itemError } = await supabase
    .from("gear_items")
    .select("id, post_id, affiliate_url, posts!inner(status)")
    .eq("id", body.gear_item_id)
    .eq("post_id", body.post_id)
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: "Gear item not found" }, { status: 400 });
  }

  const headerStore = await headers();
  const { error } = await supabase.from("click_events").insert({
    post_id: body.post_id,
    gear_item_id: body.gear_item_id,
    referrer: body.referrer || "direct",
    user_agent: headerStore.get("user-agent"),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ affiliate_url: item.affiliate_url });
}
