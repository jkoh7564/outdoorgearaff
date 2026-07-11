type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
};

type ResponseContent = {
  type?: string;
  text?: string;
  refusal?: string;
};

type ResponseOutput = {
  type?: string;
  content?: ResponseContent[];
};

function extractResponseText(payload: { output_text?: string; output?: ResponseOutput[] }) {
  if (payload.output_text) return payload.output_text;

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text" && content.text)?.text;

  if (text) return text;

  const refusal = payload.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.refusal)?.refusal;

  if (refusal) throw new Error(refusal);
  return null;
}

export async function generateJsonWithOpenAI<T>({
  instructions,
  input,
  schema,
}: {
  instructions: string;
  input: string;
  schema: JsonSchema;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in Vercel.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          schema: schema.schema,
          strict: true,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "OpenAI request failed.");
  }

  const payload = await response.json();
  const outputText = extractResponseText(payload);
  if (!outputText) throw new Error("OpenAI returned no text output.");

  return JSON.parse(outputText) as T;
}
