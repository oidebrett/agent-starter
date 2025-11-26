import type { Geo } from "@vercel/functions";
import { Output, ToolLoopAgent, tool } from "ai";
import { z } from "zod";

import { openai } from "@/lib/ai-provider";
import { outfitSchema } from "@/lib/outfit";
import { askFriendTool, viewClosetTool } from "@/lib/tools";
import { formatWeatherDisplay, getWeatherData } from "@/lib/weather";

export async function outfitAgentWorkflow(geo: Geo) {
  "use workflow";

  return await agentStep(geo);
}

async function agentStep(geo: Geo) {
  "use step";

  // Use provided coordinates or fallback to San Francisco
  const latitude = geo.latitude || "37.7749";
  const longitude = geo.longitude || "-122.4194";
  const city = geo.city || "San Francisco";

  // Create a weather tool with the coordinates baked in
  const checkWeatherForLocation = tool({
    description: `Check the current weather conditions for ${city}`,
    inputSchema: z.object({}),
    execute: async () => {
      const weather = await getWeatherData(latitude, longitude);
      return formatWeatherDisplay(weather);
    },
  });

  const agent = new ToolLoopAgent({
    model: openai("gpt-4o-mini"),
    tools: {
      checkWeather: checkWeatherForLocation,
      viewCloset: viewClosetTool,
      askFriend: askFriendTool,
    },
    output: Output.object({
      schema: outfitSchema,
    }),
    instructions: `You are a fashion advisor AI agent. Your job is to recommend complete outfits based on the location, weather, and available clothing items.

Guidelines:
1. Always check the weather first using the checkWeather tool (no parameters needed)
2. Look at what's available in the closet
3. You may ask a friend for advice if needed
4. Provide a complete outfit recommendation with specific items for each category
5. Explain your reasoning briefly
6. Recommend versatile outfits suitable for general daily activities

Be practical, stylish, and considerate of weather conditions.

Provide a detailed recommendation with specific clothing items and explain your reasoning.`,
  });

  const { output } = await agent.generate({
    prompt: `I need an outfit recommendation for today in ${city}. Please check the weather first, then provide an outfit recommendation based on the weather and available clothing.`,
  });

  return output;
}
