"use client";

import { useState } from "react";

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { getSalesManagerAdvice } from "@/lib/sales-manager";

export function SalesManagerAccordion() {
    const [question, setQuestion] = useState("");
    const [advice, setAdvice] = useState<string | null>(null);

    const handleAsk = () => {
        if (!question.trim()) return;
        const response = getSalesManagerAdvice(question);
        setAdvice(response.response);
    };

    return (
        <AccordionItem value="sales-manager">
            <AccordionTrigger className="font-mono text-blue-400 hover:text-blue-300">
                💼 Sales Manager
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                        <label
                            htmlFor="sales-question"
                            className="mb-2 block font-mono text-blue-400 text-sm"
                        >
                            Ask for sales advice:
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="sales-question"
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                                placeholder="e.g., How should I approach this prospect?"
                                className="flex-1 rounded border border-blue-500/30 bg-black/50 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleAsk}
                                className="rounded bg-blue-500/20 px-4 py-2 font-mono text-blue-400 text-sm transition-colors hover:bg-blue-500/30"
                            >
                                Ask
                            </button>
                        </div>
                    </div>

                    {advice && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="mb-2 font-mono text-gray-400 text-xs uppercase tracking-wider">
                                Sales Manager's Advice:
                            </div>
                            <div className="font-mono text-gray-300 text-sm">{advice}</div>
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
