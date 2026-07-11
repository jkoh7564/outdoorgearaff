import { NextResponse } from "next/server";
import { generateJsonWithOpenAI } from "@/lib/ai";
import { requireCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type SummarySuggestion = {
  summary: string;
  confidence: number;
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
      .select("id, title, body")
      .eq("id", body.post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-5.2";
    const result = await generateJsonWithOpenAI<SummarySuggestion>({
      instructions:
        "You write concise review-ready summaries for outdoor gear affiliate posts. Do not invent product specs. Return only JSON.",
      input: JSON.stringify(post),
      schema: {
        name: "post_summary_suggestion",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "confidence"],
          properties: {
            summary: { type: "string", minLength: 40, maxLength: 320 },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    });

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        ai_summary: result.summary,
        ai_summary_source: `openai/${model}`,
        ai_summary_confidence: result.confidence,
        ai_summary_review_status: "unreviewed",
      })
      .eq("id", body.post_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      actor: user.id,
      tool_name: "summarise_post",
      target_table: "posts",
      target_id: body.post_id,
      payload_json: {
        source: `openai/${model}`,
        confidence: result.confidence,
      },
      outcome: "success",
    });

    return NextResponse.json({
      summary: result.summary,
      source: `openai/${model}`,
      confidence: result.confidence,
      review_status: "unreviewed",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate summary." },
      { status: 500 },
    );
  }
}
