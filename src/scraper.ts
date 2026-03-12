import { parse } from "node-html-parser";

export interface Founder {
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  linkedin_url: string | null;
  twitter_url: string | null;
}

export async function scrapeFounders(slug: string): Promise<Founder[]> {
  const url = `https://www.ycombinator.com/companies/${slug}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });

  if (!res.ok) return [];

  const html = await res.text();
  const root = parse(html);

  const founders: Founder[] = [];

  // Each founder is in a .ycdc-card-new inside the Active Founders section
  // Desktop layout: .hidden.gap-4.md:flex has the full card
  const cards = root.querySelectorAll(".ycdc-card-new .hidden.gap-4");

  for (const card of cards) {
    const img = card.querySelector("img");
    const name = img?.getAttribute("alt")?.trim() ?? "";
    if (!name) continue;

    // Strip S3 signed URL params to get a stable avatar URL
    const rawSrc = img?.getAttribute("src") ?? "";
    const avatar_url = rawSrc.split("?")[0] ?? "";

    // Name is in .text-xl.font-bold, title in .text-gray-600
    const title =
      card.querySelector(".text-gray-600")?.text.trim() ?? "";

    // Bio is in .prose .whitespace-pre-line
    const bio =
      card.querySelector(".whitespace-pre-line")?.text.trim() ?? "";

    // Social links
    let linkedin_url: string | null = null;
    let twitter_url: string | null = null;

    for (const link of card.querySelectorAll("a")) {
      const href = link.getAttribute("href") ?? "";
      if (href.includes("linkedin.com")) linkedin_url = href;
      else if (href.includes("x.com") || href.includes("twitter.com"))
        twitter_url = href;
    }

    founders.push({ name, title, bio, avatar_url, linkedin_url, twitter_url });
  }

  return founders;
}
