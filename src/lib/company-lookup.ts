export interface CompanyInfo {
    domain: string;
    industry: string;
    size: string;
    techStack: string[];
    painPoints: string[];
}

/**
 * Simple domain-based company lookup (no authentication required)
 * In a real implementation, this would call a service like Clearbit, Hunter.io, or similar
 */
export const getCompanyInfo = async (email: string): Promise<CompanyInfo> => {
    try {
        // Extract domain from email
        const domain = email.split("@")[1]?.toLowerCase();

        if (!domain) {
            throw new Error("Invalid email format");
        }

        // Simple heuristic-based industry detection
        // In production, you'd call an actual API like Clearbit or Hunter.io
        const companyInfo = inferCompanyInfo(domain);

        return companyInfo;
    } catch (error) {
        console.error("Company lookup error:", error);
        throw new Error("Failed to lookup company information");
    }
};

function inferCompanyInfo(domain: string): CompanyInfo {
    // Map of known domains to industries (for demo purposes)
    const knownDomains: Record<string, Partial<CompanyInfo>> = {
        "gmail.com": {
            industry: "Technology / Consumer",
            size: "Enterprise",
            techStack: ["Google Workspace", "Cloud Infrastructure"],
            painPoints: ["Data privacy", "Integration complexity"],
        },
        "microsoft.com": {
            industry: "Technology / Enterprise Software",
            size: "Enterprise",
            techStack: ["Azure", "Microsoft 365", ".NET"],
            painPoints: ["Legacy system modernization", "Cloud migration"],
        },
        "salesforce.com": {
            industry: "Technology / CRM",
            size: "Enterprise",
            techStack: ["Salesforce", "Heroku", "Tableau"],
            painPoints: ["Customization complexity", "Integration needs"],
        },
    };

    // Check if we have specific info for this domain
    if (knownDomains[domain]) {
        return {
            domain,
            industry: knownDomains[domain].industry || "General Business",
            size: knownDomains[domain].size || "Mid-Market",
            techStack: knownDomains[domain].techStack || [],
            painPoints: knownDomains[domain].painPoints || [],
        };
    }

    // Infer based on domain patterns
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
    } else if (domain.includes("edu") || domain.endsWith(".edu")) {
        industry = "Education";
        painPoints.push("Budget constraints", "Remote learning");
        techStack.push("LMS platforms", "Student information systems");
    } else if (domain.includes("retail") || domain.includes("shop")) {
        industry = "Retail / E-commerce";
        painPoints.push("Inventory management", "Customer experience");
        techStack.push("E-commerce platforms", "POS systems");
    } else if (domain.includes("tech") || domain.includes("software")) {
        industry = "Technology";
        painPoints.push("Scalability", "Innovation speed");
        techStack.push("Cloud infrastructure", "Modern dev tools");
    } else if (domain.includes("insurance")) {
        industry = "Insurance";
        painPoints.push("Claims processing", "Risk assessment");
        techStack.push("Policy management systems", "Actuarial software");
    } else if (domain.includes("manufacturing") || domain.includes("industrial")) {
        industry = "Manufacturing";
        painPoints.push("Supply chain optimization", "Equipment downtime");
        techStack.push("ERP systems", "IoT sensors");
    }

    // Size inference based on domain
    if (domain.includes("enterprise") || domain.includes("global")) {
        size = "Enterprise";
    } else if (domain.includes("startup") || domain.includes("labs")) {
        size = "Startup";
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

export const formatCompanyDisplay = (company: CompanyInfo): string => {
    return `Company Profile:
Domain: ${company.domain}
Industry: ${company.industry}
Company Size: ${company.size}
Tech Stack: ${company.techStack.join(", ")}
Key Pain Points: ${company.painPoints.join(", ")}`;
};
