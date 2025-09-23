# Agentic Coding MCPs

## Overview

This guide provides detailed information on Management Control Panel (MCP) integration capabilities. MCP enables seamless agent workflows by connecting to more than 80 servers, covering development, AI, data management, productivity, cloud storage, e-commerce, finance, communication, and design. Each server offers specialized tools, allowing agents to securely access, automate, and manage external services through a unified and modular system. This approach supports building dynamic, scalable, and intelligent workflows with minimal setup and maximum flexibility.

## Install via NPM
```
npx create-sparc init --force
```
---

## Active MCP Servers Configuration

### 🛢️ Database & Backend Services

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🛢️    | Supabase       | ✅ Active | Database, Auth, Storage backend   |
| 🐘    | PostgreSQL     | ✅ Active | Direct PostgreSQL database access |

### 🎭 Browser Automation & Testing

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🎭    | Playwright     | ✅ Active | Browser automation and testing    |

### 🌐 Web Scraping & Content Fetching

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🔍    | Fetch MCP      | 🔒 Available | HTML, Markdown, JSON, TXT fetching |
| 🧠    | Jina Tools     | 🔒 Available | AI-powered web reading and search |

### 🤖 AI & Search Services

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🧩    | Perplexity AI  | 🔒 Available | AI search and question answering   |
| 🧠    | Pydantic AI RAG| 🔒 Available | RAG queries and knowledge graphs   |
| 🧠    | Mem0           | 🔒 Available | Knowledge storage and retrieval    |
| 🔍    | Composio Search| 🔒 Available | Unified web search for agents      |
| 🧮    | Code Interpreter| 🔒 Available | Code execution and data analysis  |

### 🎨 UI Development

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🎨    | Shadcn UI      | 🔒 Available | React component library integration|

### 🔗 System Integration

|  | Service       | Status | Description                        |
|:------|:--------------|:-------|:-----------------------------------|
| 🏛️    | Archon         | 🔒 Available | Remote MCP server orchestration    |

---

## Available MCP Servers (Extended Catalog)

### 🛠️ Development & Coding

|  | Service       | Description                        |
|:------|:--------------|:-----------------------------------|
| 🐙    | GitHub         | Repository management, issues, PRs |
| 🦊    | GitLab         | Repo management, CI/CD pipelines   |
| 🧺    | Bitbucket      | Code collaboration, repo hosting   |
| 🐳    | DockerHub      | Container registry and management |
| 📦    | npm            | Node.js package registry          |
| 🐍    | PyPI           | Python package index              |
| 🤗    | HuggingFace Hub| AI model repository               |
| 🧠    | Cursor         | AI-powered code editor            |
| 🌊    | Windsurf       | AI development platform           |

---

### 🤖 AI & Machine Learning

|  | Service       | Description                        |
|:------|:--------------|:-----------------------------------|
| 🔥    | OpenAI         | GPT models, DALL-E, embeddings      |
| 🧩    | Perplexity AI  | AI search and question answering   |
| 🧠    | Cohere         | NLP models                         |
| 🧬    | Replicate      | AI model hosting                   |
| 🎨    | Stability AI   | Image generation AI                |
| 🚀    | Groq           | High-performance AI inference      |
| 📚    | LlamaIndex     | Data framework for LLMs            |
| 🔗    | LangChain      | Framework for LLM apps             |
| ⚡    | Vercel AI      | AI SDK, fast deployment            |
| 🛠️    | AutoGen        | Multi-agent orchestration          |
| 🧑‍🤝‍🧑 | CrewAI         | Agent team framework               |
| 🧠    | Huggingface    | Model hosting and APIs             |

---

### 📈 Data & Analytics

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 🛢️   | Supabase        | Database, Auth, Storage backend   |
| 🐘   | PostgreSQL      | Direct database access            |
| 🔍   | Ahrefs          | SEO analytics                     |
| 🧮   | Code Interpreter| Code execution and data analysis  |

---

### 📅 Productivity & Collaboration

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| ✉️    | Gmail           | Email service                     |
| 📹    | YouTube         | Video sharing platform            |
| 👔    | LinkedIn        | Professional network              |
| 📰    | HackerNews      | Tech news discussions             |
| 🗒️   | Notion          | Knowledge management              |
| 💬    | Slack           | Team communication                |
| ✅    | Asana           | Project management                |
| 📋    | Trello          | Kanban boards                     |
| 🛠️    | Jira            | Issue tracking and projects       |
| 🎟️   | Zendesk         | Customer service                  |
| 🎮    | Discord         | Community messaging               |
| 📲    | Telegram        | Messaging app                     |

---

### 🗂️ File Storage & Management

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| ☁️    | Google Drive    | Cloud file storage                 |
| 📦    | Dropbox         | Cloud file sharing                 |
| 📁    | Box             | Enterprise file storage            |
| 🪟    | OneDrive        | Microsoft cloud storage            |
| 🧠    | Mem0            | Knowledge storage, notes           |

---

### 🔎 Search & Web Information

|  | Service         | Description                      |
|:------|:----------------|:---------------------------------|
| 🌐   | Composio Search  | Unified web search for agents    |
| 🔍   | Fetch MCP        | Web content fetching             |
| 🧠   | Jina Tools       | AI-powered web reading           |

---

### 🛒 E-commerce & Finance

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 🛍️   | Shopify         | E-commerce platform               |
| 💳    | Stripe          | Payment processing                |
| 💰    | PayPal          | Online payments                   |
| 📒    | QuickBooks      | Accounting software               |
| 📈    | Xero            | Accounting and finance            |
| 🏦    | Plaid           | Financial data APIs               |

---

### 📣 Marketing & Communications

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 🐒    | MailChimp       | Email marketing platform          |
| ✉️    | SendGrid        | Email delivery service            |
| 📞    | Twilio          | SMS and calling APIs              |
| 💬    | Intercom        | Customer messaging                |
| 🎟️   | Freshdesk       | Customer support                  |

---

### 🛜 Social Media & Publishing

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 👥    | Facebook        | Social networking                 |
| 📷    | Instagram       | Photo sharing                     |
| 🐦    | Twitter         | Microblogging platform            |
| 👽    | Reddit          | Social news aggregation           |
| ✍️    | Medium          | Blogging platform                 |
| 🌐   | WordPress       | Website and blog publishing       |
| 🌎   | Webflow         | Web design and hosting            |

---

### 🎨 Design & Digital Assets

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 🎨    | Figma           | Collaborative UI design           |
| 🎞️   | Adobe           | Creative tools and software       |
| 🎨    | Shadcn UI       | React component library           |

---

### 🗓️ Scheduling & Events

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 📆    | Calendly        | Appointment scheduling            |
| 🎟️   | Eventbrite      | Event management and tickets      |
| 📅    | Calendar Google | Google Calendar Integration       |
| 📅    | Calendar Outlook| Outlook Calendar Integration      |

---

### 🎭 Browser Automation & Testing

|  | Service        | Description                        |
|:------|:---------------|:-----------------------------------|
| 🎭    | Playwright      | Browser automation and testing    |

---

## Configuration Architecture

### Server Types

1. **stdio** - Standard input/output communication
2. **sse** - Server-sent events for real-time communication
3. **url** - Direct URL-based connections

### Security Features

- **autoApprove**: Pre-approved operations for trusted tools
- **disabled**: Toggle server availability
- **timeout**: Operation timeout limits
- **env**: Secure environment variable handling

### Environment Variables Required

```bash
# Database
SUPABASE_ACCESS_TOKEN=your_supabase_token
DATABASE_URI=postgresql://user:pass@host:port/db

# AI Services
PERPLEXITY_API_KEY=your_perplexity_key
JINA_API_KEY=your_jina_key
```

---

## 🧩 Using MCP Tools

To use an MCP server:
1. Connect to the desired MCP endpoint or install server (e.g., Supabase via `npx`).
2. Authenticate with your credentials.
3. Trigger available actions through Roo workflows.
4. Maintain security and restrict only necessary permissions.

### Example Usage

```javascript
// Using Supabase MCP
await mcpTool('supabase', 'list_tables', {});

// Using Playwright MCP
await mcpTool('playwright-mcp', 'screenshot', { url: 'https://example.com' });

// Using Perplexity AI
await mcpTool('perplexity-mcp', 'search', { query: 'latest AI developments' });
```

---

## Architecture Benefits

- **Modular Integration**: Each MCP server operates independently
- **Secure Access**: Environment-based authentication
- **Scalable Workflows**: Easy addition of new services
- **Unified Interface**: Consistent API across all services
- **Flexible Configuration**: Enable/disable services as needed