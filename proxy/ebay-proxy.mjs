// ============================================================
// PART_VAULT — eBay Browse API proxy (local Node version)
// ============================================================
// Why a proxy? The browser can't call eBay directly (CORS), and your
// eBay client secret must never live in client-side code. This tiny
// server holds the secret, does the OAuth handshake, runs the Browse
// search, and returns simplified price stats with CORS headers so the
// PART_VAULT page can fetch them.
//
// Requires Node 18+ (uses the built-in global fetch).
//
// Run it (PowerShell):
//   $env:EBAY_CLIENT_ID="your-app-id"
//   $env:EBAY_CLIENT_SECRET="your-cert-id"
//   node proxy/ebay-proxy.mjs
//
// Run it (bash):
//   EBAY_CLIENT_ID=... EBAY_CLIENT_SECRET=... node proxy/ebay-proxy.mjs
//
// Then in PART_VAULT → [ ⚙ SETTINGS ] set eBay Proxy URL to:
//   http://localhost:8787
//
// Env vars:
//   EBAY_CLIENT_ID      (required) eBay App ID  / Client ID
//   EBAY_CLIENT_SECRET  (required) eBay Cert ID / Client Secret
//   PORT                (optional) default 8787
//   ALLOW_ORIGIN        (optional) CORS origin, default "*"
//   EBAY_ENV            (optional) "production" (default) or "sandbox"
// ============================================================

import http from 'node:http';

const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.ALLOW_ORIGIN || '*';
const CLIENT_ID = process.env.EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const EBAY_ENV = (process.env.EBAY_ENV || 'production').toLowerCase();
const BASE = EBAY_ENV === 'sandbox' ? 'https://api.sandbox.ebay.com' : 'https://api.ebay.com';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('✗ Set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET environment variables first.');
  process.exit(1);
}

// --- OAuth token (client credentials), cached until ~1 min before expiry ---
let cached = null;
async function getToken() {
  const now = Date.now();
  if (cached && cached.exp > now + 60000) return cached.token;
  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${BASE}/identity/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope')
  });
  if (!res.ok) throw new Error(`oauth ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  cached = { token: data.access_token, exp: now + (data.expires_in || 7200) * 1000 };
  return cached.token;
}

function priceStats(prices) {
  if (!prices.length) return { count: 0 };
  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const avg = sorted.reduce((s, v) => s + v, 0) / n;
  return { count: n, min: sorted[0], max: sorted[n - 1], median: +median.toFixed(2), avg: +avg.toFixed(2) };
}

const server = http.createServer(async (req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  const send = (obj, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json', ...cors });
    res.end(JSON.stringify(obj));
  };

  if (req.method === 'OPTIONS') { res.writeHead(204, cors); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/price') {
    send({ ok: true, usage: '/price?q=<part name>&marketplace=EBAY_US&limit=25' });
    return;
  }

  const q = url.searchParams.get('q');
  if (!q) { send({ error: 'missing q' }, 400); return; }
  const marketplace = url.searchParams.get('marketplace') || 'EBAY_US';
  const limit = Math.min(parseInt(url.searchParams.get('limit')) || 25, 50);

  try {
    const token = await getToken();
    const api = `${BASE}/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=${limit}`;
    const r = await fetch(api, {
      headers: { 'Authorization': `Bearer ${token}`, 'X-EBAY-C-MARKETPLACE-ID': marketplace }
    });
    if (!r.ok) { send({ error: `ebay ${r.status}`, detail: (await r.text()).slice(0, 200) }, 502); return; }
    const data = await r.json();
    const items = data.itemSummaries || [];
    const prices = items.map(i => parseFloat(i.price && i.price.value)).filter(v => !isNaN(v));
    const currency = (items[0] && items[0].price && items[0].price.currency) || 'USD';
    const samples = items.slice(0, 5).map(i => ({
      title: i.title,
      price: i.price ? parseFloat(i.price.value) : null,
      condition: i.condition || '',
      url: i.itemWebUrl || ''
    }));
    // NOTE: Browse returns ACTIVE listings (asking prices), not sold comps.
    send({ query: q, marketplace, currency, ...priceStats(prices), samples });
  } catch (e) {
    send({ error: String((e && e.message) || e) }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`PART_VAULT eBay proxy → http://localhost:${PORT}  (env: ${EBAY_ENV})`);
  console.log(`Set this URL as the eBay Proxy URL in PART_VAULT settings.`);
});
