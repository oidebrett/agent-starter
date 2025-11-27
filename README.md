# AI Sales Agent Starter

An intelligent B2B sales assistant that generates personalized product recommendations using AI agents, HubSpot integration via Nango, and company intelligence.

## Features

- 🤖 **AI-Powered Product Recommendations**: Generates tailored product bundles based on prospect data
- 📧 **HubSpot Integration**: Retrieves prospect email via Nango's HubSpot connector
- 🏢 **Company Intelligence**: Automatically researches company industry, size, and pain points from email domain
- 🔍 **Real-Time Web Search (MCP)**: Optional integration with NLWeb search via Model Context Protocol for enhanced company research
- 💼 **Sales Manager AI**: Provides strategic sales advice and approach recommendations
- 📦 **Product Catalog**: Comprehensive catalog of software, hardware, services, consulting, and training offerings
- 💰 **Deal Metrics**: Estimates deal value and implementation timeline

## How It Works

1. **User Authentication**: Connects to HubSpot via Nango to retrieve the prospect's email
2. **Company Lookup**: Analyzes the email domain to infer company industry, size, tech stack, and pain points
3. **AI Agent Workflow**: Uses multiple tools (product catalog, sales manager, company lookup) to generate recommendations
4. **Product Pitch**: Delivers a complete solution bundle with software, hardware, services, and consulting recommendations

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Nango account with HubSpot integration configured

### Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key

# Nango Integration
NANGO_SECRET_KEY=your-nango-secret-key

# Optional: MCP Web Search Integration
MCP_BEARER_TOKEN=your-mcp-bearer-token
```

### Development Mode

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the AI Sales Agent in action.

### Production Mode

```bash
pnpm install
pnpm run build
pnpm run start
```

## Architecture

- **Frontend**: Next.js 15 with React Server Components
- **AI Framework**: Vercel AI SDK with tool calling
- **Workflows**: Vercel Workflow Engine for multi-step agent orchestration
- **Integration**: Nango for HubSpot authentication and data retrieval
- **Styling**: Tailwind CSS with glassmorphism design

## Tools & Agents

### Product Catalog Tool
Views available products across software, hardware, services, consulting, and training categories.

### Sales Manager Tool
Provides strategic sales advice on approach, positioning, and deal strategy.

### Company Lookup Tool
Researches prospect companies based on email domain to understand industry, size, and needs.

### Web Search Tool (MCP - Optional)
When configured with `MCP_BEARER_TOKEN`, the agent gains access to real-time web search capabilities via the Model Context Protocol (MCP). This allows the AI agent to:
- Search for current company information and news
- Discover recent industry trends and developments
- Find additional context about prospects beyond basic domain inference
- Validate assumptions with real-time data

The MCP integration is **optional** - the workflow will continue to function with basic company lookup if MCP is not configured. When available, the AI agent can strategically decide when to use web search for enhanced research.

**How it works:**
1. The workflow creates an MCP client connection to the NLWeb search server
2. Web search tools are dynamically added to the agent's tool collection
3. The AI agent can use these tools alongside existing tools (product catalog, sales manager, etc.)
4. The MCP connection is automatically closed after the recommendation is generated

## Learn More

- [Vercel AI SDK](https://sdk.vercel.ai/docs) — AI framework with tool calling
- [Vercel Workflows](https://vercel.com/docs/workflow) — Multi-step agent orchestration
- [Nango](https://www.nango.dev/) — Integration platform for HubSpot and other APIs
- [Next.js Documentation](https://nextjs.org/docs) — Next.js features and API
