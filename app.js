// ============================================
// PART_VAULT — Inventory Tracker Engine
// ============================================

// --- Category definitions with keywords for auto-detection ---
const CATEGORIES = {
  CPU: {
    emoji: '🧠',
    keywords: ['cpu', 'processor', 'ryzen', 'intel', 'core i', 'i3', 'i5', 'i7', 'i9', 'i3-', 'i5-', 'i7-', 'i9-',
               'threadripper', 'xeon', 'pentium', 'celeron', 'athlon', '5600x', '5800x', '5900x', '5950x',
               '7600x', '7700x', '7800x', '7900x', '7950x', '13600k', '13700k', '13900k', '14600k', '14700k', '14900k',
               'epyc', 'amd ryzen']
  },
  GPU: {
    emoji: '🎮',
    keywords: ['gpu', 'graphics card', 'video card', 'rtx', 'gtx', 'radeon', 'rx ', 'rx5', 'rx6', 'rx7',
               'geforce', 'nvidia', 'amd radeon', 'quadro', 'titan', 'arc a', 'intel arc',
               '1050', '1060', '1070', '1080', '2060', '2070', '2080', '3060', '3070', '3080', '3090',
               '4060', '4070', '4080', '4090', '6600', '6700', '6800', '6900', '7600', '7700', '7800', '7900']
  },
  RAM: {
    emoji: '📊',
    keywords: ['ram', 'memory', 'ddr4', 'ddr5', 'dimm', 'sodimm', 'corsair vengeance', 'g.skill', 'gskill',
               'trident z', 'kingston fury', 'crucial ballistix', 'teamgroup', '16gb', '32gb', '64gb', '128gb',
               'ripjaws', 'dominator']
  },
  Motherboard: {
    emoji: '🔲',
    keywords: ['motherboard', 'mobo', 'mainboard', 'atx', 'micro-atx', 'matx', 'mini-itx', 'itx',
               'b550', 'b650', 'b660', 'b760', 'x570', 'x670', 'z590', 'z690', 'z790',
               'a520', 'a620', 'h610', 'h670', 'h770', 'rog strix', 'tomahawk', 'aorus',
               'asus rog', 'msi mag', 'msi mpg', 'gigabyte aorus', 'asrock']
  },
  Storage: {
    emoji: '💾',
    keywords: ['ssd', 'hdd', 'nvme', 'm.2', 'hard drive', 'solid state', 'storage',
               'samsung 970', 'samsung 980', 'samsung 990', 'wd black', 'western digital',
               'seagate', 'crucial p', 'kingston a', 'sabrent', 'firecuda',
               '500gb', '1tb', '2tb', '4tb', '8tb', 'pcie gen']
  },
  PSU: {
    emoji: '⚡',
    keywords: ['psu', 'power supply', 'watt', '650w', '750w', '850w', '1000w', '1200w',
               'evga supernova', 'corsair rm', 'seasonic', 'modular', 'semi-modular',
               'be quiet', 'thermaltake toughpower', 'cooler master v', '80 plus', '80+']
  },
  Case: {
    emoji: '🖥️',
    keywords: ['case', 'chassis', 'tower', 'enclosure', 'mid tower', 'full tower', 'mini tower',
               'nzxt h', 'fractal design', 'meshify', 'lancool', 'corsair 4000', 'corsair 5000',
               'phanteks', 'lian li', 'be quiet pure', 'cooler master nr', 'o11 dynamic',
               'torrent', 'h510', 'h7', 'pop air']
  },
  Cooler: {
    emoji: '❄️',
    keywords: ['cooler', 'aio', 'liquid cooling', 'water cooling', 'heatsink', 'radiator',
               'noctua', 'nh-d15', 'nh-u12', 'hyper 212', 'dark rock', 'kraken',
               'corsair h', 'arctic liquid', 'deepcool', 'thermalright', 'assassin',
               'le grand macho', 'cpu cooler', 'tower cooler', 'ak620', 'peerless assassin']
  },
  Fans: {
    emoji: '🌀',
    keywords: ['fan', 'case fan', 'rgb fan', 'argb fan', 'pwm fan',
               'noctua nf', 'arctic p12', 'arctic p14', 'corsair ll', 'corsair ql',
               'lian li uni', 'be quiet silent', 'be quiet light', '120mm', '140mm', '200mm']
  },
  Monitor: {
    emoji: '🖵',
    keywords: ['monitor', 'display', 'screen', '1080p', '1440p', '4k', '27"', '32"', '24"',
               'ultrawide', 'ips', 'va panel', 'oled', '144hz', '165hz', '240hz', '360hz',
               'dell s', 'lg ultragear', 'samsung odyssey', 'asus vg', 'benq', 'aoc']
  },
  Peripherals: {
    emoji: '⌨️',
    keywords: ['keyboard', 'mouse', 'mousepad', 'desk mat', 'headset', 'headphones',
               'webcam', 'microphone', 'mic', 'controller', 'gamepad', 'joystick',
               'mechanical keyboard', 'wireless mouse', 'logitech', 'razer', 'steelseries',
               'hyperx', 'ducky', 'keychron', 'glorious', 'finalmouse']
  },
  Networking: {
    emoji: '🌐',
    keywords: ['router', 'wifi', 'wi-fi', 'ethernet', 'network', 'switch', 'modem',
               'wifi card', 'wireless adapter', 'mesh', 'access point', 'cat6', 'cat7',
               'pcie wifi', 'usb wifi', 'tp-link', 'netgear', 'ubiquiti']
  },
  Cables: {
    emoji: '🔌',
    keywords: ['cable', 'adapter', 'dongle', 'hub', 'usb', 'hdmi', 'displayport', 'dp cable',
               'extension', 'splitter', 'converter', 'sata cable', 'power cable',
               'usb-c', 'thunderbolt', 'docking station']
  },
  Misc: {
    emoji: '📦',
    keywords: []  // catch-all
  },
  Unsorted: {
    emoji: '❓',
    keywords: []  // imported items that couldn't be auto-categorized
  }
};

// Tag color assignment (deterministic hash)
const TAG_COLORS = 12;
function getTagColorIndex(tag) {
  let hash = 0;
  const str = tag.toLowerCase().trim();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash) % TAG_COLORS;
}

// --- Auto-detect category from part name ---
function detectCategory(name) {
  const lower = name.toLowerCase();
  let bestMatch = 'Misc';
  let bestScore = 0;

  for (const [cat, info] of Object.entries(CATEGORIES)) {
    if (cat === 'Misc') continue;
    for (const kw of info.keywords) {
      if (lower.includes(kw) && kw.length > bestScore) {
        bestMatch = cat;
        bestScore = kw.length;
      }
    }
  }
  return bestMatch;
}

// --- Data persistence ---
function loadParts() {
  try {
    return JSON.parse(localStorage.getItem('partvault_inventory')) || [];
  } catch {
    return [];
  }
}

function saveParts(parts) {
  localStorage.setItem('partvault_inventory', JSON.stringify(parts));
}

function loadGraveyard() {
  try {
    return JSON.parse(localStorage.getItem('partvault_graveyard')) || [];
  } catch {
    return [];
  }
}

function saveGraveyard(gy) {
  localStorage.setItem('partvault_graveyard', JSON.stringify(gy));
}

function loadBuilds() {
  try {
    return JSON.parse(localStorage.getItem('partvault_builds')) || [];
  } catch {
    return [];
  }
}

function saveBuilds(b) {
  localStorage.setItem('partvault_builds', JSON.stringify(b));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- Build item statuses ---
const BUILD_STATUSES = {
  'in-progress': { label: '⋯ IN PROGRESS', short: 'IN PROGRESS', cls: 'status-progress' },
  'holding':     { label: '📦 HOLDING',     short: 'HOLDING',     cls: 'status-holding' },
  'sold':        { label: '💰 SOLD',        short: 'SOLD',        cls: 'status-sold' }
};

// Normalize builds loaded from storage (migrate older shapes / new fields)
function normalizeBuilds(list) {
  if (!Array.isArray(list)) return [];
  for (const b of list) {
    b.budget = parseFloat(b.budget) || 0;
    b.priceListed = parseFloat(b.priceListed) || 0;
    b.priceSold = parseFloat(b.priceSold) || 0;
    if (!b.status || !BUILD_STATUSES[b.status]) b.status = 'in-progress';
    b.soldSettled = !!b.soldSettled;  // inventory already moved to graveyard?
    if (!Array.isArray(b.items)) b.items = [];
    for (const it of b.items) {
      // Derive the binary acquired flag from any earlier shape.
      if (typeof it.acquired !== 'boolean') {
        if (it.status) it.acquired = (it.status === 'holding' || it.status === 'sold');
        else it.acquired = !!it.bought;
      }
      delete it.bought;     // legacy
      delete it.status;     // per-item status moved up to the build
      delete it.soldPrice;  // sale price tracked at build level now
      delete it.dateSold;
    }
  }
  return list;
}

// --- State ---
let parts = loadParts();
let graveyard = loadGraveyard();
let builds = normalizeBuilds(loadBuilds());
let aiSettings = loadAiSettings();
let ebaySettings = loadEbaySettings();

// Which inventory part is used in which (active) build. Rebuilt each render().
let allocationMap = {};
// Active build-status tab (in-progress | holding | sold).
let currentBuildTab = 'in-progress';

// --- DOM refs ---
const addForm = document.getElementById('addPartForm');
const partNameInput = document.getElementById('partName');
const partPriceInput = document.getElementById('partPrice');
const partTagsInput = document.getElementById('partTags');
const categoryOverride = document.getElementById('categoryOverride');
const autoCategoryDiv = document.getElementById('autoCategory');
const detectedCatSpan = document.getElementById('detectedCat');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const filterTag = document.getElementById('filterTag');
const inventoryGrid = document.getElementById('inventoryGrid');
const emptyState = document.getElementById('emptyState');
const totalPartsEl = document.getElementById('totalParts');
const totalValueEl = document.getElementById('totalValue');
const currentDateEl = document.getElementById('currentDate');
const partCountEl = document.getElementById('partCount');
const partMarketValueInput = document.getElementById('partMarketValue');
const editMarketValueInput = document.getElementById('editPartMarketValue');
const totalMarketValueEl = document.getElementById('totalMarketValue');

// Edit modal
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editPartForm');
const editIdInput = document.getElementById('editPartId');
const editNameInput = document.getElementById('editPartName');
const editPriceInput = document.getElementById('editPartPrice');
const editTagsInput = document.getElementById('editPartTags');
const editCategoryInput = document.getElementById('editPartCategory');

// --- Tag Input System ---
// Get all unique tags across inventory
function getAllExistingTags() {
  return [...new Set(parts.flatMap(p => p.tags))];
}

function createTagInput(inputEl, chipsEl, wrapperEl) {
  let tags = [];
  let highlightIdx = -1;

  // Create suggestions dropdown
  const suggestionsEl = document.createElement('div');
  suggestionsEl.className = 'tag-suggestions hidden';
  wrapperEl.style.position = 'relative';
  wrapperEl.appendChild(suggestionsEl);

  function normalizeTag(text) {
    const t = text.trim();
    if (!t) return '';
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }

  function addTag(text) {
    const tag = normalizeTag(text);
    if (!tag || tags.some(t => t.toLowerCase() === tag.toLowerCase())) return;
    tags.push(tag);
    renderChips();
    hideSuggestions();
  }

  function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderChips();
  }

  function renderChips() {
    chipsEl.innerHTML = tags.map(t => {
      const ci = getTagColorIndex(t);
      return `<span class="tag-chip tag-color-${ci}">${escapeHtml(t)}<span class="chip-remove" data-tag="${escapeHtml(t)}">✕</span></span>`;
    }).join('');

    chipsEl.querySelectorAll('.chip-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTag(btn.dataset.tag);
      });
    });
  }

  function getTags() { return [...tags]; }

  function setTags(newTags) {
    tags = [...newTags];
    renderChips();
  }

  function clear() {
    tags = [];
    chipsEl.innerHTML = '';
    inputEl.value = '';
    hideSuggestions();
  }

  // --- Suggestions logic ---
  function getSuggestions(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const existing = getAllExistingTags();
    return existing.filter(t =>
      t.toLowerCase().includes(q) &&
      !tags.some(curr => curr.toLowerCase() === t.toLowerCase())
    );
  }

  function showSuggestions(query) {
    const matches = getSuggestions(query);
    if (matches.length === 0) {
      hideSuggestions();
      return;
    }
    highlightIdx = -1;
    suggestionsEl.innerHTML = matches.map((t, i) => {
      const ci = getTagColorIndex(t);
      return `<div class="tag-suggestion" data-index="${i}" data-tag="${escapeHtml(t)}">
        <span class="tag tag-color-${ci}" style="font-size:14px;">${highlightMatch(t, query)}</span>
      </div>`;
    }).join('');
    suggestionsEl.classList.remove('hidden');

    suggestionsEl.querySelectorAll('.tag-suggestion').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent blur
        addTag(el.dataset.tag);
        inputEl.value = '';
        inputEl.focus();
      });
    });
  }

  function hideSuggestions() {
    suggestionsEl.classList.add('hidden');
    suggestionsEl.innerHTML = '';
    highlightIdx = -1;
  }

  function highlightMatch(tag, query) {
    const q = query.toLowerCase().trim();
    const idx = tag.toLowerCase().indexOf(q);
    if (idx === -1) return escapeHtml(tag);
    const before = tag.slice(0, idx);
    const match = tag.slice(idx, idx + q.length);
    const after = tag.slice(idx + q.length);
    return `${escapeHtml(before)}<span class="suggestion-highlight">${escapeHtml(match)}</span>${escapeHtml(after)}`;
  }

  function updateHighlight() {
    const items = suggestionsEl.querySelectorAll('.tag-suggestion');
    items.forEach((el, i) => {
      el.classList.toggle('highlighted', i === highlightIdx);
    });
    // Scroll into view
    if (highlightIdx >= 0 && items[highlightIdx]) {
      items[highlightIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  // --- Events ---
  inputEl.addEventListener('input', () => {
    const val = inputEl.value.replace(/,/g, '').trim();
    if (val.length > 0) {
      showSuggestions(val);
    } else {
      hideSuggestions();
    }
  });

  inputEl.addEventListener('keydown', (e) => {
    const items = suggestionsEl.querySelectorAll('.tag-suggestion');
    const isOpen = !suggestionsEl.classList.contains('hidden') && items.length > 0;

    if (isOpen && e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIdx = Math.min(highlightIdx + 1, items.length - 1);
      updateHighlight();
      return;
    }
    if (isOpen && e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIdx = Math.max(highlightIdx - 1, 0);
      updateHighlight();
      return;
    }
    if (isOpen && (e.key === 'Tab' || e.key === 'Enter') && highlightIdx >= 0) {
      e.preventDefault();
      addTag(items[highlightIdx].dataset.tag);
      inputEl.value = '';
      return;
    }
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      hideSuggestions();
      return;
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputEl.value.replace(/,/g, '').trim();
      if (val) {
        addTag(val);
        inputEl.value = '';
      }
    }
    if (e.key === 'Backspace' && inputEl.value === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  });

  // Also handle paste with commas
  inputEl.addEventListener('paste', (e) => {
    setTimeout(() => {
      const parts = inputEl.value.split(',');
      if (parts.length > 1) {
        parts.forEach(p => addTag(p));
        inputEl.value = '';
      }
    }, 0);
  });

  // Also add tag on blur if there's text
  inputEl.addEventListener('blur', () => {
    const val = inputEl.value.replace(/,/g, '').trim();
    if (val) {
      addTag(val);
      inputEl.value = '';
    }
    // Small delay so mousedown on suggestion fires first
    setTimeout(() => hideSuggestions(), 150);
  });

  // Click wrapper to focus input
  wrapperEl.addEventListener('click', () => inputEl.focus());

  return { getTags, setTags, clear, addTag };
}

const addTagInput = createTagInput(
  document.getElementById('partTags'),
  document.getElementById('tagChips'),
  document.getElementById('tagInputWrapper')
);

const editTagInput = createTagInput(
  document.getElementById('editPartTags'),
  document.getElementById('editTagChips'),
  document.getElementById('editTagInputWrapper')
);

// --- Auto-detect on typing ---
partNameInput.addEventListener('input', () => {
  const val = partNameInput.value.trim();
  if (val.length > 1 && !categoryOverride.value) {
    const cat = detectCategory(val);
    detectedCatSpan.textContent = `${CATEGORIES[cat].emoji} ${cat}`;
    autoCategoryDiv.classList.remove('hidden');
  } else {
    autoCategoryDiv.classList.add('hidden');
  }
});

categoryOverride.addEventListener('change', () => {
  if (categoryOverride.value) {
    autoCategoryDiv.classList.add('hidden');
  } else {
    partNameInput.dispatchEvent(new Event('input'));
  }
});

// --- Add part ---
addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = partNameInput.value.trim();
  const price = parseFloat(partPriceInput.value) || 0;
  const qty = parseInt(document.getElementById('partQty').value) || 1;
  const tags = addTagInput.getTags();
  const category = categoryOverride.value || detectCategory(name);

  const part = {
    id: generateId(),
    name,
    price,
    marketValue: parseFloat(partMarketValueInput.value) || 0,
    qty,
    tags,
    category,
    dateAdded: new Date().toISOString()
  };

  parts.push(part);
  saveParts(parts);

  addForm.reset();
  document.getElementById('partQty').value = 1;
  addTagInput.clear();
  autoCategoryDiv.classList.add('hidden');

  showToast(`✓ Added "${name}" to ${CATEGORIES[category].emoji} ${category}`);
  render();
});

// --- Edit part ---
function openEditModal(partId) {
  const part = parts.find(p => p.id === partId);
  if (!part) return;

  editIdInput.value = part.id;
  editNameInput.value = part.name;
  editPriceInput.value = part.price;
  editMarketValueInput.value = part.marketValue || '';
  document.getElementById('editPartQty').value = part.qty || 1;
  editTagInput.setTags(part.tags);
  editTagsInput.value = '';
  editCategoryInput.value = part.category;
  if (ebayLookupNote) { ebayLookupNote.textContent = ''; ebayLookupNote.className = 'ebay-note'; }

  editModal.classList.remove('hidden');
}

function closeModal() {
  editModal.classList.add('hidden');
}

editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeBuildModal();
    closeBuildItemModal();
    closeAiSettings();
    closeAiSuggest();
    closeInvPicker();
  }
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = editIdInput.value;
  const idx = parts.findIndex(p => p.id === id);
  if (idx === -1) return;

  parts[idx].name = editNameInput.value.trim();
  parts[idx].price = parseFloat(editPriceInput.value) || 0;
  parts[idx].marketValue = parseFloat(editMarketValueInput.value) || 0;
  parts[idx].qty = parseInt(document.getElementById('editPartQty').value) || 1;
  parts[idx].tags = editTagInput.getTags();
  parts[idx].category = editCategoryInput.value;

  saveParts(parts);
  closeModal();
  showToast('✓ Part updated successfully');
  render();
});

function deletePart() {
  const id = editIdInput.value;
  const part = parts.find(p => p.id === id);
  if (!part) return;

  if (confirm(`Send "${part.name}" to the graveyard?`)) {
    parts = parts.filter(p => p.id !== id);
    saveParts(parts);

    const gravePart = { ...part, dateRemoved: new Date().toISOString() };
    graveyard.push(gravePart);
    saveGraveyard(graveyard);

    closeModal();
    showToast(`☠ "${part.name}" sent to graveyard`);
    render();
  }
}

// --- Graveyard ---
function restoreFromGraveyard(id) {
  const idx = graveyard.findIndex(p => p.id === id);
  if (idx === -1) return;

  const part = { ...graveyard[idx] };
  delete part.dateRemoved;
  graveyard.splice(idx, 1);
  saveGraveyard(graveyard);

  parts.push(part);
  saveParts(parts);

  showToast(`✓ Restored "${part.name}" to vault`);
  render();
}

function permanentlyDelete(id) {
  const part = graveyard.find(p => p.id === id);
  if (!part) return;

  if (confirm(`Permanently delete "${part.name}"? This cannot be undone.`)) {
    graveyard = graveyard.filter(p => p.id !== id);
    saveGraveyard(graveyard);
    showToast(`✗ "${part.name}" permanently deleted`);
    render();
  }
}

function toggleGraveyard() {
  const section = document.getElementById('graveyardSection');
  const body = document.getElementById('graveyardBody');
  if (body.style.display === 'none') {
    body.style.display = '';
  } else {
    body.style.display = 'none';
  }
}

// --- Filters ---
searchInput.addEventListener('input', render);
filterCategory.addEventListener('change', render);
filterTag.addEventListener('change', render);

function clearFilters() {
  searchInput.value = '';
  filterCategory.value = '';
  filterTag.value = '';
  render();
}

function getFilteredParts() {
  const search = searchInput.value.toLowerCase().trim();
  const catFilter = filterCategory.value;
  const tagFilter = filterTag.value;

  return parts.filter(p => {
    if (catFilter && p.category !== catFilter) return false;
    if (tagFilter && !p.tags.includes(tagFilter)) return false;
    if (search) {
      const haystack = `${p.name} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

// --- Render ---
function render() {
  const filtered = getFilteredParts();
  allocationMap = computeAllocationMap();

  // Update stats
  const totalValue = parts.reduce((sum, p) => sum + (p.price * (p.qty || 1)), 0);
  const totalMarketValue = parts.reduce((sum, p) => sum + ((p.marketValue || 0) * (p.qty || 1)), 0);
  totalPartsEl.textContent = `TOTAL PARTS: ${parts.length}`;
  totalValueEl.textContent = `TOTAL VALUE: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalMarketValueEl.textContent = `MKT VALUE: $${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  partCountEl.textContent = parts.length;

  // Update filtered stats
  const filteredStatsEl = document.getElementById('filteredStats');
  const isFiltered = searchInput.value.trim() || filterCategory.value || filterTag.value;
  if (isFiltered && filtered.length > 0) {
    const fPaid = filtered.reduce((s, p) => s + (p.price * (p.qty || 1)), 0);
    const fMkt = filtered.reduce((s, p) => s + ((p.marketValue || 0) * (p.qty || 1)), 0);
    const fCount = filtered.reduce((s, p) => s + (p.qty || 1), 0);
    filteredStatsEl.innerHTML =
      `<span>SHOWING: ${filtered.length} part${filtered.length !== 1 ? 's' : ''} (${fCount} units)</span>` +
      `<span>TOTAL PRICE: $${fPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>` +
      `<span>TOTAL MKT VALUE: $${fMkt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>`;
    filteredStatsEl.classList.remove('hidden');
  } else {
    filteredStatsEl.classList.add('hidden');
  }

  // Update filter dropdowns
  updateFilterDropdowns();

  // Group by category
  const groups = {};
  for (const p of filtered) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  }

  // Render category order
  const categoryOrder = Object.keys(CATEGORIES);

  if (filtered.length === 0) {
    inventoryGrid.innerHTML = '';
    emptyState.style.display = 'block';
    renderGraveyard();   // builds/graveyard must still update when inventory is empty/filtered out
    renderBuilds();
    return;
  }

  emptyState.style.display = 'none';

  let html = '';
  for (const cat of categoryOrder) {
    if (!groups[cat] || groups[cat].length === 0) continue;
    const catParts = groups[cat];
    const catInfo = CATEGORIES[cat] || { emoji: '📦' };
    const catTotal = catParts.reduce((s, p) => s + (p.price * (p.qty || 1)), 0);

    html += `
      <div class="category-block">
        <div class="category-header" onclick="toggleCategory(this)">
          <div class="category-title">
            <span class="category-emoji">${catInfo.emoji}</span>
            ${cat.toUpperCase()}
          </div>
          <div>
            <span class="category-count">${catParts.length} item${catParts.length !== 1 ? 's' : ''}</span>
            <span class="category-total">$${catTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div class="category-body">
          <table class="parts-table">
            <thead>
              <tr>
                <th style="width:30%">COMPONENT</th>
                <th style="width:7%">QTY</th>
                <th style="width:10%">PRICE</th>
                <th style="width:10%">MKT VALUE</th>
                <th style="width:13%">DATE ADDED</th>
                <th style="width:30%">TAGS</th>
              </tr>
            </thead>
            <tbody>
              ${catParts.map(p => {
                const date = new Date(p.dateAdded);
                const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                const tagsHtml = p.tags.map(t => {
                  const ci = getTagColorIndex(t);
                  return `<span class="tag tag-color-${ci}">${t}</span>`;
                }).join('');
                const qty = p.qty || 1;
                const alloc = allocationMap[p.id];
                let inUseTag = '';
                if (alloc && alloc.units > 0) {
                  const tip = 'In ' + alloc.builds.map(x => `${x.name} (${x.units})`).join(', ') + ` — ${alloc.units}/${qty} allocated`;
                  inUseTag = ` <span class="in-use-tag" title="${escapeHtml(tip).replace(/"/g, '&quot;')}">🔧 IN USE${alloc.units > 1 ? ' ×' + alloc.units : ''}</span>`;
                }
                return `
                  <tr draggable="true" ondragstart="handleInvDragStart(event, '${p.id}')" onclick="openEditModal('${p.id}')" title="Drag onto a build to allocate">
                    <td><span class="part-name">${escapeHtml(p.name)}</span>${inUseTag}</td>
                    <td><span class="part-qty">${qty > 1 ? 'x' + qty : qty}</span></td>
                    <td><span class="part-price">$${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></td>
                    <td><span class="part-mkt-value">${p.marketValue ? '$' + p.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}</span></td>
                    <td><span class="part-date">${dateStr}</span></td>
                    <td><div class="tags-container">${tagsHtml}</div></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  inventoryGrid.innerHTML = html;

  // Render graveyard
  renderGraveyard();

  // Render builds
  renderBuilds();
}

function renderGraveyard() {
  const graveyardSection = document.getElementById('graveyardSection');
  const graveyardBody = document.getElementById('graveyardBody');
  const graveyardCount = document.getElementById('graveyardCount');

  if (graveyard.length === 0) {
    graveyardSection.style.display = 'none';
    return;
  }

  graveyardSection.style.display = '';
  graveyardCount.textContent = `${graveyard.length} item${graveyard.length !== 1 ? 's' : ''}`;

  const totalPaid = graveyard.reduce((s, p) => s + (p.price * (p.qty || 1)), 0);
  const totalMkt = graveyard.reduce((s, p) => s + ((p.marketValue || 0) * (p.qty || 1)), 0);
  document.getElementById('graveyardTotalPaid').textContent = `$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  document.getElementById('graveyardTotalMkt').textContent = `$${totalMkt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  graveyardBody.querySelector('tbody').innerHTML = graveyard.map(p => {
    const date = new Date(p.dateRemoved);
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const catInfo = CATEGORIES[p.category] || { emoji: '📦' };
    return `
      <tr>
        <td><span class="part-name">${escapeHtml(p.name)}</span></td>
        <td><span class="graveyard-cat">${catInfo.emoji} ${p.category}</span></td>
        <td><span class="part-qty">${(p.qty || 1) > 1 ? 'x' + (p.qty || 1) : (p.qty || 1)}</span></td>
        <td><span class="part-price">$${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></td>
        <td><span class="part-mkt-value">${p.marketValue ? '$' + p.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}</span></td>
        <td><span class="part-date">${dateStr}</span></td>
        <td class="graveyard-actions">
          <button class="btn-restore" onclick="restoreFromGraveyard('${p.id}')" title="Restore to vault">↩</button>
          <button class="btn-perma-delete" onclick="permanentlyDelete('${p.id}')" title="Permanently delete">✕</button>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleCategory(header) {
  const body = header.nextElementSibling;
  if (body.style.display === 'none') {
    body.style.display = '';
  } else {
    body.style.display = 'none';
  }
}

function updateFilterDropdowns() {
  // Categories
  const usedCats = [...new Set(parts.map(p => p.category))].sort();
  const currentCatFilter = filterCategory.value;
  filterCategory.innerHTML = '<option value="">All Categories</option>';
  for (const cat of usedCats) {
    const info = CATEGORIES[cat] || { emoji: '📦' };
    filterCategory.innerHTML += `<option value="${cat}" ${cat === currentCatFilter ? 'selected' : ''}>${info.emoji} ${cat}</option>`;
  }

  // Tags
  const allTags = [...new Set(parts.flatMap(p => p.tags))].sort();
  const currentTagFilter = filterTag.value;
  filterTag.innerHTML = '<option value="">All Tags</option>';
  for (const tag of allTags) {
    filterTag.innerHTML += `<option value="${tag}" ${tag === currentTagFilter ? 'selected' : ''}>${tag}</option>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// --- Export to Excel ---
function exportToExcel() {
  if (parts.length === 0) {
    showToast('No parts to export!');
    return;
  }

  const headers = ['Part Name', 'Category', 'Qty', 'Price Paid ($)', 'Market Value ($)', 'Total Paid ($)', 'Total Mkt Value ($)', 'Tags', 'Date Added'];
  const rows = parts.map(p => {
    const qty = p.qty || 1;
    return [
      p.name,
      p.category,
      qty,
      p.price,
      p.marketValue || '',
      p.price * qty,
      p.marketValue ? p.marketValue * qty : '',
      p.tags.join(', '),
      new Date(p.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    ];
  });

  const totalPaid = parts.reduce((s, p) => s + p.price * (p.qty || 1), 0);
  const totalMkt = parts.reduce((s, p) => s + (p.marketValue || 0) * (p.qty || 1), 0);
  rows.push([]);
  rows.push(['TOTALS', '', parts.reduce((s, p) => s + (p.qty || 1), 0), '', '', totalPaid, totalMkt, '', '']);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 35 }, { wch: 15 }, { wch: 6 }, { wch: 14 },
    { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 30 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  // Graveyard sheet
  if (graveyard.length > 0) {
    const gyHeaders = ['Part Name', 'Category', 'Qty', 'Price Paid ($)', 'Market Value ($)', 'Total Paid ($)', 'Total Mkt Value ($)', 'Tags', 'Date Added', 'Date Removed'];
    const gyRows = graveyard.map(p => {
      const qty = p.qty || 1;
      return [
        p.name,
        p.category,
        qty,
        p.price,
        p.marketValue || '',
        p.price * qty,
        p.marketValue ? p.marketValue * qty : '',
        p.tags.join(', '),
        new Date(p.dateAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        new Date(p.dateRemoved).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      ];
    });
    const gyTotalPaid = graveyard.reduce((s, p) => s + p.price * (p.qty || 1), 0);
    const gyTotalMkt = graveyard.reduce((s, p) => s + (p.marketValue || 0) * (p.qty || 1), 0);
    gyRows.push([]);
    gyRows.push(['TOTALS', '', graveyard.reduce((s, p) => s + (p.qty || 1), 0), '', '', gyTotalPaid, gyTotalMkt, '', '', '']);

    const gyWs = XLSX.utils.aoa_to_sheet([gyHeaders, ...gyRows]);
    gyWs['!cols'] = [
      { wch: 35 }, { wch: 15 }, { wch: 6 }, { wch: 14 },
      { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, gyWs, 'Graveyard');
  }

  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `PART_VAULT_${date}.xlsx`);
  showToast('✓ Exported to Excel!');
}

// --- Import from Excel ---
function findColumn(row, possibleNames) {
  for (const key of Object.keys(row)) {
    const lower = key.toLowerCase().trim();
    for (const name of possibleNames) {
      if (lower === name.toLowerCase()) return row[key];
    }
  }
  return null;
}

function importExcel(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    const wb = XLSX.read(data, { type: 'array' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);

    if (rows.length === 0) {
      showToast('No data found in file!');
      return;
    }

    let imported = 0;
    let unsorted = 0;

    for (const row of rows) {
      const name = findColumn(row, ['Part Name', 'Name', 'Component', 'Item', 'Description', 'Product']);
      if (!name || String(name).toUpperCase() === 'TOTALS') continue;

      const price = parseFloat(findColumn(row, ['Price Paid ($)', 'Price Paid', 'Price', 'Cost', 'Unit Price'])) || 0;
      const marketValue = parseFloat(findColumn(row, ['Market Value ($)', 'Market Value', 'Mkt Value', 'Current Value'])) || 0;
      const qty = parseInt(findColumn(row, ['Qty', 'Quantity', 'Count', 'Units'])) || 1;
      const tagsRaw = findColumn(row, ['Tags', 'Labels', 'Keywords']) || '';
      const tags = typeof tagsRaw === 'string' ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
      const existingCat = findColumn(row, ['Category', 'Type', 'Group']);

      let category;
      if (existingCat && CATEGORIES[existingCat]) {
        category = existingCat;
      } else {
        category = detectCategory(String(name));
        if (category === 'Misc') {
          category = 'Unsorted';
          unsorted++;
        }
      }

      parts.push({
        id: generateId(),
        name: String(name),
        price,
        marketValue,
        qty,
        tags,
        category,
        dateAdded: new Date().toISOString()
      });
      imported++;
    }

    if (imported > 0) {
      saveParts(parts);
      render();
      showToast(`✓ Imported ${imported} part${imported !== 1 ? 's' : ''}${unsorted > 0 ? ` (${unsorted} unsorted)` : ''}`);
    } else {
      showToast('No valid data found in file!');
    }
  };

  reader.readAsArrayBuffer(file);
  e.target.value = '';
}

// ============================================
// --- Builds / Parts Lists ---
// ============================================

const buildsListEl = document.getElementById('buildsList');
const buildsEmptyEl = document.getElementById('buildsEmpty');

const buildModal = document.getElementById('buildModal');
const buildForm = document.getElementById('buildForm');
const buildModalTitle = document.getElementById('buildModalTitle');
const buildIdField = document.getElementById('buildIdField');
const buildNameInput = document.getElementById('buildName');
const buildNotesInput = document.getElementById('buildNotes');
const buildBudgetInput = document.getElementById('buildBudget');
const buildStatusInput = document.getElementById('buildStatus');
const buildPriceListedInput = document.getElementById('buildPriceListed');
const buildPriceSoldInput = document.getElementById('buildPriceSold');

const buildItemModal = document.getElementById('buildItemModal');
const buildItemForm = document.getElementById('buildItemForm');
const buildItemModalTitle = document.getElementById('buildItemModalTitle');
const buildItemBuildIdField = document.getElementById('buildItemBuildIdField');
const buildItemIdField = document.getElementById('buildItemIdField');
const buildItemNameInput = document.getElementById('buildItemName');
const buildItemLinkInput = document.getElementById('buildItemLink');
const buildItemPriceInput = document.getElementById('buildItemPrice');
const buildItemQtyInput = document.getElementById('buildItemQty');
const buildItemAcquiredInput = document.getElementById('buildItemAcquired');
const buildItemDeleteBtn = document.getElementById('buildItemDeleteBtn');

// Only accept http(s) URLs. If no protocol is given, prepend https://.
function sanitizeLink(url) {
  if (!url) return '';
  let t = String(url).trim();
  if (!t) return '';
  if (/^(?!https?:\/\/)[a-z][a-z0-9+.-]*:/i.test(t)) return '';
  if (!/^https?:\/\//i.test(t)) t = 'https://' + t.replace(/^\/+/, '');
  return t;
}

// --- Build CRUD ---
function openBuildModal(buildId) {
  if (buildId) {
    const b = builds.find(x => x.id === buildId);
    if (!b) return;
    buildModalTitle.textContent = 'EDIT BUILD';
    buildIdField.value = b.id;
    buildNameInput.value = b.name;
    buildNotesInput.value = b.notes || '';
    buildBudgetInput.value = b.budget || '';
    buildStatusInput.value = b.status || 'in-progress';
    buildPriceListedInput.value = b.priceListed || '';
    buildPriceSoldInput.value = b.priceSold || '';
  } else {
    buildModalTitle.textContent = 'NEW BUILD';
    buildIdField.value = '';
    buildNameInput.value = '';
    buildNotesInput.value = '';
    buildBudgetInput.value = '';
    buildStatusInput.value = 'in-progress';
    buildPriceListedInput.value = '';
    buildPriceSoldInput.value = '';
  }
  buildModal.classList.remove('hidden');
  setTimeout(() => buildNameInput.focus(), 0);
}

function closeBuildModal() {
  buildModal.classList.add('hidden');
}

buildModal.addEventListener('click', (e) => {
  if (e.target === buildModal) closeBuildModal();
});

buildForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = buildIdField.value;
  const name = buildNameInput.value.trim();
  const notes = buildNotesInput.value.trim();
  const budget = parseFloat(buildBudgetInput.value) || 0;
  const status = buildStatusInput.value || 'in-progress';
  const priceListed = parseFloat(buildPriceListedInput.value) || 0;
  const priceSold = parseFloat(buildPriceSoldInput.value) || 0;
  if (!name) return;

  if (id) {
    const b = builds.find(x => x.id === id);
    if (b) {
      const prevStatus = b.status;
      b.name = name;
      b.notes = notes;
      b.budget = budget;
      b.status = status;
      b.priceListed = priceListed;
      b.priceSold = priceSold;
      if (!handleSoldTransition(b)) { b.status = prevStatus; }
      currentBuildTab = b.status;
    }
    showToast(`✓ Build "${name}" updated`);
  } else {
    builds.push({
      id: generateId(),
      name,
      notes,
      budget,
      status,
      priceListed,
      priceSold,
      soldSettled: false,
      items: [],
      dateCreated: new Date().toISOString()
    });
    currentBuildTab = status;
    showToast(`✓ Build "${name}" created`);
  }

  saveBuilds(builds);
  closeBuildModal();
  render();
});

function deleteBuild(buildId) {
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  if (!confirm(`Delete build "${b.name}" and all its items?`)) return;
  builds = builds.filter(x => x.id !== buildId);
  saveBuilds(builds);
  showToast(`✗ Build "${b.name}" deleted`);
  render();
}

function toggleBuildBody(header) {
  const body = header.nextElementSibling;
  body.style.display = body.style.display === 'none' ? '' : 'none';
}

// --- Build item CRUD ---
function openBuildItemModal(buildId, itemId) {
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  buildItemBuildIdField.value = buildId;

  if (itemId) {
    const item = b.items.find(x => x.id === itemId);
    if (!item) return;
    buildItemModalTitle.textContent = 'EDIT PART';
    buildItemIdField.value = item.id;
    buildItemNameInput.value = item.name;
    buildItemLinkInput.value = item.link || '';
    buildItemPriceInput.value = item.price || '';
    buildItemQtyInput.value = item.qty || 1;
    buildItemAcquiredInput.checked = !!item.acquired;
    buildItemDeleteBtn.style.display = '';
  } else {
    buildItemModalTitle.textContent = 'ADD PART';
    buildItemIdField.value = '';
    buildItemNameInput.value = '';
    buildItemLinkInput.value = '';
    buildItemPriceInput.value = '';
    buildItemQtyInput.value = 1;
    buildItemAcquiredInput.checked = false;
    buildItemDeleteBtn.style.display = 'none';
  }
  buildItemModal.classList.remove('hidden');
  setTimeout(() => buildItemNameInput.focus(), 0);
}

function closeBuildItemModal() {
  buildItemModal.classList.add('hidden');
}

buildItemModal.addEventListener('click', (e) => {
  if (e.target === buildItemModal) closeBuildItemModal();
});

buildItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const buildId = buildItemBuildIdField.value;
  const itemId = buildItemIdField.value;
  const b = builds.find(x => x.id === buildId);
  if (!b) return;

  const name = buildItemNameInput.value.trim();
  if (!name) return;
  const link = sanitizeLink(buildItemLinkInput.value);
  const price = parseFloat(buildItemPriceInput.value) || 0;
  const qty = parseInt(buildItemQtyInput.value) || 1;
  const acquired = buildItemAcquiredInput.checked;
  const now = new Date().toISOString();

  if (itemId) {
    const item = b.items.find(x => x.id === itemId);
    if (item) {
      item.name = name;
      item.link = link;
      item.price = price;
      item.qty = qty;
      setAcquired(item, acquired, now);
    }
    showToast(`✓ Updated "${name}"`);
  } else {
    const item = { id: generateId(), name, link, price, qty, acquired, dateAdded: now };
    setAcquired(item, acquired, now);
    b.items.push(item);
    showToast(`✓ Added "${name}" to ${b.name}`);
  }

  saveBuilds(builds);
  closeBuildItemModal();
  render();
});

function deleteBuildItemFromModal() {
  const buildId = buildItemBuildIdField.value;
  const itemId = buildItemIdField.value;
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  const item = b.items.find(x => x.id === itemId);
  if (!item) return;
  if (!confirm(`Remove "${item.name}" from "${b.name}"?`)) return;
  b.items = b.items.filter(x => x.id !== itemId);
  saveBuilds(builds);
  closeBuildItemModal();
  showToast(`✗ Removed "${item.name}"`);
  render();
}

// Set a part's acquired flag and manage its timestamp.
function setAcquired(item, acquired, now) {
  now = now || new Date().toISOString();
  item.acquired = !!acquired;
  if (item.acquired && !item.dateAcquired) item.dateAcquired = now;
  if (!item.acquired) delete item.dateAcquired;
}

// Inline acquired toggle from the per-row checkbox.
function setItemAcquired(buildId, itemId, checked) {
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  const item = b.items.find(x => x.id === itemId);
  if (!item) return;
  setAcquired(item, checked);
  saveBuilds(builds);
  renderBuilds();
}

// Move units to the graveyard, consolidating by source part id (qty grows).
function addToGraveyard(part, units, build) {
  const now = new Date().toISOString();
  const existing = part.id ? graveyard.find(g => g.sourcePartId === part.id) : null;
  if (existing) {
    existing.qty = (existing.qty || 1) + units;
    existing.dateRemoved = now;
    if (build) existing.soldFromBuild = build.name;
  } else {
    graveyard.push({
      id: generateId(),
      name: part.name,
      price: part.price || 0,
      marketValue: part.marketValue || 0,
      qty: units,
      tags: [...(part.tags || [])],
      category: part.category,
      dateAdded: part.dateAdded || now,
      dateRemoved: now,
      sourcePartId: part.id || null,
      soldFromBuild: build ? build.name : ''
    });
  }
}

// On sale: pull each sourced part's used units out of inventory into the graveyard.
function settleSoldBuild(b) {
  if (b.soldSettled) return 0;
  let moved = 0;
  for (const it of b.items) {
    if (!it.sourcePartId) continue;
    const idx = parts.findIndex(p => p.id === it.sourcePartId);
    if (idx === -1) continue;                 // part already gone
    const p = parts[idx];
    const units = Math.min(it.qty || 1, p.qty || 1);
    if (units <= 0) continue;
    p.qty = (p.qty || 1) - units;
    addToGraveyard(p, units, b);
    moved += units;
    if (p.qty <= 0) parts.splice(idx, 1);      // fully sold out -> leaves inventory
  }
  b.soldSettled = true;
  saveParts(parts);
  saveGraveyard(graveyard);
  saveBuilds(builds);
  return moved;
}

// Confirm + settle when a build transitions to Sold. Returns false if cancelled.
function handleSoldTransition(b) {
  if (b.status !== 'sold' || b.soldSettled) return true;
  const units = b.items.filter(it => it.sourcePartId).reduce((s, it) => s + (it.qty || 1), 0);
  if (units > 0) {
    if (!confirm(`Mark "${b.name}" sold?\n\nThis removes ${units} owned part-unit(s) from your inventory and moves them to the graveyard.`)) {
      return false;
    }
    const moved = settleSoldBuild(b);
    if (moved) showToast(`☠ ${moved} part-unit(s) moved to graveyard`);
  } else {
    b.soldSettled = true;   // nothing sourced to move
  }
  return true;
}

// Inline build-status change from the header dropdown.
function setBuildStatus(buildId, status) {
  const b = builds.find(x => x.id === buildId);
  if (!b || !BUILD_STATUSES[status]) return;
  const prev = b.status;
  b.status = status;
  if (!handleSoldTransition(b)) { b.status = prev; renderBuilds(); return; }
  currentBuildTab = status;    // follow the build to its new tab
  saveBuilds(builds);
  render();
}

// Build-status tab switching.
function setBuildTab(tab) {
  if (!BUILD_STATUSES[tab]) return;
  currentBuildTab = tab;
  renderBuilds();
}

// --- Inventory ↔ build allocation ---
// Units of an inventory part used across ACTIVE (non-sold) builds.
function allocatedUnits(partId) {
  let n = 0;
  for (const b of builds) {
    if (b.status === 'sold') continue;
    for (const it of b.items) {
      if (it.sourcePartId === partId) n += (it.qty || 1);
    }
  }
  return n;
}

function remainingUnits(part) {
  return (part.qty || 1) - allocatedUnits(part.id);
}

// Map: partId -> { units, builds:[{name, units}] } for active builds (cached per render).
function computeAllocationMap() {
  const map = {};
  for (const b of builds) {
    if (b.status === 'sold') continue;
    for (const it of b.items) {
      if (!it.sourcePartId) continue;
      const u = it.qty || 1;
      if (!map[it.sourcePartId]) map[it.sourcePartId] = { units: 0, builds: [] };
      map[it.sourcePartId].units += u;
      const e = map[it.sourcePartId].builds.find(x => x.name === b.name);
      if (e) e.units += u; else map[it.sourcePartId].builds.push({ name: b.name, units: u });
    }
  }
  return map;
}

// Allocate one unit of an inventory part to a build (soft link — stays in inventory until sold).
function allocatePartToBuild(buildId, partId) {
  const b = builds.find(x => x.id === buildId);
  const p = parts.find(x => x.id === partId);
  if (!b || !p) return false;
  if (b.status === 'sold') { showToast('Can’t add parts to a sold build'); return false; }
  if (remainingUnits(p) <= 0) { showToast(`All ${p.qty || 1}× "${p.name}" already allocated`); return false; }
  const now = new Date().toISOString();
  b.items.push({
    id: generateId(),
    name: p.name,
    link: '',
    price: p.price || 0,
    qty: 1,
    acquired: true,            // you own it, so it's in hand
    sourcePartId: p.id,
    dateAdded: now,
    dateAcquired: now
  });
  saveBuilds(builds);
  render();
  showToast(`✓ Added "${p.name}" to ${b.name}`);
  return true;
}

// Drag (inventory row) -> drop (build block).
function handleInvDragStart(e, partId) {
  e.dataTransfer.setData('text/plain', partId);
  e.dataTransfer.effectAllowed = 'copy';
}

function handleBuildDrop(e, buildId) {
  e.preventDefault();
  const partId = e.dataTransfer.getData('text/plain');
  if (partId) allocatePartToBuild(buildId, partId);
}

// --- Add-from-inventory picker modal ---
const invPickerModal = document.getElementById('invPickerModal');
const invPickerListEl = document.getElementById('invPickerList');
const invPickerSearchEl = document.getElementById('invPickerSearch');
const invPickerBuildNameEl = document.getElementById('invPickerBuildName');
let invPickerBuildId = null;

function openInventoryPicker(buildId) {
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  if (b.status === 'sold') { showToast('This build is sold'); return; }
  invPickerBuildId = buildId;
  invPickerBuildNameEl.textContent = '// ' + b.name;
  invPickerSearchEl.value = '';
  renderInvPicker();
  invPickerModal.classList.remove('hidden');
  setTimeout(() => invPickerSearchEl.focus(), 0);
}

function closeInvPicker() {
  invPickerModal.classList.add('hidden');
}

function renderInvPicker() {
  const search = invPickerSearchEl.value.toLowerCase().trim();
  const avail = parts.filter(p => {
    if (remainingUnits(p) <= 0) return false;
    if (!search) return true;
    return `${p.name} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase().includes(search);
  });
  if (avail.length === 0) {
    invPickerListEl.innerHTML = `<div class="inv-picker-empty">No available parts${search ? ' match your filter' : ' — every unit is allocated'}.</div>`;
    return;
  }
  invPickerListEl.innerHTML = avail.map(p => {
    const rem = remainingUnits(p);
    const ci = CATEGORIES[p.category] || { emoji: '📦' };
    return `
      <div class="inv-picker-row">
        <div class="inv-picker-main">
          <span class="part-name">${escapeHtml(p.name)}</span>
          <span class="inv-picker-cat">${ci.emoji} ${p.category}</span>
        </div>
        <div class="inv-picker-side">
          <span class="inv-picker-rem">${rem} of ${p.qty || 1} free</span>
          <button class="ai-add-btn" onclick="allocateFromPicker('${p.id}')">[ + ADD ]</button>
        </div>
      </div>`;
  }).join('');
}

function allocateFromPicker(partId) {
  if (allocatePartToBuild(invPickerBuildId, partId)) {
    renderInvPicker();   // refresh remaining counts in place
  }
}

invPickerModal.addEventListener('click', (e) => { if (e.target === invPickerModal) closeInvPicker(); });
invPickerSearchEl.addEventListener('input', renderInvPicker);

// --- Render builds ---
function renderBuilds() {
  if (!builds || builds.length === 0) {
    buildsListEl.innerHTML = '';
    buildsEmptyEl.style.display = '';
    return;
  }

  buildsEmptyEl.style.display = 'none';

  // Status tabs (in-progress | holding | sold)
  const tabCounts = { 'in-progress': 0, 'holding': 0, 'sold': 0 };
  builds.forEach(x => { tabCounts[BUILD_STATUSES[x.status] ? x.status : 'in-progress']++; });
  const tab = BUILD_STATUSES[currentBuildTab] ? currentBuildTab : 'in-progress';
  const tabsHtml = ['in-progress', 'holding', 'sold'].map(t =>
    `<button class="build-tab tab-${t} ${t === tab ? 'active' : ''}" onclick="setBuildTab('${t}')">${BUILD_STATUSES[t].label}<span class="build-tab-count">${tabCounts[t]}</span></button>`
  ).join('');

  const shown = builds.filter(b => (BUILD_STATUSES[b.status] ? b.status : 'in-progress') === tab);

  const blocksHtml = shown.map(b => {
    const status = BUILD_STATUSES[b.status] ? b.status : 'in-progress';
    const st = BUILD_STATUSES[status];
    const totalUnits = b.items.reduce((s, i) => s + (i.qty || 1), 0);
    const acquiredUnits = b.items.filter(i => i.acquired).reduce((s, i) => s + (i.qty || 1), 0);
    const committed = b.items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    const budget = b.budget || 0;
    const remaining = budget - committed;
    const overBudget = budget > 0 && committed > budget;
    const usedPct = budget > 0 ? Math.min((committed / budget) * 100, 100) : 0;
    const progressPct = totalUnits > 0 ? (acquiredUnits / totalUnits) * 100 : 0;
    const complete = totalUnits > 0 && acquiredUnits === totalUnits;

    // Flip economics: what the whole build cost vs what it listed/sold for.
    const priceListed = b.priceListed || 0;
    const priceSold = b.priceSold || 0;
    const realized = priceSold - committed;            // profit once sold
    const hasSaleData = priceListed > 0 || priceSold > 0;

    const money = v => '$' + (v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

    const itemsHtml = b.items.length === 0
      ? `<tr><td colspan="6" class="build-empty-row">No parts yet. Click [ + ADD PART ] or [ ⚡ SUGGEST ] to start.</td></tr>`
      : b.items.map(i => {
          const qty = i.qty || 1;
          const lineTotal = (i.price || 0) * qty;
          const linkHtml = i.link
            ? `<a href="${escapeHtml(i.link)}" target="_blank" rel="noopener noreferrer" class="build-item-link" onclick="event.stopPropagation()">LINK ↗</a>`
            : '<span class="build-item-nolink">—</span>';
          return `
            <tr class="${i.acquired ? 'acquired-row' : ''}" onclick="openBuildItemModal('${b.id}', '${i.id}')">
              <td>
                <input type="checkbox" class="acquired-checkbox" ${i.acquired ? 'checked' : ''}
                  title="Mark acquired"
                  onclick="event.stopPropagation(); setItemAcquired('${b.id}', '${i.id}', this.checked)">
              </td>
              <td><span class="part-name">${escapeHtml(i.name)}</span>${i.sourcePartId ? ' <span class="from-inv-mark" title="Allocated from your inventory">📦</span>' : ''}</td>
              <td>${linkHtml}</td>
              <td><span class="part-qty">${qty > 1 ? 'x' + qty : qty}</span></td>
              <td><span class="part-price">${i.price ? money(i.price) : '—'}</span></td>
              <td><span class="part-mkt-value">${lineTotal ? money(lineTotal) : '—'}</span></td>
            </tr>
          `;
        }).join('');

    const budgetMeter = budget > 0 ? `
      <div class="build-budget-line ${overBudget ? 'over-budget' : ''}">
        <span>BUDGET ${money(budget)}</span>
        <span>COMMITTED ${money(committed)}</span>
        <span>${overBudget ? 'OVER BY ' + money(Math.abs(remaining)) : 'LEFT ' + money(remaining)}</span>
      </div>
      <div class="build-budget-bar">
        <div class="build-budget-fill ${overBudget ? 'over' : ''}" style="width:${usedPct}%"></div>
      </div>` : '';

    // Flip / data-analysis line (shown once a listed or sold price exists).
    const saleLine = hasSaleData ? `
      <div class="build-sale-line">
        <span>COST ${money(committed)}</span>
        ${priceListed ? `<span>LISTED ${money(priceListed)}</span>` : ''}
        ${priceSold ? `<span>SOLD ${money(priceSold)}</span>` : ''}
        ${priceSold ? `<span class="build-realized ${realized >= 0 ? 'pos' : 'neg'}">P/L ${money(realized)}</span>` : ''}
      </div>` : '';

    const statusSelect = `
      <select class="row-status-select build-status-select ${st.cls}" title="Build status"
        onclick="event.stopPropagation()"
        onchange="event.stopPropagation(); setBuildStatus('${b.id}', this.value)">
        <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>⋯ In progress</option>
        <option value="holding" ${status === 'holding' ? 'selected' : ''}>📦 Holding</option>
        <option value="sold" ${status === 'sold' ? 'selected' : ''}>💰 Sold</option>
      </select>`;

    const headerPL = (status === 'sold' && priceSold)
      ? `<span class="build-realized ${realized >= 0 ? 'pos' : 'neg'}">P/L ${money(realized)}</span>` : '';
    const spentLabel = budget > 0 ? `${money(committed)} / ${money(budget)}` : money(committed);
    const dropAttrs = status !== 'sold'
      ? `ondragover="event.preventDefault(); this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="this.classList.remove('drag-over'); handleBuildDrop(event, '${b.id}')"`
      : '';

    return `
      <div class="build-block status-block-${status} ${complete ? 'build-complete' : ''} ${overBudget ? 'build-over' : ''}" ${dropAttrs}>
        ${dropAttrs ? '<div class="build-drop-hint">⤓ drop part to allocate</div>' : ''}
        <div class="build-header" onclick="toggleBuildBody(this)">
          <div class="build-title">
            <span class="build-icon">🛒</span>
            ${escapeHtml(b.name)}
          </div>
          <div class="build-meta">
            ${statusSelect}
            <span class="build-progress">${acquiredUnits} / ${totalUnits} acquired</span>
            <span class="build-spent ${overBudget ? 'over-budget' : ''}">${spentLabel}</span>
            ${headerPL}
            <button class="build-action-btn build-suggest-btn" onclick="event.stopPropagation(); suggestParts('${b.id}')" title="AI part recommendations">⚡</button>
            <button class="build-action-btn build-edit-btn" onclick="event.stopPropagation(); openBuildModal('${b.id}')" title="Edit build">✎</button>
            <button class="build-action-btn build-delete-btn" onclick="event.stopPropagation(); deleteBuild('${b.id}')" title="Delete build">✕</button>
          </div>
        </div>
        <div class="build-body">
          ${b.notes ? `<div class="build-notes">&gt; ${escapeHtml(b.notes)}</div>` : ''}
          ${budgetMeter}
          ${saleLine}
          <div class="build-progress-bar">
            <div class="build-progress-fill" style="width:${progressPct}%"></div>
          </div>
          <table class="parts-table build-items-table">
            <thead>
              <tr>
                <th style="width:6%">✓</th>
                <th style="width:39%">PART</th>
                <th style="width:12%">LINK</th>
                <th style="width:8%">QTY</th>
                <th style="width:15%">PRICE</th>
                <th style="width:20%">TOTAL</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="build-body-actions">
            <button class="btn-add-item" onclick="openBuildItemModal('${b.id}')">[ + ADD PART ]</button>
            <button class="btn-from-inventory" onclick="openInventoryPicker('${b.id}')">[ 📦 FROM INVENTORY ]</button>
            <button class="btn-suggest-parts" onclick="suggestParts('${b.id}')">[ ⚡ SUGGEST PARTS (AI) ]</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const listHtml = shown.length
    ? blocksHtml
    : `<div class="builds-tab-empty">No ${BUILD_STATUSES[tab].short.toLowerCase()} builds.</div>`;
  buildsListEl.innerHTML = `<div class="build-tabs">${tabsHtml}</div><div class="builds-tab-list">${listHtml}</div>`;
}

// ============================================
// --- AI Integration (BYOK DeepSeek) ---
// ============================================

function loadAiSettings() {
  try {
    return JSON.parse(localStorage.getItem('partvault_ai_settings')) || {};
  } catch {
    return {};
  }
}

function saveAiSettings(s) {
  localStorage.setItem('partvault_ai_settings', JSON.stringify(s));
}

const DEFAULT_AI_BASE = 'https://api.deepseek.com';
const DEFAULT_AI_MODEL = 'deepseek-chat';

const aiSettingsModal = document.getElementById('aiSettingsModal');
const aiSettingsForm = document.getElementById('aiSettingsForm');
const aiApiKeyInput = document.getElementById('aiApiKey');
const aiModelInput = document.getElementById('aiModel');
const aiBaseUrlInput = document.getElementById('aiBaseUrl');
const aiSettingsStatus = document.getElementById('aiSettingsStatus');

const aiSuggestModal = document.getElementById('aiSuggestModal');
const aiSuggestBody = document.getElementById('aiSuggestBody');
const aiSuggestBuildName = document.getElementById('aiSuggestBuildName');

function aiConfigured() {
  return !!(aiSettings && aiSettings.apiKey);
}

// --- Settings modal ---
function openAiSettings() {
  aiApiKeyInput.value = aiSettings.apiKey || '';
  aiModelInput.value = aiSettings.model || '';
  aiBaseUrlInput.value = aiSettings.baseUrl || '';
  aiSettingsStatus.className = 'ai-status';
  aiSettingsStatus.textContent = aiSettings.apiKey ? '✓ Key saved in this browser.' : '';
  ebayProxyUrlInput.value = ebaySettings.proxyUrl || '';
  ebayMarketplaceInput.value = ebaySettings.marketplace || '';
  ebaySettingsStatus.className = 'ai-status';
  ebaySettingsStatus.textContent = ebaySettings.proxyUrl ? '✓ Proxy saved.' : '';
  aiSettingsModal.classList.remove('hidden');
  setTimeout(() => aiApiKeyInput.focus(), 0);
}

function closeAiSettings() {
  aiSettingsModal.classList.add('hidden');
}

function readAiSettingsForm() {
  return {
    apiKey: aiApiKeyInput.value.trim(),
    model: aiModelInput.value.trim(),
    baseUrl: aiBaseUrlInput.value.trim()
  };
}

aiSettingsModal.addEventListener('click', (e) => {
  if (e.target === aiSettingsModal) closeAiSettings();
});

aiSettingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  aiSettings = readAiSettingsForm();
  saveAiSettings(aiSettings);
  ebaySettings = {
    proxyUrl: ebayProxyUrlInput.value.trim(),
    marketplace: ebayMarketplaceInput.value.trim()
  };
  saveEbaySettings(ebaySettings);
  showToast('✓ Settings saved');
  closeAiSettings();
});

// --- Low-level call to a DeepSeek (OpenAI-compatible) chat endpoint ---
async function deepseekChat(messages, { json = false, maxTokens = 1400, temperature = 0.6 } = {}) {
  if (!aiConfigured()) throw new Error('NO_KEY');
  const base = (aiSettings.baseUrl || DEFAULT_AI_BASE).replace(/\/+$/, '');
  const model = aiSettings.model || DEFAULT_AI_MODEL;
  const body = { model, messages, temperature, max_tokens: maxTokens, stream: false };
  if (json) body.response_format = { type: 'json_object' };

  let res;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiSettings.apiKey}`
      },
      body: JSON.stringify(body)
    });
  } catch (err) {
    // Network/CORS failures surface here as a TypeError with no response object.
    throw new Error('NETWORK');
  }

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 300); } catch {}
    throw new Error(`HTTP ${res.status}${detail ? ': ' + detail : ''}`);
  }

  const data = await res.json();
  return (data.choices && data.choices[0] && data.choices[0].message)
    ? (data.choices[0].message.content || '')
    : '';
}

function describeAiError(err) {
  const msg = (err && err.message) || String(err);
  if (msg === 'NO_KEY') return 'No API key set. Open [ ⚙ AI ] and paste your DeepSeek key.';
  if (msg === 'NETWORK') return 'Request blocked (likely CORS) or network failure. Serve this page over http(s), or set the Base URL to your own proxy in [ ⚙ AI ].';
  if (msg.startsWith('HTTP 401')) return 'API rejected the key (401). Double-check it in [ ⚙ AI ].';
  if (msg.startsWith('HTTP 402')) return 'DeepSeek reports insufficient balance (402). Top up or use the free grant.';
  if (msg.startsWith('HTTP 429')) return 'Rate limited (429). Wait a moment and retry.';
  return msg;
}

async function testAiConnection() {
  aiSettings = readAiSettingsForm();   // test against current form values
  saveAiSettings(aiSettings);
  aiSettingsStatus.className = 'ai-status loading';
  aiSettingsStatus.textContent = '… contacting ' + (aiSettings.baseUrl || DEFAULT_AI_BASE) + ' …';
  try {
    const reply = await deepseekChat(
      [{ role: 'user', content: 'Reply with exactly: OK' }],
      { maxTokens: 8, temperature: 0 }
    );
    aiSettingsStatus.className = 'ai-status ok';
    aiSettingsStatus.textContent = '✓ Connected. Model replied: ' + reply.trim().slice(0, 40);
  } catch (err) {
    aiSettingsStatus.className = 'ai-status err';
    aiSettingsStatus.textContent = '✗ ' + describeAiError(err);
  }
}

// --- Build recommendations ---
let currentSuggestions = [];
let currentSuggestBuildId = null;

function buildAiContext(b) {
  const committed = b.items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const currentParts = b.items.map(i => ({
    name: i.name, qty: i.qty || 1, price: i.price || 0, acquired: !!i.acquired
  }));
  // Owned parts the model may reuse (capped to keep the prompt small).
  const inventory = parts.slice(0, 80).map(p => ({
    name: p.name, category: p.category, qty: p.qty || 1, marketValue: p.marketValue || 0
  }));
  const graveyardParts = graveyard.slice(0, 40).map(p => ({ name: p.name, category: p.category }));
  return {
    build: { name: b.name, notes: b.notes || '', budget: b.budget || 0, committed },
    currentParts, inventory, graveyard: graveyardParts
  };
}

async function suggestParts(buildId) {
  const b = builds.find(x => x.id === buildId);
  if (!b) return;
  if (!aiConfigured()) {
    showToast('Set your DeepSeek key in [ ⚙ AI ] first');
    openAiSettings();
    return;
  }

  currentSuggestBuildId = buildId;
  currentSuggestions = [];
  aiSuggestBuildName.textContent = '// ' + b.name;
  aiSuggestBody.innerHTML = `<div class="ai-suggest-loading">⚡ QUERYING DEEPSEEK<span class="blink">_</span><br><span class="hint">Analysing budget, current parts &amp; your inventory…</span></div>`;
  aiSuggestModal.classList.remove('hidden');

  const ctx = buildAiContext(b);
  const remaining = (ctx.build.budget || 0) - ctx.build.committed;

  const system = 'You are a PC hardware build advisor inside an inventory app called PART_VAULT. ' +
    'You recommend components to complete or improve a PC build. Prefer parts the user already owns ' +
    '(listed under inventory/graveyard) when they fit, to save money. Respect the budget. ' +
    'Check basic compatibility (CPU socket, RAM type DDR4/DDR5, PSU wattage, motherboard form factor). ' +
    'Respond ONLY with minified valid JSON, no markdown, no commentary.';

  const user = 'Build context as JSON:\n' + JSON.stringify(ctx) +
    `\n\nRemaining budget: $${remaining.toFixed(2)} (0 or negative means none left / over).` +
    '\nSuggest up to 6 parts to add so this becomes a complete, balanced, compatible build within the remaining budget. ' +
    'Set "source" to "inventory" when a suggestion matches (or closely matches) a part in the user\'s inventory/graveyard, otherwise "online". ' +
    'Respond as JSON of exactly this shape: ' +
    '{"notes":"one short sentence on compatibility/budget","suggestions":[{"name":"","category":"","source":"inventory|online","estPrice":0,"reason":"short"}]}';

  try {
    const raw = await deepseekChat(
      [{ role: 'system', content: system }, { role: 'user', content: user }],
      { json: true, maxTokens: 1400 }
    );
    const parsed = parseSuggestions(raw);
    currentSuggestions = parsed.suggestions || [];
    renderSuggestions(parsed);
  } catch (err) {
    aiSuggestBody.innerHTML =
      `<div class="ai-suggest-error">✗ ${escapeHtml(describeAiError(err))}</div>
       <div class="ai-suggest-actions"><button class="btn-test" onclick="openAiSettings()">[ ⚙ OPEN AI SETTINGS ]</button></div>`;
  }
}

function parseSuggestions(raw) {
  if (!raw) return { suggestions: [], notes: '' };
  let txt = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(txt);
  } catch {
    const m = txt.match(/\{[\s\S]*\}/);   // salvage the first {...} block
    if (m) { try { return JSON.parse(m[0]); } catch {} }
    return { suggestions: [], notes: '', _rawError: txt.slice(0, 200) };
  }
}

function renderSuggestions(parsed) {
  const list = parsed.suggestions || [];
  if (list.length === 0) {
    aiSuggestBody.innerHTML = `<div class="ai-suggest-error">No suggestions returned.${parsed._rawError ? ' Raw: ' + escapeHtml(parsed._rawError) : ''}</div>`;
    return;
  }
  const notes = parsed.notes ? `<div class="ai-suggest-notes">&gt; ${escapeHtml(parsed.notes)}</div>` : '';
  const cards = list.map((s, idx) => {
    const src = (s.source === 'inventory') ? 'inventory' : 'online';
    const price = parseFloat(s.estPrice) || 0;
    return `
      <div class="ai-suggestion">
        <div class="ai-suggestion-main">
          <div class="ai-suggestion-top">
            <span class="ai-suggestion-name">${escapeHtml(s.name || 'Unknown part')}</span>
            <span class="src-badge src-${src}">${src === 'inventory' ? '📦 OWNED' : '🛒 BUY'}</span>
            ${s.category ? `<span class="ai-suggestion-cat">${escapeHtml(String(s.category))}</span>` : ''}
          </div>
          <div class="ai-suggestion-reason">${escapeHtml(s.reason || '')}</div>
        </div>
        <div class="ai-suggestion-side">
          <span class="ai-suggestion-price" id="aiprice-${idx}">${price ? '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}</span>
          <div class="ai-suggestion-btns">
            <button class="ai-ebay-btn" onclick="ebayPriceForSuggestion(${idx})" title="Check real eBay price">⟳ eBay</button>
            <button class="ai-add-btn" onclick="addSuggestionToBuild(${idx})">[ + ADD ]</button>
          </div>
        </div>
      </div>`;
  }).join('');
  aiSuggestBody.innerHTML = notes +
    `<div class="ai-suggestions-list">${cards}</div>` +
    `<div class="ai-suggest-footer hint">&gt; Estimates are approximate — verify current prices before buying.</div>`;
}

function addSuggestionToBuild(idx) {
  const s = currentSuggestions[idx];
  const b = builds.find(x => x.id === currentSuggestBuildId);
  if (!s || !b) return;

  const src = (s.source === 'inventory') ? 'inventory' : 'online';
  const price = parseFloat(s.estPrice) || 0;
  const now = new Date().toISOString();

  // If it claims to be an owned part, try to match a real inventory item for an accurate price.
  let matched = null;
  if (src === 'inventory') {
    const needle = String(s.name || '').toLowerCase();
    matched = parts.find(p => p.name.toLowerCase() === needle) ||
              parts.find(p => needle && (p.name.toLowerCase().includes(needle) || needle.includes(p.name.toLowerCase())));
  }

  const item = {
    id: generateId(),
    name: matched ? matched.name : (s.name || 'Unknown part'),
    link: src === 'online'
      ? sanitizeLink('https://www.google.com/search?q=' + encodeURIComponent((s.name || '') + ' price'))
      : '',
    price: matched ? (matched.price || 0) : price,
    qty: 1,
    acquired: !!matched,
    dateAdded: now
  };
  if (matched) { item.sourcePartId = matched.id; item.dateAcquired = now; }

  b.items.push(item);
  saveBuilds(builds);
  render();
  showToast(`✓ Added "${item.name}" to ${b.name}`);

  // Mark the suggestion as added in the open modal.
  const btns = aiSuggestBody.querySelectorAll('.ai-add-btn');
  if (btns[idx]) { btns[idx].textContent = '[ ✓ ADDED ]'; btns[idx].disabled = true; btns[idx].classList.add('added'); }
}

function closeAiSuggest() {
  aiSuggestModal.classList.add('hidden');
}

aiSuggestModal.addEventListener('click', (e) => {
  if (e.target === aiSuggestModal) closeAiSuggest();
});

// ============================================
// --- eBay price lookup (via your proxy) ---
// ============================================

function loadEbaySettings() {
  try {
    return JSON.parse(localStorage.getItem('partvault_ebay_settings')) || {};
  } catch {
    return {};
  }
}

function saveEbaySettings(s) {
  localStorage.setItem('partvault_ebay_settings', JSON.stringify(s));
}

const ebayProxyUrlInput = document.getElementById('ebayProxyUrl');
const ebayMarketplaceInput = document.getElementById('ebayMarketplace');
const ebaySettingsStatus = document.getElementById('ebaySettingsStatus');
const ebayLookupNote = document.getElementById('ebayLookupNote');

function ebayConfigured() {
  return !!(ebaySettings && ebaySettings.proxyUrl);
}

const money2 = v => '$' + (Number(v) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

// Query the proxy for price stats on a search term.
async function ebayLookup(query) {
  if (!ebayConfigured()) throw new Error('NO_PROXY');
  const base = ebaySettings.proxyUrl.replace(/\/+$/, '');
  const market = ebaySettings.marketplace || 'EBAY_US';
  const url = `${base}/price?q=${encodeURIComponent(query)}&marketplace=${encodeURIComponent(market)}`;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('NETWORK');
  }
  if (!res.ok) {
    let d = ''; try { d = (await res.text()).slice(0, 200); } catch {}
    throw new Error(`HTTP ${res.status}${d ? ': ' + d : ''}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(String(data.error));
  return data;  // { query, currency, count, min, max, median, avg, samples }
}

function describeEbayError(err) {
  const msg = (err && err.message) || String(err);
  if (msg === 'NO_PROXY') return 'No eBay proxy URL set. Add one in [ ⚙ SETTINGS ] (see proxy/README.md).';
  if (msg === 'NETWORK') return 'Could not reach the proxy. Is it running, and is the URL correct?';
  return msg;
}

async function testEbayConnection() {
  ebaySettings = {
    proxyUrl: ebayProxyUrlInput.value.trim(),
    marketplace: ebayMarketplaceInput.value.trim()
  };
  saveEbaySettings(ebaySettings);
  ebaySettingsStatus.className = 'ai-status loading';
  ebaySettingsStatus.textContent = '… querying eBay for "RTX 4070" …';
  try {
    const r = await ebayLookup('RTX 4070');
    ebaySettingsStatus.className = 'ai-status ok';
    ebaySettingsStatus.textContent = `✓ Connected. ${r.count || 0} listings, median ${money2(r.median)} ${r.currency || ''}`;
  } catch (err) {
    ebaySettingsStatus.className = 'ai-status err';
    ebaySettingsStatus.textContent = '✗ ' + describeEbayError(err);
  }
}

// Fill the edit-part Market Value from eBay (median of active listings).
async function fetchEbayMarketValue() {
  const name = editNameInput.value.trim();
  if (!name) { showToast('Enter a part name first'); return; }
  if (!ebayConfigured()) { showToast('Set the eBay proxy in [ ⚙ SETTINGS ] first'); openAiSettings(); return; }
  ebayLookupNote.className = 'ebay-note loading';
  ebayLookupNote.textContent = '… looking up eBay …';
  try {
    const r = await ebayLookup(name);
    if (!r.count) {
      ebayLookupNote.className = 'ebay-note err';
      ebayLookupNote.textContent = 'No eBay listings found for that name.';
      return;
    }
    editMarketValueInput.value = r.median;
    ebayLookupNote.className = 'ebay-note ok';
    ebayLookupNote.textContent = `median of ${r.count} active listings (${money2(r.min)}–${money2(r.max)} ${r.currency})`;
  } catch (err) {
    ebayLookupNote.className = 'ebay-note err';
    ebayLookupNote.textContent = '✗ ' + describeEbayError(err);
  }
}

// Replace an AI suggestion's estimate with a real eBay median (also used on add).
async function ebayPriceForSuggestion(idx) {
  const s = currentSuggestions[idx];
  if (!s) return;
  if (!ebayConfigured()) { showToast('Set the eBay proxy in [ ⚙ SETTINGS ] first'); openAiSettings(); return; }
  const priceEl = document.getElementById('aiprice-' + idx);
  const prev = priceEl ? priceEl.innerHTML : '';
  if (priceEl) priceEl.textContent = '…';
  try {
    const r = await ebayLookup(s.name || '');
    if (!priceEl) return;
    if (r.count) {
      s.estPrice = r.median;   // so [ + ADD ] uses the real price
      priceEl.innerHTML = `${money2(r.median)} <span class="ebay-tag">eBay ×${r.count}</span>`;
    } else {
      priceEl.innerHTML = prev;
      showToast('No eBay listings found');
    }
  } catch (err) {
    if (priceEl) priceEl.innerHTML = prev;
    showToast('eBay: ' + describeEbayError(err));
  }
}

// --- Init ---
function init() {
  const now = new Date();
  currentDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  render();
}

init();
