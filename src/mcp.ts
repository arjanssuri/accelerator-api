import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchCompanies, getCompanyBySlug } from "./algolia.ts";
import { scrapeFounders } from "./scraper.ts";

const server = new McpServer({
  name: "yc-api",
  version: "1.0.0",
});

server.tool(
  "search_yc_companies",
  "Search and filter Y Combinator companies. Returns company name, batch, industry, location, description, website, team size, and more.",
  {
    query: z.string().optional().describe("Text search query"),
    batch: z
      .string()
      .optional()
      .describe(
        "Comma-separated YC batches, e.g. 'Winter 2026,Summer 2025'"
      ),
    industry: z
      .string()
      .optional()
      .describe(
        "Comma-separated industries, e.g. 'B2B,Healthcare'"
      ),
    region: z
      .string()
      .optional()
      .describe("Comma-separated regions, e.g. 'United States of America'"),
    tag: z
      .string()
      .optional()
      .describe("Comma-separated tags, e.g. 'Artificial Intelligence,SaaS'"),
    status: z
      .string()
      .optional()
      .describe("Comma-separated statuses: Active, Inactive, Acquired, Public"),
    is_hiring: z.boolean().optional().describe("Filter by hiring status"),
    top_company: z.boolean().optional().describe("Filter to YC top companies only"),
    sort: z
      .enum(["relevance", "launch_date"])
      .optional()
      .describe("Sort order: relevance (default) or launch_date"),
    page: z.number().optional().describe("Page number (0-indexed)"),
    limit: z
      .number()
      .optional()
      .describe("Results per page (max 1000, default 20)"),
  },
  async (params) => {
    const result = await searchCompanies({
      query: params.query,
      page: params.page ?? 0,
      hitsPerPage: Math.min(params.limit ?? 20, 1000),
      batches: params.batch?.split(",").filter(Boolean) ?? [],
      industries: params.industry?.split(",").filter(Boolean) ?? [],
      regions: params.region?.split(",").filter(Boolean) ?? [],
      tags: params.tag?.split(",").filter(Boolean) ?? [],
      status: params.status?.split(",").filter(Boolean) ?? [],
      isHiring: params.is_hiring,
      topCompany: params.top_company,
      sortBy: params.sort,
    });

    const companies = result.hits.map((c) => ({
      name: c.name,
      slug: c.slug,
      url: `https://www.ycombinator.com/companies/${c.slug}`,
      batch: c.batch,
      one_liner: c.one_liner,
      website: c.website,
      all_locations: c.all_locations,
      team_size: c.team_size,
      industries: c.industries,
      tags: c.tags,
      status: c.status,
      stage: c.stage,
      isHiring: c.isHiring,
      logo: c.small_logo_thumb_url,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              totalCount: result.nbHits,
              page: result.page,
              totalPages: result.nbPages,
              companies,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

server.tool(
  "get_yc_company",
  "Get detailed info about a specific YC company by slug, including founder names, bios, LinkedIn URLs, and Twitter/X handles.",
  {
    slug: z
      .string()
      .describe(
        "Company slug from the YC URL, e.g. 'airbnb' or 'openai'"
      ),
  },
  async ({ slug }) => {
    const [company, founders] = await Promise.all([
      getCompanyBySlug(slug),
      scrapeFounders(slug),
    ]);

    if (!company) {
      return {
        content: [
          { type: "text" as const, text: `Company "${slug}" not found.` },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              name: company.name,
              slug: company.slug,
              url: `https://www.ycombinator.com/companies/${company.slug}`,
              batch: company.batch,
              status: company.status,
              one_liner: company.one_liner,
              long_description: company.long_description,
              website: company.website,
              all_locations: company.all_locations,
              team_size: company.team_size,
              industries: company.industries,
              tags: company.tags,
              stage: company.stage,
              isHiring: company.isHiring,
              logo: company.small_logo_thumb_url,
              founders,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
