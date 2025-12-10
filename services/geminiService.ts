import { GoogleGenAI } from "@google/genai";
import { Space } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSpaceSummary = async (space: Space): Promise<string> => {
  if (!apiKey) {
    return "AI Summary unavailable: API Key not configured.";
  }

  try {
    const prompt = `
      You are a high-end real estate copywriter.
      Write a short, punchy, and persuasive summary (max 50 words) for a space rental listing.
      Highlight the unique selling points based on this data:
      Title: ${space.title}
      Category: ${space.category}
      Location: ${space.location}
      Amenities: ${space.amenities.join(', ')}
      Description: ${space.description}
      
      Tone: Sophisticated, inviting, and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Experience luxury and convenience in this meticulously curated space.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Experience luxury and convenience in this meticulously curated space.";
  }
};
