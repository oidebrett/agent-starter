import { tool } from "ai";
import { z } from "zod";

import {
    formatSalesAdvice,
    getSalesManagerAdvice,
} from "@/lib/sales-manager";

export const askSalesManagerTool = tool({
    description:
        "Ask the sales manager for advice on how to approach the sale, what to emphasize, or sales strategy recommendations",
    inputSchema: z.object({
        question: z
            .string()
            .describe("The question to ask the sales manager about the sales approach"),
    }),
    execute: async ({ question }) => {
        const advice = getSalesManagerAdvice(question);
        return formatSalesAdvice(advice);
    },
});
