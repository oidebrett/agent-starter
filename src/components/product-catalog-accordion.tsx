import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    formatProductCatalogDisplay,
    getProductCatalog,
} from "@/lib/product-catalog";

export function ProductCatalogAccordion() {
    const catalog = getProductCatalog();
    const display = formatProductCatalogDisplay(catalog);

    return (
        <AccordionItem value="product-catalog">
            <AccordionTrigger className="font-mono text-purple-400 hover:text-purple-300">
                📦 Product Catalog
            </AccordionTrigger>
            <AccordionContent>
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-gray-300 text-sm">
                        {display}
                    </pre>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
