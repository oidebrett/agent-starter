import { experimental_createMCPClient as createMCPClient } from '@ai-sdk/mcp';

const MCP_SERVER_URL = 'https://app.mockmcp.com/servers/11SyFExRh_xD/mcp';

/**
 * Creates an MCP client and returns the tools available from the NLWeb search server.
 * The client uses HTTP transport with bearer token authentication.
 * 
 * @returns A promise that resolves to the tools available from the MCP server
 */
export const nlwebSearchTool = async () => {
    const bearerToken = process.env.MCP_BEARER_TOKEN;

    if (!bearerToken) {
        throw new Error('MCP_BEARER_TOKEN environment variable is not set');
    }

    let client;

    try {
        // Create MCP client with HTTP transport
        client = await createMCPClient({
            transport: {
                type: 'http',
                url: MCP_SERVER_URL,
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                },
            },
            name: 'nlweb-search-client',
        });

        // Get all available tools from the MCP server
        const tools = await client.tools();

        return tools;
    } catch (error) {
        console.error('Error creating MCP client or fetching tools:', error);
        throw error;
    } finally {
        // Clean up: close the client connection
        if (client) {
            await client.close();
        }
    }
};
