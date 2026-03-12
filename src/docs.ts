export const docsHtml = (baseUrl: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>YC API — Documentation</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #141414; --border: #232323; --border-hover: #333;
    --text: #e5e5e5; --text-muted: #888; --accent: #f26522; --accent-dim: #f2652220;
    --green: #22c55e; --blue: #3b82f6; --purple: #a855f7; --yellow: #eab308;
    --mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --radius: 10px;
  }
  body { font-family: var(--sans); background: var(--bg); color: var(--text); line-height: 1.6; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  .container { max-width: 860px; margin: 0 auto; padding: 48px 24px 96px; }

  header { margin-bottom: 48px; }
  header h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; }
  header h1 span { color: var(--accent); }
  header p { color: var(--text-muted); font-size: 16px; max-width: 520px; }
  .badge-row { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
  .badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--text-muted); }

  .base-url { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; font-family: var(--mono); font-size: 14px; margin-bottom: 40px; display: flex; align-items: center; gap: 10px; }
  .base-url .label { color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .base-url code { color: var(--accent); }

  .section { margin-bottom: 48px; }
  .section-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 16px; }

  .endpoint { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 16px; overflow: hidden; transition: border-color 0.15s; }
  .endpoint:hover { border-color: var(--border-hover); }
  .endpoint-header { padding: 16px 20px; cursor: pointer; display: flex; align-items: center; gap: 12px; user-select: none; }
  .endpoint-header:hover { background: #1a1a1a; }
  .method { font-family: var(--mono); font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 4px; }
  .method-get { background: #22c55e18; color: var(--green); }
  .endpoint-path { font-family: var(--mono); font-size: 14px; color: var(--text); }
  .endpoint-path .param { color: var(--purple); }
  .endpoint-desc { color: var(--text-muted); font-size: 13px; margin-left: auto; }
  .endpoint-chevron { color: var(--text-muted); font-size: 18px; transition: transform 0.2s; margin-left: 8px; }
  .endpoint.open .endpoint-chevron { transform: rotate(90deg); }
  .endpoint-body { display: none; border-top: 1px solid var(--border); padding: 20px; }
  .endpoint.open .endpoint-body { display: block; }

  .param-section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin: 20px 0 10px; }
  .param-section-title:first-child { margin-top: 0; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; font-weight: 600; color: var(--text-muted); padding: 8px 12px; border-bottom: 1px solid var(--border); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
  td:first-child { font-family: var(--mono); font-size: 13px; color: var(--accent); white-space: nowrap; }
  .type { font-family: var(--mono); font-size: 12px; color: var(--blue); }
  .param-desc { color: var(--text-muted); }
  .default { color: var(--yellow); font-family: var(--mono); font-size: 12px; }

  pre { background: #0d0d0d; border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; font-size: 13px; line-height: 1.5; margin: 12px 0; }
  code { font-family: var(--mono); }
  pre code { color: var(--text-muted); }
  .code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; margin-top: 16px; }

  .try-it { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
  .try-it label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
  .try-row { display: flex; gap: 8px; }
  .try-input { flex: 1; background: #0d0d0d; border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; font-family: var(--mono); font-size: 13px; color: var(--text); outline: none; }
  .try-input:focus { border-color: var(--accent); }
  .try-btn { background: var(--accent); color: #fff; border: none; border-radius: 6px; padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .try-btn:hover { opacity: 0.9; }
  .try-output { margin-top: 12px; background: #0d0d0d; border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-family: var(--mono); font-size: 12px; color: var(--text-muted); max-height: 400px; overflow: auto; display: none; white-space: pre-wrap; word-break: break-all; }
  .try-output.visible { display: block; }

  .filters-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
  @media (max-width: 600px) { .filters-grid { grid-template-columns: 1fr; } }
  .filter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; }
  .filter-card h4 { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
  .filter-card p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
  .filter-values { font-family: var(--mono); font-size: 11px; color: var(--text-muted); }

  .mcp-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
  .mcp-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .mcp-section p { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }

  footer { margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 13px; display: flex; justify-content: space-between; }
</style>
</head>
<body>
<div class="container">
  <header>
    <h1><span>YC</span> API</h1>
    <p>Unofficial REST API for Y Combinator's company directory. Search 5,700+ companies, filter by batch, industry, and tags, and get founder details with LinkedIn profiles.</p>
    <div class="badge-row">
      <span class="badge">REST</span>
      <span class="badge">MCP</span>
      <span class="badge">Free</span>
      <span class="badge">No auth required</span>
    </div>
  </header>

  <div class="base-url">
    <div>
      <div class="label">Base URL</div>
      <code>${baseUrl}</code>
    </div>
  </div>

  <!-- ENDPOINTS -->
  <div class="section">
    <div class="section-title">Endpoints</div>

    <!-- GET /companies -->
    <div class="endpoint open" id="ep-companies">
      <div class="endpoint-header" onclick="toggle('ep-companies')">
        <span class="method method-get">GET</span>
        <span class="endpoint-path">/companies</span>
        <span class="endpoint-desc">Search & filter companies</span>
        <span class="endpoint-chevron">&#x203A;</span>
      </div>
      <div class="endpoint-body">
        <div class="param-section-title">Query Parameters</div>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>q</td><td><span class="type">string</span></td><td class="param-desc">Full-text search &mdash; <code>q=ai</code></td></tr>
            <tr><td>batch</td><td><span class="type">string</span></td><td class="param-desc">Comma-separated batches &mdash; <code>Winter 2026,Summer 2025</code></td></tr>
            <tr><td>industry</td><td><span class="type">string</span></td><td class="param-desc">Comma-separated industries &mdash; <code>B2B,Healthcare</code></td></tr>
            <tr><td>tag</td><td><span class="type">string</span></td><td class="param-desc">Comma-separated tags &mdash; <code>Artificial Intelligence,SaaS</code></td></tr>
            <tr><td>region</td><td><span class="type">string</span></td><td class="param-desc">Comma-separated regions &mdash; <code>United States of America</code></td></tr>
            <tr><td>status</td><td><span class="type">string</span></td><td class="param-desc"><code>Active</code> <code>Inactive</code> <code>Acquired</code> <code>Public</code></td></tr>
            <tr><td>is_hiring</td><td><span class="type">boolean</span></td><td class="param-desc">Filter by hiring status</td></tr>
            <tr><td>top_company</td><td><span class="type">boolean</span></td><td class="param-desc">YC top companies only</td></tr>
            <tr><td>sort</td><td><span class="type">string</span></td><td class="param-desc"><code>relevance</code> (default) or <code>launch_date</code></td></tr>
            <tr><td>page</td><td><span class="type">number</span></td><td class="param-desc">0-indexed page &mdash; <span class="default">default 0</span></td></tr>
            <tr><td>limit</td><td><span class="type">number</span></td><td class="param-desc">Results per page, max 1000 &mdash; <span class="default">default 20</span></td></tr>
          </tbody>
        </table>

        <div class="code-label">Example request</div>
        <pre><code>curl "${baseUrl}/companies?batch=Winter%202026&amp;industry=B2B&amp;limit=3"</code></pre>

        <div class="code-label">Response</div>
        <pre><code>{
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
      "batch": "Winter 2026",
      "status": "Active",
      "stage": "Early",
      "industries": ["B2B", "Engineering, Product and Design"],
      "tags": ["Artificial Intelligence", "Developer Tools"],
      "team_size": 4,
      "is_hiring": false,
      "top_company": false
    }
  ],
  "totalCount": 199,
  "page": 0,
  "totalPages": 10,
  "perPage": 20
}</code></pre>

        <div class="try-it">
          <label>Try it</label>
          <div class="try-row">
            <input class="try-input" id="try-companies" value="/companies?batch=Winter 2026&limit=3" />
            <button class="try-btn" onclick="tryIt('try-companies', 'out-companies')">Send</button>
          </div>
          <div class="try-output" id="out-companies"></div>
        </div>
      </div>
    </div>

    <!-- GET /companies/:slug -->
    <div class="endpoint" id="ep-slug">
      <div class="endpoint-header" onclick="toggle('ep-slug')">
        <span class="method method-get">GET</span>
        <span class="endpoint-path">/companies/<span class="param">:slug</span></span>
        <span class="endpoint-desc">Company detail + founders</span>
        <span class="endpoint-chevron">&#x203A;</span>
      </div>
      <div class="endpoint-body">
        <div class="param-section-title">Path Parameters</div>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>slug</td><td><span class="type">string</span></td><td class="param-desc">Company slug from the YC URL &mdash; <code>airbnb</code>, <code>canary</code>, <code>openai</code></td></tr>
          </tbody>
        </table>

        <div class="code-label">Example request</div>
        <pre><code>curl "${baseUrl}/companies/canary"</code></pre>

        <div class="code-label">Response</div>
        <pre><code>{
  "company": {
    "id": 31256,
    "name": "Canary",
    "slug": "canary",
    "url": "https://www.ycombinator.com/companies/canary",
    "website": "https://www.runcanary.ai",
    "location": "San Francisco, CA, USA",
    "one_liner": "The first AI QA engineer that understands your codebase",
    "long_description": "AI coding tools have made developers 100x faster...",
    "batch": "Winter 2026",
    "industries": ["B2B", "Engineering, Product and Design"],
    "founders": [
      {
        "name": "Aakash Mahalingam",
        "title": "Founder",
        "bio": "Building Canary. Ex-Windsurf",
        "avatar_url": "https://bookface-images.s3.us-west-2.amazonaws.com/avatars/...",
        "linkedin_url": "https://linkedin.com/in/aakashmahalingam",
        "twitter_url": "https://x.com/Aakash_Mahali"
      }
    ]
  }
}</code></pre>

        <div class="try-it">
          <label>Try it</label>
          <div class="try-row">
            <input class="try-input" id="try-slug" value="/companies/canary" />
            <button class="try-btn" onclick="tryIt('try-slug', 'out-slug')">Send</button>
          </div>
          <div class="try-output" id="out-slug"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- FILTERS -->
  <div class="section">
    <div class="section-title">Available Filter Values</div>
    <div class="filters-grid">
      <div class="filter-card">
        <h4>Batches</h4>
        <p class="filter-values">Summer 2026, Spring 2026, Winter 2026, Fall 2025, Summer 2025, Spring 2025, Winter 2025, Fall 2024, Summer 2024, Winter 2024, Summer 2023, Winter 2023 &hellip; back to Summer 2005</p>
      </div>
      <div class="filter-card">
        <h4>Industries</h4>
        <p class="filter-values">B2B, Consumer, Healthcare, Fintech, Engineering Product and Design, Industrials, Infrastructure, Real Estate and Construction, Government, Education</p>
      </div>
      <div class="filter-card">
        <h4>Tags</h4>
        <p class="filter-values">Artificial Intelligence, SaaS, Developer Tools, Fintech, Machine Learning, Marketplace, API, Health Tech, Climate, Open Source, Security, Robotics, Biotech, Crypto / Web3 &hellip;</p>
      </div>
      <div class="filter-card">
        <h4>Status</h4>
        <p class="filter-values">Active (3,975) &middot; Inactive (1,016) &middot; Acquired (750) &middot; Public (23)</p>
      </div>
      <div class="filter-card">
        <h4>Regions</h4>
        <p class="filter-values">United States of America, America / Canada, India, United Kingdom, Remote, Fully Remote, Europe, South America, Southeast Asia, Africa &hellip;</p>
      </div>
      <div class="filter-card">
        <h4>Sort</h4>
        <p class="filter-values"><code>relevance</code> &mdash; best match first (default)<br><code>launch_date</code> &mdash; newest launches first</p>
      </div>
    </div>
  </div>

  <!-- MCP -->
  <div class="section">
    <div class="section-title">MCP Server</div>
    <div class="mcp-section">
      <h3>Connect to Claude Code, Cursor, or any MCP client</h3>
      <p>Two tools available: <code>search_yc_companies</code> and <code>get_yc_company</code></p>

      <div class="code-label">Claude Code</div>
      <pre><code>claude mcp add yc-api -- bun run /path/to/accelerator-api/src/mcp.ts</code></pre>

      <div class="code-label">Cursor / other clients</div>
      <pre><code>{
  "mcpServers": {
    "yc-api": {
      "command": "bun",
      "args": ["run", "/path/to/accelerator-api/src/mcp.ts"]
    }
  }
}</code></pre>
    </div>
  </div>

  <footer>
    <span>Built by <a href="https://github.com/arjanssuri">arjanssuri</a></span>
    <a href="https://github.com/arjanssuri/accelerator-api">GitHub</a>
  </footer>
</div>

<script>
function toggle(id) {
  document.getElementById(id).classList.toggle('open');
}
async function tryIt(inputId, outputId) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  output.classList.add('visible');
  output.textContent = 'Loading...';
  try {
    const path = input.value.startsWith('/') ? input.value : '/' + input.value;
    const res = await fetch('${baseUrl}' + path);
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    output.textContent = 'Error: ' + e.message;
  }
}
</script>
</body>
</html>`;
