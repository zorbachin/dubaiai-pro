/* ──────────────────────────────────────────────
   Constants
────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'dining',        label: 'Dining' },
  { id: 'grocery',       label: 'Grocery' },
  { id: 'online',        label: 'Online Shopping' },
  { id: 'travel',        label: 'Travel' },
  { id: 'flights',       label: 'Flights' },
  { id: 'hotels',        label: 'Hotels' },
  { id: 'fuel',          label: 'Fuel & Transport' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'electronics',   label: 'Electronics' },
  { id: 'health',        label: 'Health & Pharmacy' },
  { id: 'fashion',       label: 'Fashion' },
  { id: 'utilities',     label: 'Utilities' },
  { id: 'other',         label: 'Other' },
];

const CARD_COLORS = [
  '#1a2456', '#0f3460', '#1a4a2e', '#4a1a2a',
  '#2a1a4a', '#1a3a4a', '#3a2a10', '#2a2a2a',
];

const BANK_LABELS = {
  amex:        'Amex Offers',
  capitalone:  'Capital One',
  chase:       'Chase Offers',
  citi:        'Citi Offers',
};

// Known shopping/travel sites → auto-fill optimizer
const SHOPPING_SITES = [
  // Online retail
  { host: 'amazon.com',          merchant: 'Amazon',           category: 'online' },
  { host: 'bestbuy.com',         merchant: 'Best Buy',         category: 'electronics' },
  { host: 'target.com',          merchant: 'Target',           category: 'grocery' },
  { host: 'walmart.com',         merchant: 'Walmart',          category: 'grocery' },
  { host: 'costco.com',          merchant: 'Costco',           category: 'grocery' },
  { host: 'samsclub.com',        merchant: "Sam's Club",       category: 'grocery' },
  { host: 'ebay.com',            merchant: 'eBay',             category: 'online' },
  { host: 'etsy.com',            merchant: 'Etsy',             category: 'online' },
  { host: 'apple.com',           merchant: 'Apple',            category: 'electronics' },
  { host: 'samsung.com',         merchant: 'Samsung',          category: 'electronics' },
  // Airlines
  { host: 'delta.com',           merchant: 'Delta',            category: 'flights' },
  { host: 'aa.com',              merchant: 'American Airlines',category: 'flights' },
  { host: 'united.com',          merchant: 'United',           category: 'flights' },
  { host: 'southwest.com',       merchant: 'Southwest',        category: 'flights' },
  { host: 'jetblue.com',         merchant: 'JetBlue',          category: 'flights' },
  { host: 'spirit.com',          merchant: 'Spirit',           category: 'flights' },
  // Hotels
  { host: 'marriott.com',        merchant: 'Marriott',         category: 'hotels' },
  { host: 'hilton.com',          merchant: 'Hilton',           category: 'hotels' },
  { host: 'hyatt.com',           merchant: 'Hyatt',            category: 'hotels' },
  { host: 'ihg.com',             merchant: 'IHG',              category: 'hotels' },
  { host: 'wyndham.com',         merchant: 'Wyndham',          category: 'hotels' },
  { host: 'choicehotels.com',    merchant: 'Choice Hotels',    category: 'hotels' },
  // Travel
  { host: 'expedia.com',         merchant: 'Expedia',          category: 'travel' },
  { host: 'booking.com',         merchant: 'Booking.com',      category: 'hotels' },
  { host: 'airbnb.com',          merchant: 'Airbnb',           category: 'hotels' },
  { host: 'kayak.com',           merchant: 'Kayak',            category: 'travel' },
  { host: 'priceline.com',       merchant: 'Priceline',        category: 'travel' },
  // Dining
  { host: 'doordash.com',        merchant: 'DoorDash',         category: 'dining' },
  { host: 'ubereats.com',        merchant: 'Uber Eats',        category: 'dining' },
  { host: 'grubhub.com',         merchant: 'Grubhub',          category: 'dining' },
  { host: 'seamless.com',        merchant: 'Seamless',         category: 'dining' },
  { host: 'opentable.com',       merchant: 'OpenTable',        category: 'dining' },
  // Transport
  { host: 'uber.com',            merchant: 'Uber',             category: 'fuel' },
  { host: 'lyft.com',            merchant: 'Lyft',             category: 'fuel' },
  // Grocery / Health
  { host: 'instacart.com',       merchant: 'Instacart',        category: 'grocery' },
  { host: 'wholefoodsmarket.com',merchant: 'Whole Foods',      category: 'grocery' },
  { host: 'freshdirect.com',     merchant: 'FreshDirect',      category: 'grocery' },
  { host: 'cvs.com',             merchant: 'CVS',              category: 'health' },
  { host: 'walgreens.com',       merchant: 'Walgreens',        category: 'health' },
  { host: 'riteaid.com',         merchant: 'Rite Aid',         category: 'health' },
  // Fashion
  { host: 'nordstrom.com',       merchant: 'Nordstrom',        category: 'fashion' },
  { host: 'sephora.com',         merchant: 'Sephora',          category: 'fashion' },
  { host: 'macys.com',           merchant: "Macy's",           category: 'fashion' },
  { host: 'gap.com',             merchant: 'Gap',              category: 'fashion' },
  { host: 'nike.com',            merchant: 'Nike',             category: 'fashion' },
];

function detectShoppingSite(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return SHOPPING_SITES.find(s => host === s.host || host.endsWith('.' + s.host)) || null;
  } catch { return null; }
}

/* ──────────────────────────────────────────────
   State
────────────────────────────────────────────── */
let state = { cards: [] };
let detectedOffers = [];
let selectedOfferIndices = new Set();
let offerActivated = true;
let selectedColor = CARD_COLORS[0];

/* ──────────────────────────────────────────────
   Storage
────────────────────────────────────────────── */
function loadState(cb) {
  chrome.storage.local.get('cardOfferTracker', (result) => {
    if (result.cardOfferTracker) state = result.cardOfferTracker;
    // Ensure cards exist (resilient to service worker not having seeded)
    if (!state.cards || state.cards.length === 0) {
      chrome.storage.local.set({ cardOfferTracker: state });
    }
    cb();
  });
}

function saveState(cb) {
  chrome.storage.local.set({ cardOfferTracker: state }, cb);
}

/* ──────────────────────────────────────────────
   Tabs
────────────────────────────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${name}`));
}

/* ──────────────────────────────────────────────
   Utilities
────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function today() { return new Date().toISOString().split('T')[0]; }
function daysUntil(d) {
  if (!d) return Infinity;
  return Math.ceil((new Date(d) - new Date(today())) / 86400000);
}
function formatDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ──────────────────────────────────────────────
   Card / Offer CRUD
────────────────────────────────────────────── */
function addCard(card) { card.id = uid(); card.offers = []; state.cards.push(card); }
function updateCard(id, u) {
  const i = state.cards.findIndex(c => c.id === id);
  if (i !== -1) state.cards[i] = { ...state.cards[i], ...u };
}
function deleteCard(id) { state.cards = state.cards.filter(c => c.id !== id); }
function addOffer(cardId, offer) {
  const card = state.cards.find(c => c.id === cardId);
  if (card) { offer.id = uid(); card.offers.push(offer); }
}
function updateOffer(cardId, offerId, u) {
  const card = state.cards.find(c => c.id === cardId);
  if (!card) return;
  const i = card.offers.findIndex(o => o.id === offerId);
  if (i !== -1) card.offers[i] = { ...card.offers[i], ...u };
}
function deleteOffer(cardId, offerId) {
  const card = state.cards.find(c => c.id === cardId);
  if (card) card.offers = card.offers.filter(o => o.id !== offerId);
}

/* ──────────────────────────────────────────────
   Cards rendering
────────────────────────────────────────────── */
function renderCards() {
  const c = document.getElementById('cardsContainer');
  if (!state.cards.length) {
    c.innerHTML = `<div class="empty"><div class="empty-icon">💳</div><p>No cards yet.</p></div>`;
    updateImportCardSelect();
    return;
  }
  c.innerHTML = state.cards.map(card => {
    const active = (card.offers||[]).filter(o => o.activated && daysUntil(o.expiryDate) >= 0).length;
    const offers = (card.offers||[]).map(o => renderOfferRow(card.id, o)).join('');
    const rl = card.rewardType === 'cashback' ? `${card.baseRate}% CB` : `${card.baseRate}× ${card.rewardType}`;
    return `
      <div class="card-widget">
        <div class="card-header" onclick="toggleCard('${card.id}')">
          <div class="card-chip" style="background:${card.color||'#1a2456'}">💳</div>
          <div class="card-meta">
            <div class="card-name">${esc(card.name)}</div>
            <div class="card-sub">${esc(card.issuer||'')} · ${rl}</div>
          </div>
          <span class="badge badge-green">${active}</span>
          <span style="font-size:10px;color:var(--gray-400);margin-left:4px" id="ct-${card.id}">▼</span>
        </div>
        <div class="card-body" id="cb-${card.id}">
          ${offers || `<div style="padding:8px 12px;font-size:12px;color:var(--gray-400)">No offers yet.</div>`}
          <div class="card-footer">
            <button class="btn btn-ghost btn-sm" onclick="openOfferModal('${card.id}')">+ Offer</button>
            <button class="btn btn-ghost btn-sm" onclick="openCardModal('${card.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="doDeleteCard('${card.id}')">Del</button>
          </div>
        </div>
      </div>`;
  }).join('');
  updateImportCardSelect();
}

function renderOfferRow(cardId, offer) {
  const days = daysUntil(offer.expiryDate);
  const expired = days < 0;
  let expHtml = '';
  if (offer.expiryDate) {
    if (expired) expHtml = `<span class="offer-expiry-expired">Expired</span>`;
    else if (days <= 7) expHtml = `<span class="offer-expiry-warn">Exp ${days}d</span>`;
    else expHtml = `Exp ${formatDate(offer.expiryDate)}`;
  }
  const valHtml = offer.type === 'percent_off' ? `<span class="offer-val">${offer.value}% OFF</span>`
    : offer.type === 'fixed_off' ? `<span class="offer-val">$${offer.value} OFF</span>`
    : `<span class="offer-val boost">+${offer.value}% CB</span>`;
  return `
    <div class="offer-row" style="${!offer.activated || expired ? 'opacity:0.5' : ''}">
      <button class="offer-toggle${offer.activated && !expired ? ' on' : ''}"
        onclick="doToggleOffer('${cardId}','${offer.id}')"></button>
      <div class="offer-info">
        <div class="offer-merchant">${offer.merchant ? esc(offer.merchant) : 'Any Store'}</div>
        <div class="offer-detail">${expHtml}</div>
      </div>
      ${valHtml}
      <button class="btn-icon" onclick="openOfferModal('${cardId}','${offer.id}')">✏</button>
      <button class="btn-icon danger" onclick="doDeleteOffer('${cardId}','${offer.id}')">🗑</button>
    </div>`;
}

function updateImportCardSelect() {
  const sel = document.getElementById('importTargetCard');
  const cur = sel.value;
  sel.innerHTML = state.cards.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  if (cur && state.cards.find(c => c.id === cur)) sel.value = cur;
}

function toggleCard(id) {
  const body = document.getElementById(`cb-${id}`);
  const icon = document.getElementById(`ct-${id}`);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (icon) icon.textContent = open ? '▲' : '▼';
}

function doToggleOffer(cardId, offerId) {
  const card = state.cards.find(c => c.id === cardId);
  const offer = card?.offers.find(o => o.id === offerId);
  if (!offer) return;
  offer.activated = !offer.activated;
  saveState(() => { renderCards(); toast(offer.activated ? '✓ Activated' : 'Deactivated', 'success'); });
}

function doDeleteCard(cardId) {
  if (!confirm('Delete this card and all its offers?')) return;
  deleteCard(cardId);
  saveState(() => { renderCards(); toast('Card deleted'); });
}

function doDeleteOffer(cardId, offerId) {
  if (!confirm('Delete this offer?')) return;
  deleteOffer(cardId, offerId);
  saveState(() => { renderCards(); toast('Offer deleted'); });
}

/* ──────────────────────────────────────────────
   Card Modal
────────────────────────────────────────────── */
function buildColorPicker() {
  document.getElementById('colorPicker').innerHTML = CARD_COLORS.map(c => `
    <div class="color-swatch${c === selectedColor ? ' selected' : ''}"
      style="background:${c}" onclick="pickColor('${c}')"></div>`).join('');
}
function pickColor(c) { selectedColor = c; buildColorPicker(); }

function buildMultGrid() {
  document.getElementById('multGrid').innerHTML = CATEGORIES.map(cat => `
    <div class="mult-item">
      <span style="flex:1">${cat.label}</span>
      <input class="mult-input" id="m-${cat.id}" type="number" min="0" step="0.5" value="1">
    </div>`).join('');
}

function togglePointVal() {
  const t = document.getElementById('cardRewardType').value;
  document.getElementById('pointValGroup').style.display = t !== 'cashback' ? '' : 'none';
}

function openCardModal(cardId) {
  selectedColor = CARD_COLORS[0];
  buildColorPicker();
  buildMultGrid();
  document.getElementById('cardId').value = cardId || '';
  document.getElementById('cardModalTitle').textContent = cardId ? 'Edit Card' : 'Add Card';

  if (cardId) {
    const card = state.cards.find(c => c.id === cardId);
    if (card) {
      document.getElementById('cardName').value = card.name || '';
      document.getElementById('cardIssuer').value = card.issuer || '';
      document.getElementById('cardLastFour').value = card.lastFour || '';
      document.getElementById('cardRewardType').value = card.rewardType || 'cashback';
      document.getElementById('cardBaseRate').value = card.baseRate || '';
      document.getElementById('cardPointValue').value = card.pointValue || '';
      selectedColor = card.color || CARD_COLORS[0];
      buildColorPicker(); togglePointVal();
      const m = card.categoryMultipliers || {};
      CATEGORIES.forEach(cat => {
        const el = document.getElementById(`m-${cat.id}`);
        if (el) el.value = m[cat.id] ?? 1;
      });
    }
  } else {
    ['cardName','cardIssuer','cardLastFour','cardBaseRate','cardPointValue'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('cardRewardType').value = 'cashback';
    togglePointVal();
  }
  document.getElementById('cardModal').classList.add('open');
}

function closeCardModal() { document.getElementById('cardModal').classList.remove('open'); }

function saveCard() {
  const name = document.getElementById('cardName').value.trim();
  if (!name) { toast('Name required', 'error'); return; }
  const mults = {};
  CATEGORIES.forEach(cat => {
    const v = parseFloat(document.getElementById(`m-${cat.id}`)?.value);
    mults[cat.id] = isNaN(v) ? 1 : v;
  });
  const data = {
    name, issuer: document.getElementById('cardIssuer').value.trim(),
    lastFour: document.getElementById('cardLastFour').value.replace(/\D/g,'').slice(0,4),
    color: selectedColor,
    rewardType: document.getElementById('cardRewardType').value,
    baseRate: parseFloat(document.getElementById('cardBaseRate').value) || 0,
    pointValue: parseFloat(document.getElementById('cardPointValue').value) || 0.015,
    categoryMultipliers: mults,
  };
  const id = document.getElementById('cardId').value;
  if (id) updateCard(id, data); else addCard(data);
  saveState(() => { renderCards(); closeCardModal(); toast(id ? 'Card updated' : 'Card added', 'success'); });
}

/* ──────────────────────────────────────────────
   Offer Modal
────────────────────────────────────────────── */
function buildCatPills(selected) {
  document.getElementById('offerCatPills').innerHTML = CATEGORIES.map(cat => `
    <label class="pill${selected.includes(cat.id) ? ' checked' : ''}" id="pill-${cat.id}">
      <input type="checkbox" value="${cat.id}" ${selected.includes(cat.id)?'checked':''}
        onchange="flipPill('${cat.id}',this.checked)">
      ${cat.label}
    </label>`).join('');
}
function flipPill(id, checked) {
  document.getElementById(`pill-${id}`)?.classList.toggle('checked', checked);
}
function flipActivated() {
  offerActivated = !offerActivated;
  document.getElementById('offerActivatedToggle').classList.toggle('on', offerActivated);
  document.getElementById('offerActivatedLabel').textContent = offerActivated ? 'Activated' : 'Not activated';
}

function openOfferModal(cardId, offerId, prefill) {
  document.getElementById('offerCardId').value = cardId;
  document.getElementById('offerId').value = offerId || '';
  document.getElementById('offerModalTitle').textContent = offerId ? 'Edit Offer' : 'Add Offer';
  offerActivated = true;

  if (offerId) {
    const card = state.cards.find(c => c.id === cardId);
    const offer = card?.offers.find(o => o.id === offerId);
    if (offer) {
      document.getElementById('offerMerchant').value = offer.merchant || '';
      document.getElementById('offerType').value = offer.type || 'percent_off';
      document.getElementById('offerValue').value = offer.value || '';
      document.getElementById('offerMinSpend').value = offer.minSpend || '';
      document.getElementById('offerMaxDiscount').value = offer.maxDiscount || '';
      document.getElementById('offerExpiry').value = offer.expiryDate || '';
      document.getElementById('offerNotes').value = offer.notes || '';
      offerActivated = !!offer.activated;
      buildCatPills(offer.categories || []);
    }
  } else if (prefill) {
    document.getElementById('offerMerchant').value = prefill.merchant || '';
    document.getElementById('offerType').value = prefill.type || 'percent_off';
    document.getElementById('offerValue').value = prefill.value || '';
    document.getElementById('offerMinSpend').value = prefill.minSpend || '';
    document.getElementById('offerMaxDiscount').value = '';
    document.getElementById('offerExpiry').value = prefill.expiryDate || '';
    document.getElementById('offerNotes').value = prefill.notes || '';
    offerActivated = !!prefill.activated;
    buildCatPills(prefill.categories || []);
  } else {
    ['offerMerchant','offerValue','offerMinSpend','offerMaxDiscount','offerNotes'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('offerType').value = 'percent_off';
    document.getElementById('offerExpiry').value = '';
    buildCatPills([]);
  }
  document.getElementById('offerActivatedToggle').classList.toggle('on', offerActivated);
  document.getElementById('offerActivatedLabel').textContent = offerActivated ? 'Activated' : 'Not activated';
  document.getElementById('offerModal').classList.add('open');
}
function closeOfferModal() { document.getElementById('offerModal').classList.remove('open'); }

function saveOffer() {
  const val = document.getElementById('offerValue').value.trim();
  if (!val) { toast('Value required', 'error'); return; }
  const cats = Array.from(document.querySelectorAll('#offerCatPills input:checked')).map(e => e.value);
  const data = {
    merchant: document.getElementById('offerMerchant').value.trim(),
    type: document.getElementById('offerType').value,
    value: parseFloat(val),
    minSpend: parseFloat(document.getElementById('offerMinSpend').value) || 0,
    maxDiscount: parseFloat(document.getElementById('offerMaxDiscount').value) || null,
    expiryDate: document.getElementById('offerExpiry').value || null,
    notes: document.getElementById('offerNotes').value.trim(),
    categories: cats,
    activated: offerActivated,
  };
  const cardId = document.getElementById('offerCardId').value;
  const offerId = document.getElementById('offerId').value;
  if (offerId) updateOffer(cardId, offerId, data); else addOffer(cardId, data);
  saveState(() => { renderCards(); closeOfferModal(); toast(offerId ? 'Offer updated' : 'Offer added', 'success'); });
}

/* ──────────────────────────────────────────────
   Import / Page Scanner
────────────────────────────────────────────── */
function scanPage() {
  const btn = document.getElementById('scanBtn');
  btn.textContent = '⏳ Scanning…';
  btn.disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) { btn.textContent = '🔍 Scan Page'; btn.disabled = false; return; }

    chrome.tabs.sendMessage(tabs[0].id, { type: 'SCRAPE_OFFERS' }, (resp) => {
      btn.textContent = '🔍 Scan Page';
      btn.disabled = false;

      if (chrome.runtime.lastError || !resp) {
        showImportStatus('error',
          'Cannot scan this page',
          'Navigate to your bank\'s offers section (Amex, Capital One, Chase, or Citi), then try again.');
        return;
      }

      detectedOffers = (resp.offers || []).filter(o => o && o.value > 0);
      selectedOfferIndices = new Set(detectedOffers.map((_, i) => i));

      if (detectedOffers.length === 0) {
        showImportStatus('empty',
          'No offers detected',
          'Try scrolling down so all offers are visible on the page, then scan again.');
      } else {
        renderDetectedOffers();
      }
    });
  });
}

function showImportStatus(type, title, sub) {
  const icons = { error: '⚠️', empty: '🔍', ok: '✓' };
  document.getElementById('importStatus').style.display = '';
  document.getElementById('importStatus').innerHTML = `
    <div class="import-status-icon">${icons[type] || '💳'}</div>
    <div class="import-status-title">${esc(title)}</div>
    <div class="import-status-sub">${esc(sub)}</div>`;
  document.getElementById('detectedOffersSection').style.display = 'none';
}

function renderDetectedOffers() {
  document.getElementById('importStatus').style.display = 'none';
  const section = document.getElementById('detectedOffersSection');
  section.style.display = '';
  document.getElementById('detectedCount').textContent =
    `${detectedOffers.length} offer${detectedOffers.length !== 1 ? 's' : ''} found`;

  const badge = document.getElementById('importBadge');
  badge.style.display = detectedOffers.length ? '' : 'none';
  badge.textContent = detectedOffers.length;

  document.getElementById('detectedOffersList').innerHTML = detectedOffers.map((o, i) => {
    const valLabel = o.type === 'percent_off' ? `${o.value}% off`
      : o.type === 'fixed_off' ? `$${o.value} off`
      : `+${o.value}% cashback`;
    const minLabel = o.minSpend > 0 ? ` · min $${o.minSpend}` : '';
    const expLabel = o.expiryDate ? ` · exp ${formatDate(o.expiryDate)}` : '';
    const sel = selectedOfferIndices.has(i);
    return `
      <div class="detected-offer${sel ? ' selected' : ''}" onclick="toggleOfferSelect(${i})" id="do-${i}">
        <div class="detected-offer-check">${sel ? '✓' : ''}</div>
        <div class="detected-offer-info">
          <div class="detected-offer-merchant">${esc(o.merchant || 'Offer')}</div>
          <div class="detected-offer-value">${valLabel}${minLabel}${expLabel}</div>
          ${o.activated ? `<span class="detected-offer-activated">✓ Activated on card</span>` : ''}
          <div class="detected-offer-raw">${esc(o.rawText || '')}</div>
        </div>
      </div>`;
  }).join('');
}

function toggleOfferSelect(i) {
  if (selectedOfferIndices.has(i)) selectedOfferIndices.delete(i);
  else selectedOfferIndices.add(i);
  const el = document.getElementById(`do-${i}`);
  el?.classList.toggle('selected', selectedOfferIndices.has(i));
  if (el) el.querySelector('.detected-offer-check').textContent = selectedOfferIndices.has(i) ? '✓' : '';
}

function selectAllOffers() {
  detectedOffers.forEach((_, i) => selectedOfferIndices.add(i));
  renderDetectedOffers();
}

function importSelected() {
  const cardId = document.getElementById('importTargetCard').value;
  if (!cardId) { toast('Select a card first', 'error'); return; }
  const toImport = [...selectedOfferIndices].map(i => detectedOffers[i]).filter(Boolean);
  if (!toImport.length) { toast('Nothing selected', 'error'); return; }
  toImport.forEach(o => addOffer(cardId, { ...o, id: undefined }));
  saveState(() => {
    renderCards();
    toast(`✓ Imported ${toImport.length} offer${toImport.length !== 1 ? 's' : ''}`, 'success');
    detectedOffers = []; selectedOfferIndices.clear();
    document.getElementById('importBadge').style.display = 'none';
    showImportStatus('ok', `${toImport.length} offers imported`, 'Go to "My Cards" to review.');
    switchTab('cards');
  });
}

/* ──────────────────────────────────────────────
   Shopping site auto-detection
────────────────────────────────────────────── */
function checkShoppingSite(url) {
  const site = detectShoppingSite(url);
  const banner = document.getElementById('shoppingBanner');
  if (!site || !state.cards.length) { banner.style.display = 'none'; return; }

  const results = state.cards
    .map(card => ({ card, ...calcCard(card, site.merchant, site.category, 0) }))
    .sort((a, b) => b.rate - a.rate); // sort by earn rate since we don't have an amount

  const best = results[0];
  const catLabel = CATEGORIES.find(c => c.id === site.category)?.label || site.category;

  banner.style.display = '';
  banner.innerHTML = `
    <div class="shopping-banner-inner">
      <div class="shopping-banner-left">
        <div class="shopping-banner-site">${esc(site.merchant)}</div>
        <div class="shopping-banner-cat">${esc(catLabel)}</div>
      </div>
      <div class="shopping-banner-card">
        <div class="shopping-chip" style="background:${best.card.color||'#1a2456'}">💳</div>
        <div>
          <div class="shopping-card-name">${esc(best.card.name)}</div>
          <div class="shopping-card-rate">${best.rate.toFixed(1)}× ${best.card.rewardType}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="preloadOptimizer('${esc(site.merchant)}','${site.category}')">
        Optimize →
      </button>
    </div>`;
}

function preloadOptimizer(merchant, category) {
  document.getElementById('optMerchant').value = merchant;
  document.getElementById('optCategory').value = category;
  switchTab('optimizer');
}

/* ──────────────────────────────────────────────
   Optimizer
────────────────────────────────────────────── */
function populateCatDropdown() {
  document.getElementById('optCategory').innerHTML =
    `<option value="">— Category —</option>` +
    CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('');
}

function calcCard(card, merchant, category, amount) {
  const expired = o => o.expiryDate && daysUntil(o.expiryDate) < 0;
  let bestSaving = 0, bestOffer = null;
  for (const o of (card.offers || [])) {
    if (!o.activated || expired(o)) continue;
    const mMatch = !o.merchant || merchant.toLowerCase().includes(o.merchant.toLowerCase())
      || o.merchant.toLowerCase().includes(merchant.toLowerCase());
    const cMatch = !o.categories?.length || o.categories.includes(category);
    if (!mMatch || !cMatch || amount < (o.minSpend || 0)) continue;
    let s = 0;
    if (o.type === 'percent_off') { s = amount * o.value / 100; if (o.maxDiscount) s = Math.min(s, o.maxDiscount); }
    else if (o.type === 'fixed_off') { s = o.value; }
    else { s = amount * o.value / 100; }
    if (s > bestSaving) { bestSaving = s; bestOffer = o; }
  }
  const mult = card.categoryMultipliers?.[category] ?? 1;
  const rate = (card.baseRate || 0) * mult;
  const rewardVal = card.rewardType === 'cashback'
    ? amount * rate / 100
    : amount * rate * (card.pointValue || 0.015);
  return { offerSaving: bestSaving, offer: bestOffer, rewardVal, rate, mult,
    total: bestSaving + rewardVal, effective: amount - bestSaving - rewardVal };
}

function runOptimizer() {
  const merchant = document.getElementById('optMerchant').value.trim();
  const amount = parseFloat(document.getElementById('optAmount').value);
  const category = document.getElementById('optCategory').value;
  if (!amount || isNaN(amount)) { toast('Enter amount', 'error'); return; }
  if (!category) { toast('Select category', 'error'); return; }
  if (!state.cards.length) { toast('Add a card first', 'error'); return; }

  const results = state.cards
    .map(card => ({ card, ...calcCard(card, merchant, category, amount) }))
    .sort((a, b) => b.total - a.total);

  document.getElementById('optimizerResults').innerHTML = `
    <div class="results">${results.map((r, i) => {
      const rank = i + 1;
      const rc = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : 'rank-other';
      const parts = [];
      if (r.offerSaving > 0) parts.push(`<span class="s">Offer −$${r.offerSaving.toFixed(2)}</span>`);
      if (r.rewardVal > 0) parts.push(`<span class="r">${r.card.rewardType} $${r.rewardVal.toFixed(2)}</span>`);
      return `
        <div class="result-item${rank===1?' best':''}">
          <div class="result-rank ${rc}">${rank}</div>
          <div class="result-chip" style="background:${r.card.color||'#1a2456'}">💳</div>
          <div class="result-info">
            <div class="result-name">${esc(r.card.name)}</div>
            <div class="result-breakdown">${parts.join(' · ')||'<span style="color:var(--gray-400)">Base rate only</span>'}</div>
          </div>
          <div class="result-price">
            <div class="result-final">$${r.effective.toFixed(2)}</div>
            ${r.total>0?`<div class="result-save">Save $${r.total.toFixed(2)}</div>`:`<div class="result-nosave">No savings</div>`}
          </div>
        </div>`;
    }).join('')}</div>`;
}

/* ──────────────────────────────────────────────
   Export / Import JSON
────────────────────────────────────────────── */
function exportData() {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'card-offers-backup.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data.cards || !Array.isArray(data.cards)) throw new Error('Invalid format');
        if (!confirm(`Import ${data.cards.length} card(s)? This will replace your current data.`)) return;
        state = data;
        saveState(() => { renderCards(); toast(`✓ Imported ${data.cards.length} cards`, 'success'); });
      } catch (err) {
        toast('Invalid file', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ──────────────────────────────────────────────
   Toast
────────────────────────────────────────────── */
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

/* ──────────────────────────────────────────────
   Modal close
────────────────────────────────────────────── */
['cardModal','offerModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => {
    if (e.target.id === id) id === 'cardModal' ? closeCardModal() : closeOfferModal();
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCardModal(); closeOfferModal(); }
});

/* ──────────────────────────────────────────────
   Init
────────────────────────────────────────────── */
loadState(() => {
  populateCatDropdown();
  renderCards();

  // Detect active tab — check for bank OR shopping site
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    const url = tabs[0].url || '';

    // Bank detection (read from session storage written by background.js)
    chrome.storage.session.get('detectedBank', (result) => {
      const db = result.detectedBank;
      if (db && db.tabId === tabs[0].id && db.bank) {
        const badge = document.getElementById('bankBadge');
        badge.style.display = '';
        badge.textContent = BANK_LABELS[db.bank] || db.bank;
      }
    });

    // Fallback: detect bank from URL directly (for when popup opens before content script fires)
    const bankFromUrl = url.includes('americanexpress') ? 'amex'
      : url.includes('capitalone') ? 'capitalone'
      : url.includes('chase') ? 'chase'
      : url.includes('citi') ? 'citi'
      : null;
    if (bankFromUrl) {
      const badge = document.getElementById('bankBadge');
      badge.style.display = '';
      badge.textContent = BANK_LABELS[bankFromUrl];
    }

    // Shopping site detection
    checkShoppingSite(url);
  });
});
