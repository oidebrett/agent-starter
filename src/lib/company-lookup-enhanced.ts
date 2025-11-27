import { performMultipleSearches } from '@/lib/mcp-tools/web-search';
import { CompanyInfo } from '@/lib/company-lookup';

/**
 * Enhanced company lookup using real-time web search via MCP.
 * Falls back to basic heuristics if web search fails.
 */
export const getEnhancedCompanyInfo = async (email: string): Promise<CompanyInfo> => {
    try {
        // Extract domain from email
        const domain = email.split("@")[1]?.toLowerCase();

        if (!domain) {
            throw new Error("Invalid email format");
        }

        console.log(`🔍 Performing enhanced company lookup for: ${domain}`);

        // Construct targeted search queries
        const searchQueries = [
            `${domain} company information industry business`,
            `${domain} company size employees revenue`,
            `${domain} technology stack tools software`,
        ];

        // Perform web searches
        const searchResults = await performMultipleSearches(searchQueries);

        // Parse and extract company information from search results
        const companyInfo = await parseCompanyInfoFromSearchResults(
            domain,
            searchResults
        );

        console.log(`✅ Enhanced company lookup completed for: ${domain}`);

        return companyInfo;
    } catch (error) {
        console.error("Enhanced company lookup failed, using fallback:", error);
        // Fall back to basic heuristics
        return getBasicCompanyInfo(email);
    }
};

/**
 * Parses search results to extract structured company information.
 * This is a simplified parser - in production, you'd use more sophisticated NLP.
 */
async function parseCompanyInfoFromSearchResults(
    domain: string,
    searchResults: Record<string, string>
): Promise<CompanyInfo> {
    // Combine all search results
    const combinedResults = Object.values(searchResults).join('\n\n');

    // Extract industry (look for common industry keywords)
    let industry = "General Business";
    const industryKeywords = {
        "Financial Services": ["bank", "financial", "fintech", "investment", "insurance"],
        "Healthcare": ["health", "medical", "hospital", "pharmaceutical", "biotech"],
        "Technology": ["software", "tech", "saas", "cloud", "ai", "data"],
        "Retail": ["retail", "e-commerce", "shopping", "consumer"],
        "Manufacturing": ["manufacturing", "industrial", "factory", "production"],
        "Education": ["education", "university", "school", "learning"],
    };

    for (const [industryName, keywords] of Object.entries(industryKeywords)) {
        if (keywords.some(keyword =>
            combinedResults.toLowerCase().includes(keyword)
        )) {
            industry = industryName;
            break;
        }
    }

    // Extract company size
    let size = "Mid-Market";
    if (combinedResults.match(/\b(enterprise|large|fortune\s*500|global)\b/i)) {
        size = "Enterprise";
    } else if (combinedResults.match(/\b(startup|small|sme)\b/i)) {
        size = "Startup";
    }

    // Extract tech stack (look for technology mentions)
    const techStack: string[] = [];
    const techKeywords = [
        "AWS", "Azure", "Google Cloud", "Salesforce", "Microsoft 365",
        "SAP", "Oracle", "Workday", "ServiceNow", "Slack", "Zoom",
        "Docker", "Kubernetes", "React", "Python", "Java"
    ];

    for (const tech of techKeywords) {
        if (combinedResults.includes(tech)) {
            techStack.push(tech);
        }
    }

    // If no tech stack found, add generic ones
    if (techStack.length === 0) {
        techStack.push("Email systems", "Office productivity tools");
    }

    // Extract pain points based on industry
    const painPoints: string[] = [];
    if (industry === "Financial Services") {
        painPoints.push("Regulatory compliance", "Security requirements");
    } else if (industry === "Healthcare") {
        painPoints.push("HIPAA compliance", "Data security");
    } else if (industry === "Technology") {
        painPoints.push("Scalability", "Innovation speed");
    } else {
        painPoints.push("Digital transformation", "Operational efficiency");
    }

    return {
        domain,
        industry,
        size,
        techStack: techStack.slice(0, 5), // Limit to top 5
        painPoints,
    };
}

/**
 * Basic company info fallback using simple heuristics.
 * This is the original logic from company-lookup.ts
 */
function getBasicCompanyInfo(email: string): CompanyInfo {
    const domain = email.split("@")[1]?.toLowerCase() || "unknown.com";

    // Simple heuristic-based industry detection
    let industry = "General Business";
    let size = "Mid-Market";
    const techStack: string[] = [];
    const painPoints: string[] = [];

    // Industry inference based on domain keywords
    if (domain.includes("bank") || domain.includes("financial")) {
        industry = "Financial Services";
        painPoints.push("Regulatory compliance", "Security requirements");
        techStack.push("Legacy systems", "Mainframe");
    } else if (domain.includes("health") || domain.includes("medical")) {
        industry = "Healthcare";
        painPoints.push("HIPAA compliance", "Data security");
        techStack.push("EHR systems", "Medical devices");
    } else if (domain.includes("tech") || domain.includes("software")) {
        industry = "Technology";
        painPoints.push("Scalability", "Innovation speed");
        techStack.push("Cloud infrastructure", "Modern dev tools");
    }

    // Add generic pain points if none were added
    if (painPoints.length === 0) {
        painPoints.push("Digital transformation", "Operational efficiency");
    }

    // Add generic tech stack if none was added
    if (techStack.length === 0) {
        techStack.push("Email systems", "Office productivity tools");
    }

    return {
        domain,
        industry,
        size,
        techStack,
        painPoints,
    };
}
