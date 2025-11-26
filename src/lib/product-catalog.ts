export interface ProductCatalog {
    software: string[];
    hardware: string[];
    services: string[];
    consulting: string[];
    training: string[];
}

export const getProductCatalog = (): ProductCatalog => {
    return {
        software: [
            "Enterprise CRM Platform",
            "AI-Powered Analytics Suite",
            "Cloud Collaboration Tools",
            "Cybersecurity Management System",
            "Automated Workflow Engine",
            "Customer Data Platform",
        ],
        hardware: [
            "IoT Sensor Network",
            "Edge Computing Devices",
            "Enterprise Servers",
            "Network Infrastructure Kit",
            "Smart Office Equipment",
        ],
        services: [
            "Cloud Migration Services",
            "24/7 Technical Support",
            "Managed IT Services",
            "Data Backup & Recovery",
            "API Integration Services",
            "Performance Optimization",
        ],
        consulting: [
            "Digital Transformation Consulting",
            "IT Strategy & Planning",
            "Security Audit & Compliance",
            "Process Automation Consulting",
            "Technology Assessment",
        ],
        training: [
            "Executive Leadership Training",
            "Technical Skills Bootcamp",
            "Cybersecurity Awareness Program",
            "Agile & DevOps Training",
            "Data Analytics Certification",
        ],
    };
};

export const formatProductCatalogDisplay = (catalog: ProductCatalog): string => {
    return `Available products and services:
Software: ${catalog.software.join(", ")}
Hardware: ${catalog.hardware.join(", ")}
Services: ${catalog.services.join(", ")}
Consulting: ${catalog.consulting.join(", ")}
Training: ${catalog.training.join(", ")}`;
};
