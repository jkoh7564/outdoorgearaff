import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ConversionRow = {
  network?: string;
  order_id?: string;
  post_slug?: string;
  gear_name?: string;
  sale_amount?: string | number;
  commission_amount?: string | number;
  currency?: string;
  occurred_at?: string;
};

function toNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "0").replace(/[$,]/g, "")) || 0;
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = (await request.json()) as { rows?: ConversionRow[] };
    const rows = body.rows ?? [];
    if (rows.length === 0) {
      return NextResponse.json({ error: "No rows to import." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: posts } = await supabase.from("posts").select("id, slug");
    const { data: gearItems } = await supabase.from("gear_items").select("id, name");
    const postBySlug = new Map((posts ?? []).map((post) => [post.slug, post.id]));
    const gearByName = new Map((gearItems ?? []).map((item) => [item.name.toLowerCase(), item.id]));

    const payload = rows.map((row) => ({
      user_id: user.id,
      post_id: row.post_slug ? postBySlug.get(row.post_slug) ?? null : null,
      gear_item_id: row.gear_name ? gearByName.get(row.gear_name.toLowerCase()) ?? null : null,
      network: row.network || "Imported report",
      order_id: row.order_id || null,
      sale_amount: toNumber(row.sale_amount),
      commission_amount: toNumber(row.commission_amount),
      currency: row.currency || "USD",
      occurred_at: row.occurred_at ? new Date(row.occurred_at).toISOString() : new Date().toISOString(),
      raw_payload: row,
    }));

    const { error } = await supabase.from("affiliate_conversions").insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      actor: user.id,
      tool_name: "import_affiliate_conversions",
      target_table: "affiliate_conversions",
      payload_json: { rows: rows.length },
      outcome: "success",
    });

    return NextResponse.json({ imported: payload.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not import conversions." },
      { status: 500 },
    );
  }
}
