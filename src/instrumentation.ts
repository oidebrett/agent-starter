

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        // Import ai-provider to ensure it's loaded and configured
        await import("./lib/ai-provider");
    }
}
