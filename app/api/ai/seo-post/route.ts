import { NextResponse } from "next/server";
import { generateJsonWithOpenAI } from "@/lib/ai";
import { requireCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type SeoResult = {
  score: number;
  notes: string;
  seo_title: string;
  seo_description: string;
  headlines: string[];
};

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = (await request.json()) as { post_id?: string };
    if (!body.post_id) {
      return NextResponse.json({ error: "post_id is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, title, body, seo_title, seo_description")
      .eq("id", body.post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const result = await generateJsonWithOpenAI<SeoResult>({
      instructions:
        "You are an SEO editor for an outdoor gear affiliate site. Score the post from 0-100, suggest concise search-friendly headlines, and provide title/description metadata. Return only JSON.",
      input: JSON.stringify(post),
      schema: {
        name: "seo_post_suggestions",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["score", "notes", "seo_title", "seo_description", "headlines"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            notes: { type: "string", minLength: 20, maxLength: 500 },
            seo_title: { type: "string", minLength: 20, maxLength: 70 },
            seo_description: { type: "string", minLength: 50, maxLength: 170 },
            headlines: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string", minLength: 20, maxLength: 90 },
            },
          },
        },
      },
    });

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        user_id: user.id,
        seo_score: result.score,
        seo_score_notes: result.notes,
        headline_suggestions: result.headlines,
        seo_title: result.seo_title,
        seo_description: result.seo_description,
      })
      .eq("id", body.post_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      actor: user.id,
      tool_name: "suggest_seo_fields",
      target_table: "posts",
      target_id: body.post_id,
      payload_json: { score: result.score, headlines: result.headlines },
      outcome: "success",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate SEO suggestions." },
      { status: 500 },
    );
  }
}
