# Jina.ai Web Scraper Task

## Purpose

To scrape technical documentation and code examples from the web using Jina.ai based on a given query. This task is designed to be called by other tasks, such as `create-next-story`, to enrich development stories with relevant, up-to-date technical context.

## Task Execution

### 1. Receive Query

- This task expects a `query` string as input. The query should be a specific question or a set of keywords related to a technology, library, or API.

### 2. Identify Official Documentation URLs

- Before executing the search, the task will identify the official documentation URLs for the technologies mentioned in the query.
- This can be done by maintaining a list of official domains or by performing a preliminary search to find the official documentation sites.

### 3. Execute Jina.ai Scraping

- Use the `use_mcp_tool` to call the Jina.ai `search` tool.
- The `query` will be modified to include the `site:` operator, restricting the search to the official documentation URLs. For example: `site:nextjs.org how to use app router`
- The `detail_level` will be set to `detailed` to get comprehensive information.

### 3. Process and Return Results

- The result from the Jina.ai tool will be a JSON object containing the scraped content and source URLs.
- The task will parse this JSON object and return the structured data to the calling task.
- The returned data should include:
  - `source`: The URL of the scraped page.
  - `content`: The relevant content, including code snippets and explanations.

## Example Usage

This task would be called from another task like this:

```
- Execute task `.bmad-core/tasks/jina-ai-scraper` with query: "How to use React hooks with TypeScript"
