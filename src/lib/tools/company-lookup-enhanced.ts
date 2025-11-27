import { tool } from "ai";
import { z } from "zod";

import { formatCompanyDisplay } from "@/lib/company-lookup";
import { getEnhancedCompanyInfo } from "@/lib/company-lookup-enhanced";

/**
 * Enhanced company lookup tool that uses real-time web search via MCP.
 * This provides more accurate and up-to-date company information compared to the basic tool.
 */
export const lookupCompanyEnhancedTool = (email: string) => {
    return tool({
        description: `Look up detailed company information for the prospect using real-time web search. 
This provides industry, company size, technology stack, and pain points based on current web data.
More accurate than basic domain inference.`,
        inputSchema: z.object({}),
        execute: async () => {
            console.log(`🔍 Enhanced company lookup for: ${email}`);
            const companyInfo = await getEnhancedCompanyInfo(email);
            return formatCompanyDisplay(companyInfo);
        },
    });
};
