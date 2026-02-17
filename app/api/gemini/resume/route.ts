import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { resumeResponseSchema } from "@/lib/api-schemas";
import { parseAiJsonObject } from "@/lib/ai-json";
import { MAX_RESUME_SIZE_BYTES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const apiKey = formData.get("apiKey") as string | null;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required. Set it in Settings." }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return NextResponse.json({ error: "Resume is too large. Maximum size is 10 MB." }, { status: 400 });
    }

    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported for resume parsing." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = getModel(apiKey);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type || "application/pdf",
          data: base64,
        },
      },
      {
        text: `Parse this resume/CV and extract structured information. Return ONLY a valid JSON object:
{
  "name": "Full name",
  "email": "Email address",
  "university": "Current or most recent university",
  "degree": "Current or highest degree",
  "field": "Field of study",
  "gpa": "GPA if mentioned",
  "researchInterests": ["interest1", "interest2"],
  "skills": ["skill1", "skill2"],
  "publications": ["publication1", "publication2"],
  "workExperience": "Brief summary of relevant work experience",
  "summary": "2-3 sentence professional summary"
}

Return ONLY the JSON object, no markdown formatting.`,
      },
    ]);

    const text = result.response.text();
    const parsed = parseAiJsonObject(text, resumeResponseSchema);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Resume parse error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Resume parsing failed" },
      { status: 500 }
    );
  }
}
