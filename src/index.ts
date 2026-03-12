import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  searchCompanies,
  getCompanyBySlug,
  type SortBy,
  type Company,
} from "./algolia.ts";
import { scrapeFounders } from "./scraper.ts";
import { docsHtml } from "./docs.ts";

const app = new Hono();

app.use("*", cors());

function getBaseUrl(c: { req: { header: (name: string) => string | undefined; url: string } }) {
  const proto = c.req.header("x-forwarded-proto") ?? "http";
  const host = c.req.header("x-forwarded-host") ?? c.req.header("host");
  if (host) return `${proto}://${host}`;
  return new URL(c.req.url).origin;
}

function cleanCompany(c: Company) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    url: `https://www.ycombinator.com/companies/${c.slug}`,
    former_names: c.former_names,
    logo: c.small_logo_thumb_url,
    website: c.website,
    location: c.all_locations,
    one_liner: c.one_liner,
    long_description: c.long_description,
    batch: c.batch,
    status: c.status,
    stage: c.stage,
    industry: c.industry,
    industries: c.industries,
    tags: c.tags,
    team_size: c.team_size,
    regions: c.regions,
    is_hiring: c.isHiring,
    top_company: c.top_company,
    nonprofit: c.nonprofit,
    launched_at: c.launched_at,
  };
}

// API info
app.get("/", (c) => {
  const base = getBaseUrl(c);
  return c.json({
    name: "yc-api",
    version: "1.0.0",
    docs: `${base}/docs`,
    endpoints: {
      "GET /companies": "Search & filter YC companies",
      "GET /companies/:slug":
        "Get a specific company by slug (includes founders)",
    },
  });
});

// Interactive docs
app.get("/docs", (c) => {
  const base = getBaseUrl(c);
  return c.html(docsHtml(base));
});

// Search / list companies
app.get("/companies", async (c) => {
  const batches = c.req.query("batch")?.split(",") ?? [];
  const industries = c.req.query("industry")?.split(",") ?? [];
  const regions = c.req.query("region")?.split(",") ?? [];
  const tags = c.req.query("tag")?.split(",") ?? [];
  const status = c.req.query("status")?.split(",") ?? [];

  const page = parseInt(c.req.query("page") ?? "0", 10);
  const limit = Math.min(parseInt(c.req.query("limit") ?? "20", 10), 1000);
  const query = c.req.query("q") ?? "";
  const sortBy = (c.req.query("sort") ?? "relevance") as SortBy;

  const isHiringParam = c.req.query("is_hiring");
  const isHiring =
    isHiringParam !== undefined ? isHiringParam === "true" : undefined;

  const topCompanyParam = c.req.query("top_company");
  const topCompany =
    topCompanyParam !== undefined ? topCompanyParam === "true" : undefined;

  const result = await searchCompanies({
    query,
    page,
    hitsPerPage: limit,
    batches: batches.filter(Boolean),
    industries: industries.filter(Boolean),
    regions: regions.filter(Boolean),
    tags: tags.filter(Boolean),
    status: status.filter(Boolean),
    isHiring,
    topCompany,
    sortBy,
  });

  return c.json({
    companies: result.hits.map(cleanCompany),
    totalCount: result.nbHits,
    page: result.page,
    totalPages: result.nbPages,
    perPage: result.hitsPerPage,
  });
});

// Get single company by slug (includes founders scraped from YC page)
app.get("/companies/:slug", async (c) => {
  const slug = c.req.param("slug");

  const [company, founders] = await Promise.all([
    getCompanyBySlug(slug),
    scrapeFounders(slug),
  ]);

  if (!company) {
    return c.json({ error: "Company not found" }, 404);
  }

  return c.json({ company: { ...cleanCompany(company), founders } });
});

export default {
  port: parseInt(process.env.PORT ?? "3000", 10),
  fetch: app.fetch,
};
