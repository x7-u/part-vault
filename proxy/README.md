# PART_VAULT — eBay price proxy

PART_VAULT can pull **real eBay prices** to fill the Market Value field and sanity-check AI estimates. eBay's API can't be called from the browser (CORS) and your eBay **secret must never live in client-side code**, so a tiny proxy sits in between:

```
PART_VAULT (browser)  ──►  this proxy (holds secret, does OAuth)  ──►  eBay Browse API
```

The browser only ever talks to the proxy. The proxy returns simplified price stats:

```json
{ "query": "rtx 4070", "currency": "USD", "count": 25,
  "min": 399.99, "max": 749.0, "median": 559.99, "avg": 565.12,
  "samples": [ { "title": "...", "price": 559.99, "condition": "Used", "url": "https://..." } ] }
```

> **Note:** the Browse API returns **active listings** (current asking prices), not sold comps. Median of active listings is a solid market estimate. True sold-price history needs eBay's Marketplace Insights API (requires separate approval).

---

## 1. Get eBay API credentials

1. Create a free account at the [eBay Developers Program](https://developer.ebay.com/).
2. Create a **production keyset**. You need the **App ID (Client ID)** and **Cert ID (Client Secret)**.
3. No user login / redirect is required — this proxy uses the **client-credentials** grant (application token), which only needs those two values.

---

## Option A — Local Node proxy (easiest, no cloud)

Best when you run PART_VAULT locally. Requires Node 18+.

```powershell
# PowerShell
$env:EBAY_CLIENT_ID="your-app-id"
$env:EBAY_CLIENT_SECRET="your-cert-id"
node proxy/ebay-proxy.mjs
```

```bash
# bash
EBAY_CLIENT_ID=your-app-id EBAY_CLIENT_SECRET=your-cert-id node proxy/ebay-proxy.mjs
```

It listens on `http://localhost:8787`. In PART_VAULT → **[ ⚙ SETTINGS ]**, set **eBay Proxy URL** to `http://localhost:8787` and hit **TEST**.

Env vars: `PORT` (default 8787), `ALLOW_ORIGIN` (default `*`), `EBAY_ENV` (`production` | `sandbox`).

---

## Option B — Cloudflare Worker (for a hosted site)

```bash
npm i -g wrangler
wrangler init ebay-proxy        # paste proxy/ebay-proxy.worker.js into src/index.js
wrangler secret put EBAY_CLIENT_ID
wrangler secret put EBAY_CLIENT_SECRET
wrangler deploy
```

(Optional) set an `ALLOW_ORIGIN` var to your site's origin instead of `*`. Then set the Worker URL as the **eBay Proxy URL** in PART_VAULT settings.

A Vercel/Netlify function or any small Node host works the same way — just expose `GET /price?q=...` and forward to eBay with the OAuth token.

---

## Endpoint

```
GET /price?q=<search>&marketplace=EBAY_US&limit=25
```

`marketplace` examples: `EBAY_US`, `EBAY_GB`, `EBAY_DE`, `EBAY_AU`. `limit` is capped at 50.
