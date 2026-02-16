import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getModel() {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export function getGroundedModel() {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ googleSearch: {} } as never],
  });
}
