"use client";

import { useState } from "react";

export function NangoDisplay() {
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authUrl, setAuthUrl] = useState<string | null>(null);

    const fetchEmail = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setAuthUrl(null);

        try {
            const response = await fetch("/api/nango", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to run nango agent");
            }

            const data = await response.json();

            if (data.status === "needs_auth") {
                setAuthUrl(data.authUrl);
            } else if (data.status === "success") {
                setResult(data.result);
            } else {
                setError("Unknown status received");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8 rounded-lg border border-green-500/30 bg-green-500/5 p-8 backdrop-blur-sm">
            <div className="mb-6 text-center">
                <h2 className="mb-2 font-mono text-2xl font-bold text-green-400">
                    Nango Agent
                </h2>
                <p className="text-gray-400">
                    Retrieve your email from HubSpot using Nango
                </p>
            </div>

            <div className="flex justify-center mb-6">
                <button
                    type="button"
                    onClick={fetchEmail}
                    disabled={loading}
                    className="rounded-lg border border-green-500/20 bg-green-500/10 px-8 py-3 font-medium font-mono text-green-400 transition-all hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Agent Running..." : "Get My Email"}
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-center text-red-400">
                    {error}
                </div>
            )}

            {authUrl && (
                <div className="mb-4 rounded border border-yellow-500/20 bg-yellow-500/10 p-4 text-center">
                    <p className="mb-2 text-yellow-400">Authorization Required</p>
                    <a
                        href={authUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-300 underline hover:text-yellow-200"
                    >
                        Click here to authorize HubSpot
                    </a>
                </div>
            )}

            {result && (
                <div className="rounded border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 font-mono text-xs text-gray-500 uppercase tracking-wider">
                        Agent Result
                    </div>
                    <div className="font-mono text-white whitespace-pre-wrap">
                        {result}
                    </div>
                </div>
            )}
        </div>
    );
}
