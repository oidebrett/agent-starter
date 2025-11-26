import { type NextRequest, NextResponse } from "next/server";
import { start } from "workflow/api";

import { productRecommendationWorkflow } from "@/workflows/product-recommendation-agent";

export async function POST(request: NextRequest) {
    try {
        // Use a consistent user ID so Nango can recognize returning users after OAuth
        // In production, this would come from your authentication system
        const body = await request.json().catch(() => ({}));
        const userId = body.userId ?? "ivo.brett@gmail.com";

        const run = await start(productRecommendationWorkflow, [userId]);

        // wait for the workflow to complete
        const result = await run.returnValue;

        return Response.json(result);
    } catch (error) {
        console.error("Error in /api/product-recommendation:", error);

        return NextResponse.json(
            { error: "Failed to generate product recommendation" },
            { status: 500 },
        );
    }
}
