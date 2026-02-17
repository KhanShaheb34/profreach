import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { emailRequestSchema, emailResponseSchema } from "@/lib/api-schemas";
import { parseAiJsonObject } from "@/lib/ai-json";

export async function POST(req: NextRequest) {
  try {
    const parsedRequest = emailRequestSchema.safeParse(await req.json());
    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsedRequest.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }
    const { professor, profile, template, memory, apiKey } = parsedRequest.data;

    const model = getModel(apiKey);

    const prompt = `You are helping a graduate school applicant draft an email to a professor.

## Applicant Profile
- Name: ${profile.name || "Not provided"}
- Email: ${profile.email || "Not provided"}
- University: ${profile.university || "Not provided"}
- Degree: ${profile.degree || "Not provided"}
- Field: ${profile.field || "Not provided"}
- Research Interests: ${profile.researchInterests?.join(", ") || "Not provided"}
- Skills: ${profile.skills?.join(", ") || "Not provided"}
- Summary: ${profile.summary || "Not provided"}

## Professor Info
- Name: ${professor.name}
- University: ${professor.university}
- Department: ${professor.department}
- Research Areas: ${professor.researchAreas?.join(", ") || "Not provided"}
- Recent Papers: ${professor.recentPapers?.join("; ") || "Not provided"}

## Relevant Context/Memory
${memory.length ? memory.map((m) => `- ${m.content}`).join("\n") : "No additional context"}

## Email Template Type: ${template}

Write a professional, personalized email for this template type. The email should:
1. Be specific to the professor's research (reference their papers/areas)
2. Highlight relevant overlap with the applicant's interests
3. Be concise but compelling (under 300 words for the body)
4. Sound natural, not generic

Return ONLY a JSON object:
{
  "subject": "Email subject line",
  "body": "Full email body text"
}

    Return ONLY the JSON object, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedResponse = parseAiJsonObject(text, emailResponseSchema);
    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Email generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email generation failed" },
      { status: 500 }
    );
  }
}
