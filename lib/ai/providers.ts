import { google } from "@ai-sdk/google";
import { isTestEnvironment } from "../constants";

export const myProvider = null; // Removed mock logic for simplicity, or keep if needed but unused

export function getLanguageModel(modelId: string) {
  // Simple pass-through for now. 
  // If modelId starts with 'google/', strip it because the SDK might expect just the model name 
  // OR the SDK handles "google/gemini..." correctly. 
  // Actually, @ai-sdk/google exports a `google` object where you call `google('model-name')`.
  // The modelId from models.ts is "google/gemini-1.5-flash". 
  
  if (modelId.startsWith("google/")) {
    const cleanId = modelId.replace("google/", "");
    return google(cleanId);
  }
  
  // Fallback or error if other providers are selected but not configured
  throw new Error(`Provider for ${modelId} not configured`);
}

export function getTitleModel() {
  return google("gemini-3-flash-preview");
}

export function getArtifactModel() {
  return google("gemini-3-flash-preview");
}
