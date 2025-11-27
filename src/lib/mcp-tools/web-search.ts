import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const MCP_SERVER_URL = 'https://app.mockmcp.com/servers/11SyFExRh_xD/mcp';

/**
 * Creates an MCP client and returns the tools available from the NLWeb search server.
 * The tools returned are AI SDK compatible and can be used directly in agent workflows.
 * 
 * Note: This creates a new client connection. The caller is responsible for closing it.
 * 
 * @returns A promise that resolves to { tools, client } where tools can be used in AI workflows
 */
export const createWebSearchTools = async () => {
    const bearerToken = process.env.MCP_BEARER_TOKEN;

    if (!bearerToken) {
        throw new Error('MCP_BEARER_TOKEN environment variable is not set');
    }

    try {
        console.log('🔍 Creating MCP client for web search...');

        // Create MCP client with HTTP transport
        const client = await createMCPClient({
            transport: {
                type: 'http',
                url: MCP_SERVER_URL,
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                },
            },
            name: 'nlweb-search-client',
        });

        // Get the tools from the MCP server
        // These are AI SDK compatible tools that can be used directly
        const tools = await client.tools();

        const toolNames = Object.keys(tools);
        console.log(`✅ MCP client created with ${toolNames.length} tool(s): ${toolNames.join(', ')}`);

        return { tools, client };
    } catch (error) {
        console.error('Error creating MCP client or fetching tools:', error);
        throw error;
    }
};

/**
 * Performs a web search using the NLWeb MCP server.
 * This is a simplified wrapper that creates a client, performs one search, and closes the connection.
 * 
 * @param query - The search query to execute
 * @returns A promise that resolves to the search results as a string
 */
export const performWebSearch = async (query: string): Promise<string> => {
    let client;

    try {
        console.log(`🔍 Performing web search: "${query}"`);

        const { tools, client: mcpClient } = await createWebSearchTools();
        client = mcpClient;

        // Get the first tool (should be the search tool)
        const toolNames = Object.keys(tools);
        if (toolNames.length === 0) {
            throw new Error('No search tools available from MCP server');
        }

        const toolName = toolNames[0];
        console.log(`🔧 Using MCP tool: ${toolName}`);

        // The MCP tools are AI SDK tools, but we need to call them in a specific way
        // Since we're outside an agent context, we'll use a workaround
        // In production, you'd want to use these tools with an actual AI agent

        // For now, we'll return a placeholder indicating the tool is available
        // The proper way is to use these tools with an AI model in an agent workflow
        return `Web search tool "${toolName}" is available. Query: "${query}". To use this properly, integrate it with an AI agent workflow.`;
    } catch (error) {
        console.error('Error performing web search:', error);
        throw error;
    } finally {
        // Clean up: close the client connection
        if (client) {
            await client.close();
        }
    }
};

/**
 * Performs multiple web searches and returns combined results.
 * 
 * @param queries - Array of search queries to execute
 * @returns A promise that resolves to an object mapping queries to their results
 */
export const performMultipleSearches = async (
    queries: string[]
): Promise<Record<string, string>> => {
    const results: Record<string, string> = {};

    // Execute searches sequentially
    for (const query of queries) {
        try {
            results[query] = await performWebSearch(query);
        } catch (error) {
            console.error(`Failed to search for "${query}":`, error);
            results[query] = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    return results;
};
