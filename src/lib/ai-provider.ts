import { createOpenAI } from "@ai-sdk/openai";

const provider = process.env.AI_PROVIDER || "openai";

console.log(`🔧 Using AI provider: ${provider}`);

const getProviderConfig = () => {
  if (provider === "openrouter") {
    return {
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
    };
  }

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

export const openai = createOpenAI(getProviderConfig());
