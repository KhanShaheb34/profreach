import { GoogleGenerativeAI } from "@google/generative-ai";

export function getModel(apiKey: string) {
  if (!apiKey) throw new Error("Gemini API key not configured");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export function getGroundedModel(apiKey: string) {
  if (!apiKey) throw new Error("Gemini API key not configured");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ googleSearch: {} } as never],
  });
}
