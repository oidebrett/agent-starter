import { ToolLoopAgent } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { Nango } from "@nangohq/node";

import { getModel } from "@/lib/ai-provider";

const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY! });

// Create the Nango tool for getting user info
function createWhoAmITool(integrationId: string, connectionId: string) {
  return tool({
    description: "Get the current user info from the connected service.",
    inputSchema: z.object({}),
    execute: async () => {
      return await nango.triggerAction(integrationId, connectionId, "whoami");
    },
  });
}

export async function runNangoAgent(userId: string, integrationId: string) {
  // Step 1: Ensure the user is authorized
  console.log("🔒 Checking API authorization...");
  const connectionId = (
    await nango.listConnections({ integrationId, userId })
  ).connections[0]?.connection_id;

  // Step 2: If the user is not authorized, return auth link
  if (!connectionId) {
    const session = await nango.createConnectSession({
      allowed_integrations: [integrationId],
      end_user: { id: userId },
    });

    return {
      status: "needs_auth",
      authUrl: session.data.connect_link,
      message: `Please authorize the app by visiting this URL: ${session.data.connect_link}`,
    };
  }

  // Step 3: Run the agent with tools
  console.log("🤖 Nango Agent running...");
  const agent = new ToolLoopAgent({
//    model: getModel("moonshotai/kimi-k2:free"),
    model: getModel("gpt-4o"),
    tools: {
      who_am_i: createWhoAmITool(integrationId, connectionId),
    },
    instructions: "You are a helpful assistant that can retrieve user information from connected services. When asked about user info, use the who_am_i tool.",
  });

  const { text } = await agent.generate({
    prompt: "Using the who_am_i tool, provide the current user info.",
  });

  console.log("✅ Agent completed:", text);

  return {
    status: "success",
    result: text,
  };
}

