const DEFAULT_CARDS = [
  {
    id: 'amex-delta-platinum',
    name: 'Delta SkyMiles Platinum',
    issuer: 'American Express',
    lastFour: '',
    color: '#1a2456',
    rewardType: 'miles',
    baseRate: 1,
    pointValue: 0.012,
    categoryMultipliers: {
      dining: 2, grocery: 2, online: 1, travel: 1, flights: 3,
      hotels: 3, fuel: 1, entertainment: 1, electronics: 1,
      health: 1, fashion: 1, utilities: 1, other: 1,
    },
    offers: [],
  },
  {
    id: 'venture-x',
    name: 'Venture X',
    issuer: 'Capital One',
    lastFour: '',
    color: '#0f3460',
    rewardType: 'miles',
    baseRate: 2,
    pointValue: 0.01,
    categoryMultipliers: {
      dining: 1, grocery: 1, online: 1, travel: 5, flights: 5,
      hotels: 10, fuel: 1, entertainment: 1, electronics: 1,
      health: 1, fashion: 1, utilities: 1, other: 1,
    },
    offers: [],
  },
  {
    id: 'citi-aadvantage',
    name: 'AAdvantage Platinum Select',
    issuer: 'Citi / American Airlines',
    lastFour: '',
    color: '#1a3a4a',
    rewardType: 'miles',
    baseRate: 1,
    pointValue: 0.015,
    categoryMultipliers: {
      dining: 2, grocery: 1, online: 1, travel: 1, flights: 2,
      hotels: 1, fuel: 2, entertainment: 1, electronics: 1,
      health: 1, fashion: 1, utilities: 1, other: 1,
    },
    offers: [],
  },
  {
    id: 'chase-sapphire-reserve',
    name: 'Sapphire Reserve',
    issuer: 'Chase',
    lastFour: '',
    color: '#2a2a2a',
    rewardType: 'points',
    baseRate: 1,
    pointValue: 0.015,
    categoryMultipliers: {
      dining: 3, grocery: 1, online: 1, travel: 3, flights: 3,
      hotels: 3, fuel: 1, entertainment: 1, electronics: 1,
      health: 1, fashion: 1, utilities: 1, other: 1,
    },
    offers: [],
  },
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('cardOfferTracker', (result) => {
    if (!result.cardOfferTracker) {
      chrome.storage.local.set({ cardOfferTracker: { cards: DEFAULT_CARDS } });
    }
  });
});

// Receive bank detection from content scripts and cache in session storage
// so the popup can read it on open (popup can't have persistent listeners).
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'BANK_DETECTED' && sender.tab) {
    chrome.storage.session.set({ detectedBank: { bank: msg.bank, tabId: sender.tab.id } });
  }
});

// Update extension badge with count of offers expiring within 7 days.
function refreshBadge() {
  chrome.storage.local.get('cardOfferTracker', (result) => {
    const state = result.cardOfferTracker;
    if (!state) return;
    const today = new Date().toISOString().split('T')[0];
    const expiringSoon = state.cards.flatMap(c => c.offers || []).filter(o => {
      if (!o.activated || !o.expiryDate) return false;
      const days = Math.ceil((new Date(o.expiryDate) - new Date(today)) / 86400000);
      return days >= 0 && days <= 7;
    }).length;

    chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
    chrome.action.setBadgeText({ text: expiringSoon > 0 ? String(expiringSoon) : '' });
  });
}

// Refresh badge whenever storage changes.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.cardOfferTracker) refreshBadge();
});

// Refresh badge on startup.
refreshBadge();
