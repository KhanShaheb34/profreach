import { NextRequest, NextResponse } from "next/server";
import { getGroundedModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const model = getGroundedModel();

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

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse AI response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lookup failed" },
      { status: 500 }
    );
  }
}
