"use client";

import { useState } from "react";

import type { ProductRecommendation } from "@/lib/product-recommendation";

interface ApiResponse {
    status: string;
    authUrl?: string;
    message?: string;
    email?: string;
    recommendation?: ProductRecommendation;
}

export function ProductDisplay() {
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendation = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/product-recommendation", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to get product recommendation");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const recommendation = result?.recommendation;

    return (
        <>
            {/* CTA Button */}
            <div className="mb-12 flex justify-center">
                <button
                    type="button"
                    onClick={fetchRecommendation}
                    disabled={loading}
                    className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-medium font-mono text-lg text-white backdrop-blur-sm transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Analyzing prospect..." : "Generate Product Pitch"}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
                    {error}
                </div>
            )}

            {/* Auth Required Message */}
            {result?.status === "needs_auth" && result.authUrl && (
                <div className="mb-8 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
                    <p className="mb-3 text-yellow-400 text-lg font-semibold">
                        HubSpot Authorization Required
                    </p>
                    <p className="mb-4 text-yellow-300/80">
                        To generate personalized product recommendations, we need access to your HubSpot account.
                    </p>
                    <a
                        href={result.authUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg bg-yellow-500/20 px-6 py-3 font-medium text-yellow-300 transition-all hover:bg-yellow-500/30"
                    >
                        Authorize HubSpot →
                    </a>
                </div>
            )}

            {/* Prospect Email */}
            {result?.email && (
                <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center backdrop-blur-sm">
                    <div className="font-mono text-green-400 text-sm uppercase tracking-wider mb-1">
                        Prospect Email
                    </div>
                    <div className="font-mono text-white text-lg">{result.email}</div>
                </div>
            )}

            {/* Product Recommendation Grid */}
            <div className="mb-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Software */}
                    <div className="flex min-h-[180px] flex-col justify-center rounded-lg border border-purple-500/30 bg-purple-500/5 p-8 backdrop-blur-sm">
                        <div className="mb-3 font-mono text-purple-400 text-sm uppercase tracking-wider">
                            Software Solution
                        </div>
                        <div className="font-mono text-white text-xl">
                            {loading ? (
                                <div className="h-8 animate-pulse rounded bg-white/10" />
                            ) : recommendation ? (
                                recommendation.software
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>

                    {/* Hardware */}
                    <div className="flex min-h-[180px] flex-col justify-center rounded-lg border border-blue-500/30 bg-blue-500/5 p-8 backdrop-blur-sm">
                        <div className="mb-3 font-mono text-blue-400 text-sm uppercase tracking-wider">
                            Hardware
                        </div>
                        <div className="font-mono text-white text-xl">
                            {loading ? (
                                <div className="h-8 animate-pulse rounded bg-white/10" />
                            ) : recommendation ? (
                                recommendation.hardware
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>

                    {/* Service */}
                    <div className="flex min-h-[180px] flex-col justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-8 backdrop-blur-sm">
                        <div className="mb-3 font-mono text-cyan-400 text-sm uppercase tracking-wider">
                            Professional Service
                        </div>
                        <div className="font-mono text-white text-xl">
                            {loading ? (
                                <div className="h-8 animate-pulse rounded bg-white/10" />
                            ) : recommendation ? (
                                recommendation.service
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>

                    {/* Consulting */}
                    <div className="flex min-h-[180px] flex-col justify-center rounded-lg border border-pink-500/30 bg-pink-500/5 p-8 backdrop-blur-sm">
                        <div className="mb-3 font-mono text-pink-400 text-sm uppercase tracking-wider">
                            Consulting Engagement
                        </div>
                        <div className="font-mono text-white text-xl">
                            {loading ? (
                                <div className="h-8 animate-pulse rounded bg-white/10" />
                            ) : recommendation ? (
                                recommendation.consulting
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deal Metrics */}
            {recommendation && (
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6 backdrop-blur-sm">
                        <div className="mb-2 font-mono text-emerald-400 text-sm uppercase tracking-wider">
                            Estimated Deal Value
                        </div>
                        <div className="font-mono text-white text-2xl font-bold">
                            {recommendation.estimatedValue}
                        </div>
                    </div>

                    <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-6 backdrop-blur-sm">
                        <div className="mb-2 font-mono text-orange-400 text-sm uppercase tracking-wider">
                            Implementation Timeline
                        </div>
                        <div className="font-mono text-white text-2xl font-bold">
                            {recommendation.timeline}
                        </div>
                    </div>
                </div>
            )}

            {/* Reasoning */}
            {recommendation?.reasoning && (
                <div className="mb-12 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-3 font-mono font-semibold text-gray-400 text-sm uppercase tracking-wider">
                        Strategic Rationale
                    </div>
                    <div className="text-gray-300 leading-relaxed">
                        {recommendation.reasoning}
                    </div>
                </div>
            )}
        </>
    );
}
