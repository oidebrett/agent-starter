import { NextRequest, NextResponse } from "next/server";
import { runNangoAgent } from "@/workflows/nango-agent";

export async function POST(request: NextRequest) {
  try {
    // Default to hubspot integration and user1, but allow overrides via request body
    const body = await request.json().catch(() => ({}));
    const userId = body.userId ?? "ivo.brett@gmail.com";
    const integrationId = body.integrationId ?? "hubspot";

    console.log(`🚀 Starting Nango agent for user: ${userId}, integration: ${integrationId}`);

    const result = await runNangoAgent(userId, integrationId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/nango:", error);

    return NextResponse.json(
      { error: "Failed to run Nango agent", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Nango Agent API - POST to this endpoint to run the agent",
    usage: {
      method: "POST",
      body: {
        userId: "optional - defaults to 'ivo.brett@gmail.com'",
        integrationId: "optional - defaults to 'hubspot'"
      }
    }
  });
}

