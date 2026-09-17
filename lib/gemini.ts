import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type { RecipeInput } from "./types";

export class GeminiTemporaryError extends Error {}

const text = z.string().nullish().transform((value) => value?.trim() || "");
const optionalNumber = z.preprocess(normalizeRecipeNumber, z.number().finite().nullable());
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

const prompt = `Convert the supplied unstructured recipe content into one complete, normalized recipe JSON object. The input may be a social caption, rough notes, an ingredient list, or incomplete prose. Infer the obvious recipe structure and make reasonable culinary assumptions for servings, units, cuisine, meal type, and tags; use null only when there is no reasonable answer. Do not fabricate precise nutrition values when they are not supplied. Always return title as a string; use an empty string only if it is genuinely unknown. Quantities, servings, times, and nutrition MUST be JSON numbers, never strings: use decimals for fractions and ranges (for example, 1/2 becomes 0.5 and 3–4 becomes 3.5). Keep ingredient units separate from quantities. Return JSON only with title, description, servings, prepMinutes, cookMinutes, ingredients, instructions, nutrition {calories,protein,carbs,fat}, cuisine, mealType, tags, source {platform,url}.`;

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

function normalizeRecipeNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const input = value.trim().toLowerCase();
  if (!input || /^(to taste|as needed|optional|few|some)$/i.test(input)) return null;
  if (input === "half" || input === "one half") return 0.5;
  if (input === "quarter" || input === "one quarter") return 0.25;

  const range = input.match(/(-?\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(-?\d+(?:\.\d+)?)/);
  if (range) return (Number(range[1]) + Number(range[2])) / 2;

  const fraction = input.match(/^(\d+\s+)?(\d+)\s*\/\s*(\d+)/);
  if (fraction) return (Number(fraction[1]?.trim() || 0) + Number(fraction[2]) / Number(fraction[3]));

  const unicodeFraction = input.match(/(\d+)?\s*([¼½¾⅓⅔⅛⅜⅝⅞])/);
  if (unicodeFraction) {
    const fractions: Record<string, number> = { "¼": 0.25, "½": 0.5, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3, "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875 };
    return Number(unicodeFraction[1] || 0) + fractions[unicodeFraction[2]];
  }

  const number = input.match(/-?\d+(?:\.\d+)?/);
  return number ? Number(number[0]) : null;
}

function platform(url: string) {
  try {
    const host = new URL(url).hostname;
    return ["instagram", "tiktok", "youtube", "reddit"].find((entry) => host.includes(entry)) || "website";
  } catch {
    return "website";
  }
}
