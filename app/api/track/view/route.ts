import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    post_id?: string;
    referrer?: string;
  } | null;

  if (!body?.post_id) {
    return NextResponse.json({ error: "post_id is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("page_views").insert({
    post_id: body.post_id,
    referrer: body.referrer || "direct",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
