import { tool } from "ai";
import { z } from "zod";

import {
    formatProductCatalogDisplay,
    getProductCatalog,
} from "@/lib/product-catalog";

export const viewProductCatalogTool = tool({
    description:
        "View the complete product catalog including software, hardware, services, consulting, and training offerings available for sale",
    inputSchema: z.object({}),
    execute: async () => {
        const catalog = getProductCatalog();
        return formatProductCatalogDisplay(catalog);
    },
});
