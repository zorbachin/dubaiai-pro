// Detects which bank site we're on and scrapes visible offers from the page.
// Sends results back to popup via chrome.runtime messaging.

const BANK = (() => {
  const h = location.hostname;
  if (h.includes('americanexpress.com')) return 'amex';
  if (h.includes('capitalone.com'))      return 'capitalone';
  if (h.includes('chase.com'))           return 'chase';
  if (h.includes('citi'))                return 'citi';
  return null;
})();

// Notify popup which bank we're on as soon as content script loads
chrome.runtime.sendMessage({ type: 'BANK_DETECTED', bank: BANK, url: location.href });

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg.type === 'SCRAPE_OFFERS') {
    const offers = scrape();
    respond({ bank: BANK, offers });
  }
  return true; // keep channel open for async
});

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
    return fallbackScrape();
  }
  return [];
}

/* ── Amex Offers ─────────────────────────────────────────────────────── */
// americanexpress.com/en-us/benefits/offers/
function scrapeAmex() {
  const results = [];

  // Amex renders offers in card containers — try multiple selector patterns
  // as their class names can change with deploys.
  const selectors = [
    '[data-testid="offer-card"]',
    '[class*="OfferCard"]',
    '[class*="offer-card"]',
    '.offer-card',
    'article[class*="offer"]',
    '[class*="BenefitCard"]',
  ];

  let cards = [];
  for (const sel of selectors) {
    cards = Array.from(document.querySelectorAll(sel));
    if (cards.length > 0) break;
  }

  // Fallback: any article or section that contains expiration text
  if (cards.length === 0) {
    cards = Array.from(document.querySelectorAll('article, section, li, [role="listitem"]'))
      .filter(el => {
        const t = el.textContent;
        return (t.includes('Spend') || t.includes('%') || t.includes('back'))
          && (t.includes('Expires') || t.includes('Ends') || t.includes('Valid'));
      });
  }

  for (const card of cards) {
    const text = card.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 10) continue;

    // Detect activated state: button says "Added" / "Added to Card" or is aria-pressed
    const btn = card.querySelector('button');
    const btnText = btn?.textContent?.toLowerCase() ?? '';
    const activated =
      btnText.includes('added') ||
      btnText.includes('enrolled') ||
      btn?.getAttribute('aria-pressed') === 'true' ||
      !!card.querySelector('[class*="added"], [class*="enrolled"], [class*="active"]');

    results.push(parseOfferText(text, activated, 'amex'));
  }

  return results.filter(Boolean);
}

/* ── Capital One ──────────────────────────────────────────────────────── */
// capitalone.com — Venture X offers appear under account > rewards/offers
function scrapeCapitalOne() {
  const results = [];

  const selectors = [
    '[data-testid*="offer"]',
    '[class*="OfferCard"]',
    '[class*="offer-card"]',
    '[class*="merchant-offer"]',
    'article',
    '[class*="deal-card"]',
  ];

  let cards = [];
  for (const sel of selectors) {
    cards = Array.from(document.querySelectorAll(sel));
    if (cards.length > 2) break;
  }

  if (cards.length === 0) {
    cards = Array.from(document.querySelectorAll('li, [role="listitem"]'))
      .filter(el => {
        const t = el.textContent;
        return (t.includes('%') || t.includes('Save') || t.includes('cash back'))
          && t.length > 20 && t.length < 600;
      });
  }

  for (const card of cards) {
    const text = card.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 10) continue;
    const btn = card.querySelector('button');
    const btnText = btn?.textContent?.toLowerCase() ?? '';
    const activated =
      btnText.includes('activated') ||
      btnText.includes('enrolled') ||
      btnText.includes('added') ||
      !!card.querySelector('[class*="active"], [class*="enrolled"]');

    results.push(parseOfferText(text, activated, 'capitalone'));
  }

  return results.filter(Boolean);
}

/* ── Chase Offers ─────────────────────────────────────────────────────── */
function scrapeChase() {
  const results = [];

  const selectors = [
    '[data-testid*="offer"]',
    '[class*="offer"]',
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

  for (const card of cards) {
    const text = card.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 10) continue;
    const btn = card.querySelector('button');
    const btnText = btn?.textContent?.toLowerCase() ?? '';
    const activated = btnText.includes('added') || btnText.includes('activated');
    results.push(parseOfferText(text, activated, 'chase'));
  }

  return results.filter(Boolean);
}

/* ── Citi Offers ──────────────────────────────────────────────────────── */
function scrapeCiti() {
  const results = [];

  let cards = Array.from(document.querySelectorAll('[class*="offer"], article, [role="listitem"]'))
    .filter(el => {
      const t = el.textContent;
      return (t.includes('%') || t.includes('Save') || t.includes('earn'))
        && t.length > 20 && t.length < 600;
    });

  for (const card of cards) {
    const text = card.textContent.replace(/\s+/g, ' ').trim();
    if (text.length < 10) continue;
    const activated = !!card.querySelector('[class*="active"], [class*="added"]');
    results.push(parseOfferText(text, activated, 'citi'));
  }

  return results.filter(Boolean);
}

/* ── General fallback ────────────────────────────────────────────────── */
function fallbackScrape() {
  const chunks = Array.from(document.querySelectorAll('p, li, div, span'))
    .filter(el => el.children.length === 0) // leaf text nodes only
    .map(el => el.textContent.trim())
    .filter(t => t.length > 20 && t.length < 400
      && (t.includes('%') || t.includes('Spend') || t.includes('back'))
      && (t.includes('Expir') || t.includes('Valid') || t.includes('Ends')));

  return chunks.map(t => parseOfferText(t, false, 'unknown')).filter(Boolean);
}

/* ── Parse raw text into structured offer ────────────────────────────── */
function parseOfferText(text, activated, source) {
  if (!text || text.length < 10) return null;

  // Extract dollar amounts: "$10", "$10.00", "10 dollars"
  const dollarMatch = text.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  const dollar = dollarMatch ? parseFloat(dollarMatch[1].replace(',', '')) : null;

  // Extract percentage
  const pctMatch = text.match(/([\d.]+)\s*%/);
  const pct = pctMatch ? parseFloat(pctMatch[1]) : null;

  // Detect offer type
  let type = 'percent_off';
  let value = null;
  if (pct && (text.toLowerCase().includes('off') || text.toLowerCase().includes('discount'))) {
    type = 'percent_off';
    value = pct;
  } else if (pct && (text.toLowerCase().includes('back') || text.toLowerCase().includes('cashback') || text.toLowerCase().includes('cash back'))) {
    type = 'cashback_boost';
    value = pct;
  } else if (dollar && (text.toLowerCase().includes('back') || text.toLowerCase().includes('statement'))) {
    type = 'fixed_off';
    value = dollar;
  } else if (pct) {
    type = 'percent_off';
    value = pct;
  } else if (dollar) {
    type = 'fixed_off';
    value = dollar;
  }

  if (!value) return null;

  // Extract min spend
  const minMatch = text.match(/(?:min(?:imum)?|spend)\s+\$?([\d,]+)/i)
    || text.match(/\$?([\d,]+)\s+(?:or more|minimum|min spend)/i);
  const minSpend = minMatch ? parseFloat(minMatch[1].replace(',', '')) : 0;

  // Extract expiry date
  const datePatterns = [
    /(?:Expires?|Ends?|Valid\s+(?:through|until))[:\s]+(\w+ \d{1,2},?\s*\d{4})/i,
    /(?:Expires?|Ends?)[:\s]+(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
  ];
  let expiryDate = null;
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m) {
      const d = new Date(m[1]);
      if (!isNaN(d)) {
        expiryDate = d.toISOString().split('T')[0];
        break;
      }
    }
  }

  // Extract merchant name: first meaningful word cluster before the offer description
  // Heuristic: text before first occurrence of "Spend", "Get", "Earn", "Save", "%", "$"
  let merchant = '';
  const merchantBreak = text.search(/\b(Spend|Get|Earn|Save|Use|Shop|\$[\d]|[\d]+%)/i);
  if (merchantBreak > 2) {
    merchant = text.slice(0, merchantBreak).replace(/[^a-zA-Z0-9\s&'.-]/g, '').trim().slice(0, 40);
  }
  // Fallback: first line
  if (!merchant) {
    merchant = text.split(/[\n.]/)[0].slice(0, 40).trim();
  }

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
