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

## Tech Stack

| Dependency | Usage |
|------------|-------|
| [SheetJS (xlsx)](https://sheetjs.com/) | Excel import & export |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | Pixel heading font |
| [VT323](https://fonts.google.com/specimen/VT323) | Terminal body font |
| [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) | Monospace UI font |

All dependencies are loaded via CDN. No build step, no `node_modules`.

---

## License

MIT
