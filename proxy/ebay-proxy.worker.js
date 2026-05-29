// ============================================================
// PART_VAULT — eBay Browse API proxy (Cloudflare Worker version)
// ============================================================
// Use this when PART_VAULT is hosted publicly (not localhost). It keeps
// your eBay secret server-side, does OAuth, runs the Browse search, and
// returns simplified price stats with CORS headers.
//
// Deploy:
//   1. npm i -g wrangler   (or use the Cloudflare dashboard editor)
//   2. wrangler init ebay-proxy   (paste this as src/index.js)
//   3. wrangler secret put EBAY_CLIENT_ID
//      wrangler secret put EBAY_CLIENT_SECRET
//      (optional) set ALLOW_ORIGIN var to your site origin instead of "*"
//   4. wrangler deploy
//
// Then set the Worker URL as the eBay Proxy URL in PART_VAULT settings.
// ============================================================

let cachedToken = null; // { token, exp }

async function getToken(env) {
  const now = Date.now();
  if (cachedToken && cachedToken.exp > now + 60000) return cachedToken.token;
  const creds = btoa(`${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`);
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=' + encodeURIComponent('https://api.ebay.com/oauth/api_scope')
  });
  if (!res.ok) throw new Error(`oauth ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, exp: now + (data.expires_in || 7200) * 1000 };
  return cachedToken.token;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function priceStats(prices) {
  if (!prices.length) return { count: 0 };
  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const avg = sorted.reduce((s, v) => s + v, 0) / n;
  return { count: n, min: sorted[0], max: sorted[n - 1], median: +median.toFixed(2), avg: +avg.toFixed(2) };
}

function jsonResponse(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
  });
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || '*';
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });

    const url = new URL(request.url);
    if (url.pathname !== '/price') {
      return jsonResponse({ ok: true, usage: '/price?q=<part name>&marketplace=EBAY_US&limit=25' }, 200, origin);
    }

    const q = url.searchParams.get('q');
    if (!q) return jsonResponse({ error: 'missing q' }, 400, origin);
    const marketplace = url.searchParams.get('marketplace') || 'EBAY_US';
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 25, 50);

    try {
      const token = await getToken(env);
      const api = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=${limit}`;
      const res = await fetch(api, {
        headers: { 'Authorization': `Bearer ${token}`, 'X-EBAY-C-MARKETPLACE-ID': marketplace }
      });
      if (!res.ok) return jsonResponse({ error: `ebay ${res.status}`, detail: (await res.text()).slice(0, 200) }, 502, origin);
      const data = await res.json();
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
      return jsonResponse({ query: q, marketplace, currency, ...priceStats(prices), samples }, 200, origin);
    } catch (e) {
      return jsonResponse({ error: String((e && e.message) || e) }, 500, origin);
    }
  }
};
