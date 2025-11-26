import { tool } from "ai";
import { z } from "zod";

import {
    formatCompanyDisplay,
    getCompanyInfo,
} from "@/lib/company-lookup";

export const lookupCompanyTool = (email: string) => {
    return tool({
        description: `Look up company information for the prospect based on their email domain. This provides industry, company size, tech stack, and pain points.`,
        inputSchema: z.object({}),
        execute: async () => {
            const companyInfo = await getCompanyInfo(email);
            return formatCompanyDisplay(companyInfo);
        },
    });
};
