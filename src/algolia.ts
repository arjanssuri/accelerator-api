const ALGOLIA_APP_ID = "45BWZJ1SGC";
const ALGOLIA_API_KEY =
  "NzllNTY5MzJiZGM2OTY2ZTQwMDEzOTNhYWZiZGRjODlhYzVkNjBmOGRjNzJiMWM4ZTU0ZDlhYTZjOTJiMjlhMWFuYWx5dGljc1RhZ3M9eWNkYyZyZXN0cmljdEluZGljZXM9WUNDb21wYW55X3Byb2R1Y3Rpb24lMkNZQ0NvbXBhbnlfQnlfTGF1bmNoX0RhdGVfcHJvZHVjdGlvbiZ0YWdGaWx0ZXJzPSU1QiUyMnljZGNfcHVibGljJTIyJTVE";

const BASE_URL = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes`;

export type SortBy = "relevance" | "launch_date";

const INDEX_MAP: Record<SortBy, string> = {
  relevance: "YCCompany_production",
  launch_date: "YCCompany_By_Launch_Date_production",
};

export interface SearchParams {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  batches?: string[];
  industries?: string[];
  regions?: string[];
  tags?: string[];
  status?: string[];
  isHiring?: boolean;
  topCompany?: boolean;
  sortBy?: SortBy;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  former_names: string[];
  small_logo_thumb_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  industry: string;
  subindustry: string;
  industries: string[];
  batch: string;
  status: string;
  regions: string[];
  stage: string;
  tags: string[];
  top_company: boolean;
  isHiring: boolean;
  nonprofit: boolean;
  launched_at: number;
  objectID: string;
}

interface AlgoliaResponse {
  hits: Company[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}

function buildFacetFilters(params: SearchParams): string[][] {
  const filters: string[][] = [];

  if (params.batches?.length) {
    filters.push(params.batches.map((b) => `batch:${b}`));
  }
  if (params.industries?.length) {
    filters.push(params.industries.map((i) => `industries:${i}`));
  }
  if (params.regions?.length) {
    filters.push(params.regions.map((r) => `regions:${r}`));
  }
  if (params.tags?.length) {
    filters.push(params.tags.map((t) => `tags:${t}`));
  }
  if (params.status?.length) {
    filters.push(params.status.map((s) => `status:${s}`));
  }
  if (params.isHiring !== undefined) {
    filters.push([`isHiring:${params.isHiring}`]);
  }
  if (params.topCompany !== undefined) {
    filters.push([`top_company:${params.topCompany}`]);
  }

  return filters;
}

export async function searchCompanies(
  params: SearchParams
): Promise<AlgoliaResponse> {
  const index = INDEX_MAP[params.sortBy ?? "relevance"];
  const url = `${BASE_URL}/${index}/query`;

  const body = {
    query: params.query ?? "",
    hitsPerPage: params.hitsPerPage ?? 20,
    page: params.page ?? 0,
    facetFilters: buildFacetFilters(params),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Algolia-Application-Id": ALGOLIA_APP_ID,
      "X-Algolia-API-Key": ALGOLIA_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Algolia error: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<AlgoliaResponse>;
}

export async function getCompanyBySlug(
  slug: string
): Promise<Company | null> {
  const res = await searchCompanies({ query: slug, hitsPerPage: 10 });
  return res.hits.find((h) => h.slug === slug) ?? null;
}
