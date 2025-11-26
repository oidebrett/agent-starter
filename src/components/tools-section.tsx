import { Accordion } from "@/components/ui/accordion";

import { ProductCatalogAccordion } from "./product-catalog-accordion";
import { SalesManagerAccordion } from "./sales-manager-accordion";
import { CompanyLookupAccordion } from "./company-lookup-accordion";

export function ToolsSection() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="p-6 pb-4">
        <div className="mb-4 font-mono font-semibold text-gray-400 text-sm uppercase tracking-wider">
          Sales Tools
        </div>
      </div>

      <Accordion type="single" collapsible className="px-6 pb-6">
        <ProductCatalogAccordion />
        <SalesManagerAccordion />
        <CompanyLookupAccordion />
      </Accordion>
    </div>
  );
}
