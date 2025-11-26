import { z } from "zod";

export const productRecommendationSchema = z.object({
    software: z.string().describe("Primary software product recommendation"),
    hardware: z.string().describe("Hardware product recommendation (if applicable)"),
    service: z.string().describe("Professional service recommendation"),
    consulting: z.string().describe("Consulting engagement recommendation"),
    reasoning: z.string().describe("Detailed explanation of why these products fit the client's needs"),
    estimatedValue: z.string().describe("Estimated deal value range (e.g., '$50K-$100K')"),
    timeline: z.string().describe("Recommended implementation timeline"),
});

export type ProductRecommendation = z.infer<typeof productRecommendationSchema>;
