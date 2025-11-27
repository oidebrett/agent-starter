# MCP Web Search Integration - Implementation Summary

## Overview

This document explains how the NLWeb search MCP (Model Context Protocol) tool has been integrated into the product recommendation workflow to enhance company research capabilities.

## What Was Implemented

### 1. Core MCP Integration (`src/lib/mcp-tools/web-search.ts`)

Created a utility module that:
- Connects to the NLWeb MCP server using HTTP transport with bearer token authentication
- Returns AI SDK-compatible tools that can be used directly in agent workflows
- Manages MCP client lifecycle (creation and cleanup)

**Key Function:**
```typescript
createWebSearchTools() => { tools, client }
```

This function creates an MCP client and returns:
- `tools`: An object containing AI SDK-compatible web search tools
- `client`: The MCP client instance (must be closed after use)

### 2. Workflow Integration (`src/workflows/product-recommendation-agent.ts`)

Enhanced the `generateRecommendationStep` to:
- Dynamically load MCP web search tools at runtime
- Add web search tools to the agent's tool collection alongside existing tools
- Gracefully handle cases where MCP is not configured (optional feature)
- Properly clean up MCP client connections after use

**Agent Tool Collection:**
```typescript
{
  lookupCompany,           // Basic domain-based lookup
  viewProductCatalog,      // Product catalog
  askSalesManager,         // Sales advice
  ...webSearchTools,       // MCP web search tools (when available)
}
```

### 3. Enhanced Agent Instructions

Updated the agent's instructions to:
- Inform the AI that web search tools are available (when configured)
- Guide the agent to use web search for real-time company information
- Encourage strategic use of web search for industry trends and recent news

## How It Works

### Workflow Execution Flow

1. **User Request**: A user requests a product recommendation
2. **Email Retrieval**: The workflow gets the user's email from HubSpot via Nango
3. **MCP Connection** (Optional):
   - Attempts to create MCP client and load web search tools
   - If successful: Web search tools are added to the agent
   - If failed: Continues without web search (logs warning)
4. **Agent Generation**:
   - Agent has access to all tools (including web search if available)
   - Agent decides when to use each tool based on the task
   - Can use web search to enhance company research
5. **Cleanup**: MCP client connection is closed automatically

### Example Agent Behavior

With MCP configured, the agent might:
1. Use `lookupCompany` for basic domain information
2. Use web search to find recent news about the company
3. Use web search to research industry trends
4. Use `viewProductCatalog` to see available products
5. Use `askSalesManager` for sales strategy
6. Generate a recommendation based on all gathered information

## Configuration

### Environment Variable

Add to `.env.local`:
```bash
MCP_BEARER_TOKEN=your-mcp-bearer-token
```

### Optional Feature

The MCP integration is **completely optional**:
- ✅ If `MCP_BEARER_TOKEN` is set: Web search tools are available
- ✅ If `MCP_BEARER_TOKEN` is not set: Workflow continues with basic tools
- ✅ If MCP connection fails: Workflow continues with basic tools (logs warning)

## Benefits

### 1. Enhanced Company Research
- Real-time web data instead of just domain pattern matching
- Access to recent company news and developments
- Industry trend analysis

### 2. Flexible Architecture
- MCP tools are added dynamically to the agent
- No code changes needed to add/remove MCP integration
- Graceful degradation if MCP is unavailable

### 3. AI-Driven Tool Selection
- The AI agent decides when to use web search
- Strategic use based on the specific prospect
- Combines multiple data sources for better recommendations

## Technical Details

### MCP Client Lifecycle

```typescript
// Create
const { tools, client } = await createWebSearchTools();

// Use
const agent = new ToolLoopAgent({
  tools: { ...existingTools, ...tools }
});

// Cleanup
await client.close();
```

### Error Handling

The implementation includes robust error handling:
- Try-catch around MCP client creation
- Continues without MCP if connection fails
- Logs warnings for debugging
- Finally block ensures client cleanup

### Tool Integration Pattern

MCP tools are spread into the agent's tool collection:
```typescript
tools: {
  lookupCompany: companyLookup,
  viewProductCatalog: viewProductCatalogTool,
  askSalesManager: askSalesManagerTool,
  ...webSearchTools,  // Dynamically added MCP tools
}
```

## Files Modified/Created

### Created
- `src/lib/mcp-tools/web-search.ts` - MCP web search utility
- `src/lib/company-lookup-enhanced.ts` - Enhanced company lookup (for future use)
- `src/lib/tools/company-lookup-enhanced.ts` - Enhanced tool wrapper (for future use)

### Modified
- `src/workflows/product-recommendation-agent.ts` - Integrated MCP tools
- `src/lib/tools/index.ts` - Exported enhanced tool
- `README.md` - Documented MCP integration
- `.env.local.example` - Added MCP_BEARER_TOKEN

## Future Enhancements

### Potential Improvements

1. **Replace Basic Lookup**: Use the enhanced company lookup that leverages web search
2. **Caching**: Cache web search results to reduce API calls
3. **Multiple MCP Servers**: Support multiple MCP servers for different capabilities
4. **Persistent Connections**: Reuse MCP client across multiple requests
5. **Tool Selection**: Allow configuration of which MCP tools to enable

## Testing

To test the MCP integration:

1. Set `MCP_BEARER_TOKEN` in `.env.local`
2. Run the application: `pnpm run dev`
3. Trigger a product recommendation
4. Check logs for:
   - `✅ MCP web search tools loaded: [tool names]`
   - `🔧 Using MCP tool: [tool name]` (if agent uses it)
   - `🔌 Closing MCP client connection...`

Without `MCP_BEARER_TOKEN`:
- Should see: `⚠️ MCP web search tools not available, continuing without them`
- Workflow should complete successfully with basic tools

## Conclusion

The MCP web search integration enhances the product recommendation workflow by providing real-time web search capabilities while maintaining backward compatibility and graceful degradation. The implementation follows best practices for optional features and proper resource management.
