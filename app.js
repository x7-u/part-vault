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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- State ---
let parts = loadParts();
let graveyard = loadGraveyard();

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

  editModal.classList.remove('hidden');
}

function closeModal() {
  editModal.classList.add('hidden');
}

editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
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
                return `
                  <tr onclick="openEditModal('${p.id}')">
                    <td><span class="part-name">${escapeHtml(p.name)}</span></td>
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

// --- Init ---
function init() {
  const now = new Date();
  currentDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  render();
}

init();
