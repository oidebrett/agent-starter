"use client";

import { useState } from "react";

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCompanyDisplay, getCompanyInfo } from "@/lib/company-lookup";

export function CompanyLookupAccordion() {
    const [email, setEmail] = useState("");
    const [companyInfo, setCompanyInfo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLookup = async () => {
        if (!email.trim()) return;

        setLoading(true);
        setError(null);
        setCompanyInfo(null);

        try {
            const info = await getCompanyInfo(email);
            setCompanyInfo(formatCompanyDisplay(info));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lookup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccordionItem value="company-lookup">
            <AccordionTrigger className="font-mono text-cyan-400 hover:text-cyan-300">
                🏢 Company Lookup
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                        <label
                            htmlFor="prospect-email"
                            className="mb-2 block font-mono text-cyan-400 text-sm"
                        >
                            Enter prospect email:
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="prospect-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                placeholder="prospect@company.com"
                                className="flex-1 rounded border border-cyan-500/30 bg-black/50 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleLookup}
                                disabled={loading}
                                className="rounded bg-cyan-500/20 px-4 py-2 font-mono text-cyan-400 text-sm transition-colors hover:bg-cyan-500/30 disabled:opacity-50"
                            >
                                {loading ? "..." : "Lookup"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 font-mono text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {companyInfo && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <pre className="whitespace-pre-wrap font-mono text-gray-300 text-sm">
                                {companyInfo}
                            </pre>
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
