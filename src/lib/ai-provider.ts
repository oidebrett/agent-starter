import { createOpenAI } from "@ai-sdk/openai";
import { setGlobalAIProvider } from "ai";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Register this provider globally for workflows and AI SDK calls
setGlobalAIProvider(openai);
