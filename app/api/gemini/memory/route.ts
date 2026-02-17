import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { memoryRequestSchema, memoryResponseSchema } from "@/lib/api-schemas";
import { parseAiJsonArray } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const parsedRequest = memoryRequestSchema.safeParse(await req.json());
    if (!parsedRequest.success) {
      return NextResponse.json({ memories: [] });
    }
    const { userMessage, assistantMessage, professorName, apiKey } = parsedRequest.data;

    if (!apiKey) {
      return NextResponse.json({ memories: [] });
    }

    const model = getModel(apiKey);

    const prompt = `Analyze this conversation exchange between a grad school applicant and an AI advisor about Professor ${professorName}.

User: ${userMessage}
Assistant: ${assistantMessage}

Extract any important facts, insights, or action items that would be useful to remember for future reference. Focus on:
- Specific research topics or paper discussions
- Key strategies or approaches discussed
- Important deadlines or timing information
- Personal connections or mutual interests discovered

If there's nothing worth remembering, return an empty array.

Return ONLY a JSON array of strings, each being a concise memory item:
["memory item 1", "memory item 2"]

    Return ONLY the JSON array, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const memories = parseAiJsonArray(text, memoryResponseSchema);
    return NextResponse.json({ memories: memories.filter((m) => m.trim()) });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json({ memories: [] });
  }
}
