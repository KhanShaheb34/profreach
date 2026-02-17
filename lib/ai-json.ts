import type { z } from "zod";

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function extractJsonChunk(text: string, kind: "object" | "array"): string {
  const normalized = stripCodeFences(text);
  const startChar = kind === "object" ? "{" : "[";
  const endChar = kind === "object" ? "}" : "]";

  const start = normalized.indexOf(startChar);
  const end = normalized.lastIndexOf(endChar);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Could not find a JSON ${kind} in model response.`);
  }

  return normalized.slice(start, end + 1);
}

export function parseAiJsonObject<T>(
  text: string,
  schema: z.ZodType<T>,
): T {
  const chunk = extractJsonChunk(text, "object");
  return schema.parse(JSON.parse(chunk));
}

export function parseAiJsonArray<T>(
  text: string,
  schema: z.ZodType<T>,
): T {
  const chunk = extractJsonChunk(text, "array");
  return schema.parse(JSON.parse(chunk));
}
