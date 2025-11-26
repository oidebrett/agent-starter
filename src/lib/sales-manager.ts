export interface SalesAdvice {
    question: string;
    response: string;
}

export const getSalesManagerAdvice = (question: string): SalesAdvice => {
    const salesResponses = [
        "Focus on ROI - show them the numbers and how quickly they'll see returns.",
        "Lead with their pain points. What keeps them up at night?",
        "Bundle complementary products for a comprehensive solution.",
        "Emphasize scalability - they need to know this grows with their business.",
        "Security and compliance are key selling points in today's market.",
        "Don't oversell - build trust by recommending what they actually need.",
        "Highlight our customer success stories in their industry.",
        "Position this as a strategic investment, not just a purchase.",
        "Focus on the total cost of ownership, not just upfront costs.",
        "Demonstrate how this integrates with their existing tech stack.",
    ];

    const response =
        salesResponses[Math.floor(Math.random() * salesResponses.length)];

    return {
        question,
        response,
    };
};

export const formatSalesAdvice = (advice: SalesAdvice): string => {
    return `Sales Manager's advice about "${advice.question}": ${advice.response}`;
};
