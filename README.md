# ⚙️ PART_VAULT — PC Parts Inventory Tracker

A retro-terminal-styled, browser-based inventory tracker for PC components and hardware. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no backend, no account required.

---

## Features

### Core Inventory Management
- **Add parts** with name, quantity, price paid, market value, category, and custom tags
- **Edit or delete** any item via an inline modal
- **Auto-detection** of category based on part name keywords (CPU, GPU, RAM, Motherboard, etc.)
- **Manual category override** available when adding or editing

### Categories
Parts are automatically sorted into collapsible category tabs:

| Emoji | Category |
|-------|----------|
| 🧠 | CPU / Processor |
| 🎮 | GPU / Graphics Card |
| 💾 | RAM / Memory |
| 🔌 | Motherboard |
| 💿 | Storage (SSD/HDD/NVMe) |
| ⚡ | Power Supply (PSU) |
| 🖥️ | Case / Chassis |
| ❄️ | CPU Cooler / AIO |
| 🌀 | Fans |
| 🖥️ | Monitor / Display |
| ⌨️ | Peripherals (KB/Mouse) |
| 🌐 | Networking |
| 🔗 | Cables & Adapters |
| 📦 | Miscellaneous |
| ❓ | Unsorted *(for imported items that couldn't be auto-categorized)* |

### Pricing
- **Price Paid** — what you paid for the item
- **Market Value** — current resale/market price, editable at any time
- Per-category totals displayed for both price paid and market value
- Global totals shown in the dashboard header

### Search & Filtering
- Full-text search across part names and tags
- Filter by tag — shows all matching parts across categories
- **Tag filter totals** — when filtering by tag, displays the combined price paid and market value for all matching items
- Filter by category
- Sort by name, price, market value, quantity, or date added

### Import / Export
- **Export to Excel (`.xlsx`)** — exports your full inventory with all fields, formatted and ready to share
- **Import from Excel (`.xlsx` / `.xls` / `.csv`)** — upload an existing spreadsheet and have items auto-sorted into categories; items that can't be categorized land in the **Unsorted** tab for manual review
  - Flexible column mapping: recognises common headers like `Name`, `Part Name`, `Component`, `Price`, `Cost`, `Market Value`, `Qty`, `Quantity`, `Tags`, `Category`, etc.

### PC Build Planner (Builds)
- Create **builds / parts lists** — plan a new PC, an upgrade, a homelab, or a flip
- **Per-build budget** — set an optional cap; each build shows **Budget / Committed / Remaining** with a meter that turns red when you go over
- **Build status** — tag the whole build **⋯ In Progress**, **📦 Holding**, or **💰 Sold** (inline on the build header, or in the edit modal)
- **Flip analysis** — record the build's **Price Listed** and **Price Sold**; once sold, the build surfaces **Cost / Listed / Sold / P&L** for data analysis
- **Add / remove parts** with name, quantity, price, and an optional purchase link
- **Acquired checkbox per part** — tick parts you have in hand; an acquisition progress bar fills and the build hits a "complete" state when every part is acquired

### AI Recommendations (DeepSeek)
- Per-build **[ ⚡ SUGGEST PARTS ]** button — DeepSeek recommends parts to complete or improve the build **within the remaining budget**
- Recommendations prefer **parts you already own** (pulled from your inventory & graveyard) before suggesting new purchases
- Basic **compatibility awareness** (CPU socket, RAM type, PSU wattage, motherboard form factor)
- One-click **add a suggestion** to a build (owned parts arrive pre-ticked as *acquired*; online picks unticked, with a search link)
- **Bring-your-own-key** — your DeepSeek key is stored only in your browser; see [AI Setup](#ai-setup-deepseek) below

### UX
- Retro CRT / terminal aesthetic (scanlines, amber/cyan color palette, pixel fonts)
- All data stored in **`localStorage`** — your inventory persists across browser sessions with no server needed
- Toast notifications for all actions (add, edit, delete, import, export)
- Responsive collapsible category sections
- Tag autocomplete suggestions when typing

---

## Getting Started

No install required. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/x7-u/part-vault.git
cd part-vault
# open index.html in your browser
```

Or simply [download the ZIP](../../archive/refs/heads/main.zip) and double-click `index.html`.

---

## File Structure

```
part-vault/
├── index.html   # App shell, layout, modals
├── app.js       # All logic — state, CRUD, search, import/export
└── style.css    # Retro terminal theme, layout, animations
```

---

## Import Format

When importing an Excel/CSV file, the importer looks for these column headers (case-insensitive):

| Field | Accepted Headers |
|-------|-----------------|
| Name | `Part Name`, `Name`, `Component`, `Item`, `Description`, `Product` |
| Price Paid | `Price Paid ($)`, `Price Paid`, `Price`, `Cost`, `Unit Price` |
| Market Value | `Market Value ($)`, `Market Value`, `Mkt Value`, `Current Value` |
| Quantity | `Qty`, `Quantity`, `Count`, `Units` |
| Tags | `Tags`, `Labels`, `Keywords` |
| Category | `Category`, `Type`, `Group` |

If a `Category` column is present and matches a known category, it is used directly. Otherwise, the importer auto-detects the category from the part name. Items it can't categorize go into **Unsorted**.

---

## AI Setup (DeepSeek)

AI recommendations are **opt-in** and use a **bring-your-own-key** model — PART_VAULT has no backend, so nothing is sent anywhere except directly from your browser to the API you configure.

1. Get a DeepSeek API key at [platform.deepseek.com](https://platform.deepseek.com) (new accounts include a free token grant).
2. In the **BUILDS // PC BUILD PLANNER** panel, click **[ ⚙ AI ]**.
3. Paste your key, optionally set the model (default `deepseek-chat`) and **Base URL** (default `https://api.deepseek.com`), then hit **[ SAVE ]**.
4. Use **[ TEST CONNECTION ]** to confirm it works, then click **[ ⚡ SUGGEST PARTS ]** on any build.

Your key is stored only in this browser's `localStorage` under `partvault_ai_settings`.

### A note on CORS / proxies

Browsers block most direct calls to LLM APIs (CORS), and opening `index.html` straight from disk (`file://`) makes it worse. If **TEST CONNECTION** fails with a network/CORS error:

- **Serve the page over http(s)** instead of `file://` (e.g. `python -m http.server`), and/or
- **Point the Base URL at a small proxy you control** (e.g. a Vercel / Cloudflare Worker that forwards to `https://api.deepseek.com` and adds CORS headers). The key still lives only in your browser and is sent to *your* proxy.

DeepSeek's API is **OpenAI-compatible**, so the same setup works with any compatible endpoint — just change the Base URL and model.

### Estimated cost

DeepSeek is among the cheapest APIs available — a single recommendation is a few thousand tokens, a tiny fraction of a cent, so the free grant covers a large number of suggestions. Prices change; check the [DeepSeek pricing page](https://api-docs.deepseek.com/quick_start/pricing) for current rates.

---

## Tech Stack

| Dependency | Usage |
|------------|-------|
| [SheetJS (xlsx)](https://sheetjs.com/) | Excel import & export |
| [DeepSeek API](https://api-docs.deepseek.com/) | AI part recommendations (optional, bring-your-own-key) |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | Pixel heading font |
| [VT323](https://fonts.google.com/specimen/VT323) | Terminal body font |
| [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) | Monospace UI font |

Front-end dependencies load via CDN; the optional AI features call the DeepSeek API directly with your own key. No build step, no `node_modules`.

---

## License

MIT
