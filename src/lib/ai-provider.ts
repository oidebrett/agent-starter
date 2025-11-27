import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const provider = process.env.AI_PROVIDER || "openai";

console.log(`🔧 Using AI provider: ${provider}`);

// Create the OpenRouter provider instance
const openrouterProvider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

// Create the OpenAI provider instance (for direct OpenAI or Vercel AI Gateway)
const getOpenAIConfig = () => {
  if (provider === "openai") {
    return {
      apiKey: process.env.OPENAI_API_KEY!,
      // No baseURL - uses OpenAI directly
    };
  }

  // Vercel AI Gateway or other custom gateway
  return {
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.AI_GATEWAY_URL,
  };
};

const openaiProvider = createOpenAI(getOpenAIConfig());

/**
 * Helper to get a model with the correct naming for the current provider.
 * Uses the official OpenRouter provider when AI_PROVIDER=openrouter.
 */
export const getModel = (modelName: string) => {
  if (provider === "openrouter") {
    // Only auto-prefix OpenAI models, nothing else
    const needsPrefix = !modelName.includes("/") && modelName.startsWith("gpt");

    const fullModelName = needsPrefix
      ? `openai/${modelName}`
      : modelName;

    return openrouterProvider.chat(fullModelName);
  }

  return openaiProvider(modelName);
};

// For backwards compatibility, export the raw provider too
export const openai = openaiProvider;
