import { NextResponse } from "next/server";
import { generateJsonWithOpenAI } from "@/lib/ai";
import { requireCurrentUser } from "@/lib/auth";

type GearSuggestion = {
  features: string[];
  benefits: string[];
  confidence: number;
};

export async function POST(request: Request) {
  try {
    await requireCurrentUser();
    const body = (await request.json()) as {
      name?: string;
      category?: string;
      affiliate_url?: string;
      notes?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Gear name is required." }, { status: 400 });
    }

    const result = await generateJsonWithOpenAI<GearSuggestion>({
      instructions:
        "You help an outdoor gear affiliate site owner draft accurate product feature and benefit copy. Keep claims conservative and useful. Return only JSON.",
      input: JSON.stringify({
        name: body.name,
        category: body.category,
        affiliate_url: body.affiliate_url,
        notes: body.notes,
      }),
      schema: {
        name: "gear_feature_benefit_suggestion",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["features", "benefits", "confidence"],
          properties: {
            features: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string" },
            },
            benefits: {
              type: "array",
              minItems: 3,
              maxItems: 5,
              items: { type: "string" },
            },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate suggestions." },
      { status: 500 },
    );
  }
}
