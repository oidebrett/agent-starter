import { Output, ToolLoopAgent, tool } from "ai";
import { z } from "zod";
import { Nango } from "@nangohq/node";

import { openai } from "@/lib/ai-provider";
import { productRecommendationSchema } from "@/lib/product-recommendation";
import {
    askSalesManagerTool,
    viewProductCatalogTool,
    lookupCompanyTool,
} from "@/lib/tools";

const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY! });

export async function productRecommendationWorkflow(userId: string) {
    "use workflow";

    // Step 1: Get user email from HubSpot using Nango
    const emailResult = await getUserEmailStep(userId);

    if (emailResult.status === "needs_auth") {
        return {
            status: "needs_auth",
            authUrl: emailResult.authUrl,
            message: emailResult.message,
        };
    }

    if (emailResult.status === "error" || !emailResult.email) {
        return {
            status: "error",
            message: "Failed to retrieve user email",
        };
    }

    // Step 2: Generate product recommendation using the email
    const recommendation = await generateRecommendationStep(emailResult.email);

    return {
        status: "success",
        email: emailResult.email,
        recommendation,
    };
}

async function getUserEmailStep(userId: string) {
    "use step";

    const integrationId = "hubspot";

    try {
        // Check if user is authorized
        console.log("🔒 Checking HubSpot authorization...");
        const connectionId = (
            await nango.listConnections({ integrationId, userId })
        ).connections[0]?.connection_id;

        // If not authorized, return auth link
        if (!connectionId) {
            const session = await nango.createConnectSession({
                allowed_integrations: [integrationId],
                end_user: { id: userId },
            });

            return {
                status: "needs_auth" as const,
                authUrl: session.data.connect_link,
                message: `Please authorize HubSpot by visiting this URL: ${session.data.connect_link}`,
            };
        }

        // Get user info from HubSpot
        console.log("📧 Fetching user email from HubSpot...");
        const userInfo = (await nango.triggerAction(
            integrationId,
            connectionId,
            "whoami"
        )) as any;

        // Extract email from the response
        const email = userInfo?.email || userInfo?.user?.email;

        if (!email) {
            console.error("No email found in HubSpot response:", userInfo);
            return {
                status: "error" as const,
                message: "Could not extract email from HubSpot",
            };
        }

        console.log("✅ Retrieved email:", email);

        return {
            status: "success" as const,
            email,
        };
    } catch (error) {
        console.error("Error in getUserEmailStep:", error);
        return {
            status: "error" as const,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

async function generateRecommendationStep(email: string) {
    "use step";

    console.log("🤖 Generating product recommendation for:", email);

    // Create the company lookup tool with the email baked in
    const companyLookup = lookupCompanyTool(email);

    const agent = new ToolLoopAgent({
        model: openai("gpt-4o"),
        tools: {
            lookupCompany: companyLookup,
            viewProductCatalog: viewProductCatalogTool,
            askSalesManager: askSalesManagerTool,
        },
        output: Output.object({
            schema: productRecommendationSchema,
        }),
        instructions: `You are an expert B2B sales AI agent. Your job is to recommend the best product bundle for a prospect based on their company profile.

Guidelines:
1. ALWAYS start by looking up the company information using the lookupCompany tool
2. Review the available product catalog to see what we offer
3. Consult with the sales manager for strategic advice on the approach
4. Recommend a complete solution bundle that addresses the prospect's specific pain points
5. Provide detailed reasoning that connects their needs to your recommendations
6. Estimate the deal value based on company size and solution complexity
7. Suggest a realistic implementation timeline

Be strategic, consultative, and focus on value delivery. Your recommendations should feel tailored to their specific business needs.`,
    });

    const { output } = await agent.generate({
        prompt: `I need a product recommendation for a prospect with email: ${email}. 
    
Please:
1. Look up their company information
2. Review our product catalog
3. Get sales strategy advice
4. Recommend the best product bundle that addresses their specific needs

Provide a comprehensive recommendation with clear reasoning.`,
    });

    return output;
}
