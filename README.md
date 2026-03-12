# accelerator-api

Unofficial REST API and MCP server for querying Y Combinator's company directory. Search 5,700+ companies by batch, industry, tags, and more — with founder details including LinkedIn and Twitter profiles.

**Base URL:** `https://yc-api-arjanssuri.zocomputer.io`

## Endpoints

### `GET /companies`

Search and filter YC companies.

```
GET /companies?batch=Winter 2026&industry=B2B&limit=3
```

#### Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Full-text search (e.g. `q=ai`) |
| `batch` | string | Comma-separated batches (e.g. `Winter 2026,Summer 2025`) |
| `industry` | string | Comma-separated industries (e.g. `B2B,Healthcare`) |
| `tag` | string | Comma-separated tags (e.g. `Artificial Intelligence,SaaS`) |
| `region` | string | Comma-separated regions (e.g. `United States of America`) |
| `status` | string | `Active`, `Inactive`, `Acquired`, or `Public` |
| `is_hiring` | boolean | Filter by hiring status |
| `top_company` | boolean | Filter to YC top companies only |
| `sort` | string | `relevance` (default) or `launch_date` |
| `page` | number | Page number, 0-indexed (default `0`) |
| `limit` | number | Results per page, max 1000 (default `20`) |

#### Response

```json
{
  "companies": [
    {
      "id": 31256,
      "name": "Canary",
      "slug": "canary",
      "url": "https://www.ycombinator.com/companies/canary",
      "logo": "https://bookface-images.s3.amazonaws.com/small_logos/...",
      "website": "https://www.runcanary.ai",
      "location": "San Francisco, CA, USA",
      "one_liner": "The first AI QA engineer that understands your codebase",
      "long_description": "AI coding tools have made developers 100x faster...",
      "batch": "Winter 2026",
      "status": "Active",
      "stage": "Early",
      "industry": "B2B",
      "industries": ["B2B", "Engineering, Product and Design"],
      "tags": ["Artificial Intelligence", "Developer Tools", "SaaS", "B2B"],
      "team_size": 4,
      "regions": ["United States of America", "America / Canada"],
      "is_hiring": false,
      "top_company": false,
      "nonprofit": false,
      "launched_at": 1770954754
    }
  ],
  "totalCount": 199,
  "page": 0,
  "totalPages": 10,
  "perPage": 20
}
```

---

### `GET /companies/:slug`

Get detailed info for a single company, including founders with LinkedIn and Twitter.

```
GET /companies/canary
```

#### Response

```json
{
  "company": {
    "id": 31256,
    "name": "Canary",
    "slug": "canary",
    "url": "https://www.ycombinator.com/companies/canary",
    "logo": "https://bookface-images.s3.amazonaws.com/small_logos/...",
    "website": "https://www.runcanary.ai",
    "location": "San Francisco, CA, USA",
    "one_liner": "The first AI QA engineer that understands your codebase",
    "long_description": "...",
    "batch": "Winter 2026",
    "status": "Active",
    "stage": "Early",
    "industry": "B2B",
    "industries": ["B2B", "Engineering, Product and Design"],
    "tags": ["Artificial Intelligence", "Developer Tools", "SaaS", "B2B"],
    "team_size": 4,
    "regions": ["United States of America", "America / Canada"],
    "is_hiring": false,
    "top_company": false,
    "nonprofit": false,
    "launched_at": 1770954754,
    "founders": [
      {
        "name": "Aakash Mahalingam",
        "title": "Founder",
        "bio": "Building Canary: AI QA Engineer that understands your codebase. Ex-Windsurf",
        "avatar_url": "https://bookface-images.s3.us-west-2.amazonaws.com/avatars/...",
        "linkedin_url": "https://linkedin.com/in/aakashmahalingam",
        "twitter_url": "https://x.com/Aakash_Mahali"
      },
      {
        "name": "Viswesh N G",
        "title": "Founder",
        "bio": "Co-founding Canary with a team of ex-Windsurf, Cognition and Google engineers...",
        "avatar_url": "https://bookface-images.s3.us-west-2.amazonaws.com/avatars/...",
        "linkedin_url": "https://www.linkedin.com/in/visweshng/",
        "twitter_url": "https://x.com/g_viswesh"
      }
    ]
  }
}
```

---

## Examples

**Search for AI companies in the latest batch:**
```bash
curl "https://yc-api-arjanssuri.zocomputer.io/companies?q=ai&batch=Winter 2026"
```

**Get all top companies:**
```bash
curl "https://yc-api-arjanssuri.zocomputer.io/companies?top_company=true&limit=100"
```

**Find hiring companies in healthcare:**
```bash
curl "https://yc-api-arjanssuri.zocomputer.io/companies?industry=Healthcare&is_hiring=true"
```

**Get company details with founder LinkedIn:**
```bash
curl "https://yc-api-arjanssuri.zocomputer.io/companies/airbnb"
```

---

## Available filter values

<details>
<summary><strong>Batches</strong> (47 total)</summary>

`Summer 2026`, `Spring 2026`, `Winter 2026`, `Fall 2025`, `Summer 2025`, `Spring 2025`, `Winter 2025`, `Fall 2024`, `Summer 2024`, `Winter 2024`, `Summer 2023`, `Winter 2023`, `Summer 2022`, `Winter 2022`, `Summer 2021`, `Winter 2021`, `Summer 2020`, `Winter 2020`, `Summer 2019`, `Winter 2019`, `Summer 2018`, `Winter 2018`, `Summer 2017`, `Winter 2017`, `Summer 2016`, `Winter 2016`, `Summer 2015`, `Winter 2015`, `Summer 2014`, `Winter 2014`, `Summer 2013`, `Winter 2013`, `Summer 2012`, `Winter 2012`, `Summer 2011`, `Winter 2011`, `Summer 2010`, `Winter 2010`, `Summer 2009`, `Winter 2009`, `Summer 2008`, `Winter 2008`, `Summer 2007`, `Winter 2007`, `Summer 2006`, `Winter 2006`, `Summer 2005`

</details>

<details>
<summary><strong>Industries</strong> (59 total, top shown)</summary>

`B2B`, `Consumer`, `Healthcare`, `Fintech`, `Engineering, Product and Design`, `Industrials`, `Infrastructure`, `Real Estate and Construction`, `Government`, `Education`

</details>

<details>
<summary><strong>Tags</strong> (100+, top shown)</summary>

`Artificial Intelligence`, `SaaS`, `Developer Tools`, `Fintech`, `Machine Learning`, `Marketplace`, `API`, `Health Tech`, `Climate`, `Open Source`, `Security`, `E-Commerce`, `Logistics`, `Robotics`, `Biotech`, `Crypto / Web3`

</details>

<details>
<summary><strong>Status</strong></summary>

`Active`, `Inactive`, `Acquired`, `Public`

</details>

<details>
<summary><strong>Regions</strong> (top shown)</summary>

`United States of America`, `America / Canada`, `India`, `United Kingdom`, `Remote`, `Fully Remote`, `Europe`, `South America`, `Southeast Asia`, `Africa`

</details>

---

## MCP server

The API also ships as an MCP server for use with Claude Code, Cursor, and other MCP clients. Two tools are available:

- **`search_yc_companies`** — search and filter companies with all the parameters above
- **`get_yc_company`** — get full company details including founders by slug

### Setup with Claude Code

```bash
claude mcp add yc-api -- bun run /path/to/accelerator-api/src/mcp.ts
```

### Setup with Cursor / other clients

Add to your MCP config:

```json
{
  "mcpServers": {
    "yc-api": {
      "command": "bun",
      "args": ["run", "/path/to/accelerator-api/src/mcp.ts"]
    }
  }
}
```

---

## Run locally

```bash
bun install
bun run dev       # HTTP API on http://localhost:3000
bun run mcp       # MCP server (stdio)
```

## Tech stack

- [Bun](https://bun.sh) runtime
- [Hono](https://hono.dev) web framework
- [MCP SDK](https://modelcontextprotocol.io) for AI tool integration
- YC's Algolia search index for company data
- HTML scraping for founder profiles
