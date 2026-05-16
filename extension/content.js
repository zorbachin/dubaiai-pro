// Runs on bank offer pages. Detects which bank we're on, scrapes offers,
// and also detects when the user is on a shopping/travel site.

const BANK = (() => {
  const h = location.hostname;
  if (h.includes('americanexpress.com')) return 'amex';
  if (h.includes('capitalone.com'))      return 'capitalone';
  if (h.includes('chase.com'))           return 'chase';
  if (h.includes('citi'))                return 'citi';
  return null;
})();

if (BANK) {
  chrome.runtime.sendMessage({ type: 'BANK_DETECTED', bank: BANK, url: location.href });
}

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg.type === 'SCRAPE_OFFERS') {
    scrapeWithRetry(3, respond);
    return true; // keep channel open
  }
});

// Retry up to `attempts` times with 1.5s gap (handles React SPAs that render late).
function scrapeWithRetry(attempts, respond) {
  const results = scrape();
  if (results.length > 0 || attempts <= 1) {
    respond({ bank: BANK, offers: results });
  } else {
    setTimeout(() => scrapeWithRetry(attempts - 1, respond), 1500);
  }
}

function scrape() {
  if (!BANK) return [];
  try {
    switch (BANK) {
      case 'amex':       return scrapeAmex();
      case 'capitalone': return scrapeCapitalOne();
      case 'chase':      return scrapeChase();
      case 'citi':       return scrapeCiti();
    }
  } catch (e) {
    console.warn('[CardTracker] Scrape error:', e);
    return fallbackScrape();
  }
  return [];
}

/* ── Amex Offers ──────────────────────────────────────────────────────── */
function scrapeAmex() {
  const selectors = [
    '[data-testid="offer-card"]',
    '[class*="OfferCard"]',
    '[class*="offer-card"]',
    '[class*="BenefitCard"]',
    'article[class*="offer"]',
    '[class*="offers-list"] > *',
  ];

  let cards = [];
  for (const sel of selectors) {
    cards = Array.from(document.querySelectorAll(sel));
    if (cards.length > 0) break;
  }

  // Fallback: any element that looks like an offer (contains expiry language)
  if (cards.length === 0) {
    cards = Array.from(document.querySelectorAll('article, section, li, [role="listitem"]'))
      .filter(el => {
        const t = el.textContent;
        return (t.includes('Spend') || t.includes('%') || t.includes('back'))
          && (t.includes('Expires') || t.includes('Ends') || t.includes('Valid'));
      });
  }

  console.log(`[CardTracker] Amex: found ${cards.length} candidate elements`);
  return cards.map(card => extractOffer(card, 'amex')).filter(Boolean);
}

/* ── Capital One ──────────────────────────────────────────────────────── */
function scrapeCapitalOne() {
  const selectors = [
    '[data-testid*="offer"]',
    '[class*="OfferCard"]',
    '[class*="offer-card"]',
    '[class*="merchant-offer"]',
    '[class*="deal-card"]',
    '[class*="DealCard"]',
  ];
  let cards = [];
  for (const sel of selectors) {
    cards = Array.from(document.querySelectorAll(sel));
    if (cards.length > 2) break;
  }
  if (cards.length === 0) {
    cards = Array.from(document.querySelectorAll('li, [role="listitem"], article'))
      .filter(el => {
        const t = el.textContent;
        return (t.includes('%') || t.includes('Save') || t.includes('cash back'))
          && t.length > 20 && t.length < 600;
      });
  }
  console.log(`[CardTracker] CapOne: found ${cards.length} candidate elements`);
  return cards.map(card => extractOffer(card, 'capitalone')).filter(Boolean);
}

/* ── Chase Offers ─────────────────────────────────────────────────────── */
function scrapeChase() {
  const selectors = [
    '[data-testid*="offer"]',
    '[class*="offer"]',
    '[class*="Offer"]',
    '.chase-offer',
    'article',
  ];
  let cards = [];
  for (const sel of selectors) {
    cards = Array.from(document.querySelectorAll(sel));
    if (cards.length > 2) break;
  }
  if (cards.length === 0) {
    cards = Array.from(document.querySelectorAll('[role="listitem"], li'))
      .filter(el => {
        const t = el.textContent;
        return (t.includes('%') || t.includes('Earn') || t.includes('Save') || t.includes('back'))
          && t.includes('Expires') && t.length < 600;
      });
  }
  console.log(`[CardTracker] Chase: found ${cards.length} candidate elements`);
  return cards.map(card => extractOffer(card, 'chase')).filter(Boolean);
}

/* ── Citi ─────────────────────────────────────────────────────────────── */
function scrapeCiti() {
  const cards = Array.from(document.querySelectorAll('[class*="offer"], article, [role="listitem"]'))
    .filter(el => {
      const t = el.textContent;
      return (t.includes('%') || t.includes('Save') || t.includes('earn'))
        && t.length > 20 && t.length < 600;
    });
  console.log(`[CardTracker] Citi: found ${cards.length} candidate elements`);
  return cards.map(card => extractOffer(card, 'citi')).filter(Boolean);
}

/* ── Fallback ─────────────────────────────────────────────────────────── */
function fallbackScrape() {
  return Array.from(document.querySelectorAll('p, li, div'))
    .filter(el => el.children.length === 0)
    .map(el => el.textContent.trim())
    .filter(t => t.length > 20 && t.length < 400
      && (t.includes('%') || t.includes('Spend') || t.includes('back'))
      && (t.includes('Expir') || t.includes('Valid') || t.includes('Ends')))
    .map(t => parseOfferText(t, false, 'unknown'))
    .filter(Boolean);
}

/* ── Extract offer from a DOM card element ────────────────────────────── */
function extractOffer(card, source) {
  const text = card.textContent.replace(/\s+/g, ' ').trim();
  if (text.length < 10) return null;

  // Detect activated state
  const btn = card.querySelector('button');
  const btnText = btn?.textContent?.toLowerCase() ?? '';
  const activated =
    btnText.includes('added') ||
    btnText.includes('enrolled') ||
    btnText.includes('activated') ||
    btn?.getAttribute('aria-pressed') === 'true' ||
    !!card.querySelector('[class*="added"], [class*="enrolled"], [class*="active"], [class*="Added"]');

  return parseOfferText(text, activated, source);
}

/* ── Parse raw text into structured offer ─────────────────────────────── */
function parseOfferText(text, activated, source) {
  if (!text || text.length < 10) return null;

  const lower = text.toLowerCase();

  // Extract percentage
  const pctMatch = text.match(/([\d.]+)\s*%/);
  const pct = pctMatch ? parseFloat(pctMatch[1]) : null;

  // Extract dollar amount
  const dollarMatch = text.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  const dollar = dollarMatch ? parseFloat(dollarMatch[1].replace(',', '')) : null;

  // Classify type
  let type = 'percent_off';
  let value = null;
  if (pct && (lower.includes(' off') || lower.includes('discount'))) {
    type = 'percent_off'; value = pct;
  } else if (pct && (lower.includes('back') || lower.includes('cash back') || lower.includes('cashback'))) {
    type = 'cashback_boost'; value = pct;
  } else if (dollar && (lower.includes('back') || lower.includes('statement') || lower.includes('credit'))) {
    type = 'fixed_off'; value = dollar;
  } else if (pct) {
    type = lower.includes('earn') ? 'cashback_boost' : 'percent_off';
    value = pct;
  } else if (dollar) {
    type = 'fixed_off'; value = dollar;
  }

  if (!value) return null;

  // Min spend
  const minMatch = text.match(/(?:min(?:imum)?|spend)[^$]*\$?([\d,]+)/i)
    || text.match(/\$?([\d,]+)\s+(?:or more|minimum)/i);
  const minSpend = minMatch ? parseFloat(minMatch[1].replace(',', '')) : 0;

  // Expiry
  const datePatterns = [
    /(?:Expires?|Ends?|Valid\s+(?:through|until))[:\s]+(\w+\.?\s+\d{1,2},?\s*\d{4})/i,
    /(?:Expires?|Ends?)[:\s]+(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
  ];
  let expiryDate = null;
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m) {
      const d = new Date(m[1]);
      if (!isNaN(d.getTime())) {
        expiryDate = d.toISOString().split('T')[0];
        break;
      }
    }
  }

  // Merchant name: text before the first offer keyword
  let merchant = '';
  const breakIdx = text.search(/\b(Spend|Get|Earn|Save|Use|Shop|Use\s+your|\$[\d]|[\d]+%)/i);
  if (breakIdx > 2) {
    merchant = text.slice(0, breakIdx).replace(/[^a-zA-Z0-9\s&'.\-]/g, '').trim().slice(0, 40);
  }
  if (!merchant) merchant = text.split(/[\n.]/)[0].trim().slice(0, 40);

  return {
    merchant,
    type,
    value,
    minSpend,
    expiryDate,
    activated,
    source,
    rawText: text.slice(0, 200),
    categories: [],
    notes: '',
  };
}
