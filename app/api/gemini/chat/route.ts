import { NextRequest } from "next/server";
import { getModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, professor, profile, memory, history } = await req.json();

    const model = getModel();

    const systemContext = `You are an AI research advisor helping a graduate school applicant prepare to contact and work with professors.

## Current Professor
- Name: ${professor.name}
- University: ${professor.university}
- Department: ${professor.department}
- Research Areas: ${professor.researchAreas?.join(", ") || "Unknown"}
- Recent Papers: ${professor.recentPapers?.join("; ") || "Unknown"}
- Notes: ${professor.notes || "None"}

## Applicant Profile
- Name: ${profile.name || "Not provided"}
- Field: ${profile.field || "Not provided"}
- Research Interests: ${profile.researchInterests?.join(", ") || "Not provided"}
- Summary: ${profile.summary || "Not provided"}

## Relevant Memory/Context
${memory?.length ? memory.map((m: { content: string }) => `- ${m.content}`).join("\n") : "No additional context"}

Help the applicant with questions about this professor, their research, how to approach them, what to discuss, etc. Be specific and actionable.`;

    const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System context: " + systemContext }] },
        { role: "model", parts: [{ text: "I understand. I'm ready to help you with your professor outreach. What would you like to know?" }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Chat failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
