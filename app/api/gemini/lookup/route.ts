import { NextRequest, NextResponse } from "next/server";
import { getGroundedModel } from "@/lib/gemini";
import { lookupRequestSchema, lookupResponseSchema } from "@/lib/api-schemas";
import { parseAiJsonObject } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const parsedRequest = lookupRequestSchema.safeParse(await req.json());
    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsedRequest.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }
    const { query, apiKey } = parsedRequest.data;

    const model = getGroundedModel(apiKey);

    const prompt = `You are a research assistant helping find information about a professor for graduate school applications.

Search for the professor: "${query}"

Return ONLY a valid JSON object with the following fields (use empty string or empty array if unknown):
{
  "name": "Full name with title",
  "email": "Email address",
  "university": "University name",
  "department": "Department name",
  "country": "Country",
  "researchAreas": ["area1", "area2"],
  "recentPapers": ["paper title 1", "paper title 2"],
  "websiteUrl": "Faculty page URL",
  "scholarUrl": "Google Scholar profile URL",
  "hiringStatus": "unknown",
  "notes": "Brief summary of their research focus"
}

    Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedResponse = parseAiJsonObject(text, lookupResponseSchema);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lookup failed" },
      { status: 500 }
    );
  }
}
