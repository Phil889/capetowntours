# MCP Configuration Validation

## Configuration Schema Validation

### TypeScript Interface Definition
```typescript
interface MCPServerConfig {
  // Connection Configuration
  command?: string;                    // Command to execute (stdio servers)
  args?: string[];                    // Command arguments
  url?: string;                       // Direct URL connection (url/sse servers)
  type: 'stdio' | 'sse' | 'url';     // Communication protocol
  
  // Security & Access Control
  env?: Record<string, string>;       // Environment variables
  autoApprove?: string[];            // Pre-approved operations
  disabled?: boolean;                // Service availability toggle
  timeout?: number;                  // Operation timeout in seconds
}

interface MCPConfiguration {
  mcpServers: Record<string, MCPServerConfig>;
}
```

### Validation Rules

#### 1. Server Configuration Validation
```typescript
const validateServerConfig = (name: string, config: MCPServerConfig): ValidationResult => {
  const errors: string[] = [];
  
  // Type validation
  if (!['stdio', 'sse', 'url'].includes(config.type)) {
    errors.push(`${name}: Invalid type. Must be 'stdio', 'sse', or 'url'`);
  }
  
  // stdio servers must have command
  if (config.type === 'stdio' && !config.command) {
    errors.push(`${name}: stdio servers require 'command' field`);
  }
  
  // url/sse servers must have url
  if (['url', 'sse'].includes(config.type) && !config.url) {
    errors.push(`${name}: ${config.type} servers require 'url' field`);
  }
  
  // Timeout validation
  if (config.timeout && (config.timeout < 1 || config.timeout > 300)) {
    errors.push(`${name}: timeout must be between 1 and 300 seconds`);
  }
  
  return { valid: errors.length === 0, errors };
};
```

#### 2. Environment Variable Validation
```typescript
const validateEnvironmentVariables = (config: MCPConfiguration): ValidationResult => {
  const errors: string[] = [];
  const requiredEnvVars = new Set<string>();
  
  // Extract environment variable references
  Object.entries(config.mcpServers).forEach(([name, serverConfig]) => {
    if (serverConfig.env) {
      Object.values(serverConfig.env).forEach(value => {
        const envMatch = value.match(/\$\{env:([^}]+)\}/);
        if (envMatch) {
          requiredEnvVars.add(envMatch[1]);
        }
      });
    }
  });
  
  // Check if required environment variables are available
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};
```

## Current Configuration Analysis

### ✅ Valid Configurations

#### Supabase Server
```json
{
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=zbgpiqhxrynjllcxqjre"],
  "env": { "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}" },
  "autoApprove": ["list_tables", "execute_sql", "list_branches"],
  "disabled": false,
  "timeout": 60,
  "type": "stdio"
}
```
**Status**: ✅ Valid - All required fields present, proper stdio configuration

#### Playwright Server
```json
{
  "command": "npx",
  "args": ["-y", "@executeautomation/playwright-mcp-server"],
  "env": {},
  "autoApprove": ["screenshot", "playwright_get_visible_text"],
  "disabled": false,
  "timeout": 60,
  "type": "stdio"
}
```
**Status**: ✅ Valid - Proper stdio configuration with empty env object

#### Composio URL Services
```json
{
  "url": "https://mcp.composio.dev/mem0/abandoned-creamy-horse-Y39-hm?agent=cursor"
}
```
**Status**: ⚠️ Incomplete - Missing type field, should be `"type": "url"`

### 🔧 Configuration Fixes Needed

#### 1. Add Missing Type Fields
Several URL-based services are missing the `type` field:
- mem0
- perplexityai  
- composio_search
- codeinterpreter

#### 2. Environment Variable References
Some configurations reference environment variables that need to be defined:
- `SUPABASE_ACCESS_TOKEN`
- `PERPLEXITY_API_KEY`
- `JINA_API_KEY`
- `DATABASE_URI`

### Compatibility Matrix

| Server Name | Type | Command | URL | Env Vars | Status |
|-------------|------|---------|-----|----------|--------|
| supabase | stdio | ✅ | - | ✅ | ✅ Valid |
| fetch-mcp | stdio | ✅ | - | ✅ | ✅ Valid |
| perplexity-mcp | stdio | ✅ | - | ✅ | ✅ Valid |
| pydantic-ai-rag | sse | - | ✅ | - | ✅ Valid |
| playwright-mcp | stdio | ✅ | - | ✅ | ✅ Valid |
| jina-mcp-tools | stdio | ✅ | - | ✅ | ✅ Valid |
| shadcn-ui | stdio | ✅ | - | ✅ | ✅ Valid |
| postgres-mcp | stdio | ✅ | - | ✅ | ✅ Valid |
| archon | stdio | ✅ | - | - | ✅ Valid |
| mem0 | url | - | ✅ | - | ⚠️ Missing type |
| perplexityai | url | - | ✅ | - | ⚠️ Missing type |
| composio_search | url | - | ✅ | - | ⚠️ Missing type |
| codeinterpreter | url | - | ✅ | - | ⚠️ Missing type |

## Recommended Configuration Updates

### 1. Fix URL Service Types
```json
{
  "mem0": {
    "url": "https://mcp.composio.dev/mem0/abandoned-creamy-horse-Y39-hm?agent=cursor",
    "type": "url"
  },
  "perplexityai": {
    "url": "https://mcp.composio.dev/perplexityai/abandoned-creamy-horse-Y39-hm?agent=cursor",
    "type": "url"
  },
  "composio_search": {
    "url": "https://mcp.composio.dev/composio_search/abandoned-creamy-horse-Y39-hm?agent=cursor",
    "type": "url"
  },
  "codeinterpreter": {
    "url": "https://mcp.composio.dev/codeinterpreter/abandoned-creamy-horse-Y39-hm?agent=cursor",
    "type": "url"
  }
}
```

### 2. Environment Variables Template
Create `.env.example` with required variables:
```bash
# Database Configuration
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
DATABASE_URI=postgresql://username:password@host:port/database

# AI Service API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key_here
JINA_API_KEY=your_jina_api_key_here

# Optional: Development overrides
NODE_ENV=development
MCP_DEBUG=true
```

## Security Validation

### 1. Credential Security
- ✅ No hardcoded credentials in configuration
- ✅ Environment variable references properly formatted
- ✅ Sensitive data isolated in environment

### 2. Access Control
- ✅ autoApprove lists limit automated operations
- ✅ disabled flags allow service control
- ✅ timeout limits prevent resource exhaustion

### 3. Network Security
- ✅ HTTPS URLs for external services
- ✅ Localhost URLs for internal services
- ⚠️ Consider adding SSL verification flags

## Performance Validation

### 1. Timeout Configuration
- Most services: 60 seconds (appropriate)
- RAG service: 120 seconds (appropriate for AI operations)
- Recommendation: Add shorter timeouts for simple operations

### 2. Resource Management
- ✅ Services can be individually disabled
- ✅ Separate processes prevent interference
- ⚠️ Consider adding memory limits

## Deployment Validation

### Development Environment
```json
{
  "disabled": true,  // Disable expensive services in dev
  "timeout": 30      // Shorter timeouts for faster feedback
}
```

### Production Environment
```json
{
  "disabled": false, // Enable all required services
  "timeout": 60      // Standard timeouts for reliability
}
```

## Validation Checklist

- [x] All stdio servers have command field
- [x] All url/sse servers have url field
- [ ] All servers have type field specified
- [x] Environment variables properly referenced
- [x] No hardcoded credentials
- [x] Reasonable timeout values
- [x] Security controls in place
- [x] Services can be individually controlled

## Next Steps

1. Apply missing type fields to URL services
2. Validate all environment variables are available
3. Test configuration loading and parsing
4. Implement runtime validation checks
5. Add configuration schema documentation