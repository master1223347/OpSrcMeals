import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type { RecipeInput } from "./types";

export class GeminiTemporaryError extends Error {}

const text = z.string().nullish().transform((value) => value?.trim() || "");
const optionalNumber = z.number().nullish().transform((value) => value ?? null);
const schema = z.object({
  title: text,
  description: text.nullable().optional(),
  servings: optionalNumber.optional(),
  prepMinutes: optionalNumber.optional(),
  cookMinutes: optionalNumber.optional(),
  ingredients: z.array(z.object({ name: text, quantity: optionalNumber.optional(), unit: text.nullable().optional(), notes: text.nullable().optional() })).nullish().transform((value) => value ?? []),
  instructions: z.array(text).nullish().transform((value) => value?.filter(Boolean) ?? []),
  nutrition: z.object({ calories: optionalNumber.optional(), protein: optionalNumber.optional(), carbs: optionalNumber.optional(), fat: optionalNumber.optional() }).nullish().transform((value) => value ?? {}),
  cuisine: text.nullable().optional(),
  mealType: text.nullable().optional(),
  tags: z.array(text).nullish().transform((value) => value?.filter(Boolean) ?? []),
  source: z.object({ platform: text.nullable().optional(), url: text.nullable().optional() }).nullish().transform((value) => value ?? {}),
});

const prompt = `Extract this into a recipe JSON object. Do not invent values; use null when unavailable. Always return title as a string; use an empty string if it is unknown. Normalize quantities and units. Return JSON only with title, description, servings, prepMinutes, cookMinutes, ingredients, instructions, nutrition {calories,protein,carbs,fat}, cuisine, mealType, tags, source {platform,url}.`;

export async function extractRecipe(textInput?: string, image?: { data: string; mimeType: string }, sourceUrl?: string): Promise<RecipeInput> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini is not configured. Add GEMINI_API_KEY on the server.");

  const model = new GoogleGenerativeAI(key).getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    generationConfig: { responseMimeType: "application/json" },
  });
  const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [{
    text: `${prompt}\nSource URL: ${sourceUrl || "none"}\nContent:\n${textInput || "Read the supplied recipe image."}`,
  }];
  if (image) parts.push({ inlineData: image });

  let result;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      result = await model.generateContent(parts);
      break;
    } catch (error) {
      if (!isTemporaryGeminiError(error) || attempt === 1) {
        if (isTemporaryGeminiError(error)) throw new GeminiTemporaryError("Gemini is busy right now. Please try again in a moment.");
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  const value = schema.parse(JSON.parse(result!.response.text()));
  if (sourceUrl) value.source = { ...value.source, url: sourceUrl, platform: platform(sourceUrl) };
  return value;
}

function isTemporaryGeminiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(429|503)\b|high demand|unavailable|overloaded/i.test(message);
}

function platform(url: string) {
  try {
    const host = new URL(url).hostname;
    return ["instagram", "tiktok", "youtube", "reddit"].find((entry) => host.includes(entry)) || "website";
  } catch {
    return "website";
  }
}
