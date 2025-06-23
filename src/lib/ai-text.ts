import { GoogleGenAI } from "@google/genai";
import { prompt } from "./constants";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;


const ai = new GoogleGenAI({ apiKey });

async function generateText(text: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: text + "\n" + prompt,
    });
    return response.text || "No response from AI";
}

export default generateText;