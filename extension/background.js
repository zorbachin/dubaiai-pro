chrome.runtime.onInstalled.addListener(() => {
  // Seed default cards on first install
  chrome.storage.local.get('cardOfferTracker', (result) => {
    if (!result.cardOfferTracker) {
      const defaultState = {
        cards: [
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
              dining: 2,
              grocery: 2,
              online: 1,
              travel: 1,
              fuel: 1,
              entertainment: 1,
              electronics: 1,
              health: 1,
              fashion: 1,
              utilities: 1,
              other: 1,
              // Delta-specific: 3x on Delta purchases (treated as travel subcategory)
              flights: 3,
              hotels: 3,
            },
            offers: []
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
              dining: 1,
              grocery: 1,
              online: 1,
              travel: 5,
              fuel: 1,
              entertainment: 1,
              electronics: 1,
              health: 1,
              fashion: 1,
              utilities: 1,
              other: 1,
              flights: 5,
              hotels: 10,
            },
            offers: []
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
              dining: 2,
              grocery: 1,
              online: 1,
              travel: 1,
              fuel: 2,
              entertainment: 1,
              electronics: 1,
              health: 1,
              fashion: 1,
              utilities: 1,
              other: 1,
              flights: 2,
              hotels: 1,
            },
            offers: []
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
              dining: 3,
              grocery: 1,
              online: 1,
              travel: 3,
              fuel: 1,
              entertainment: 1,
              electronics: 1,
              health: 1,
              fashion: 1,
              utilities: 1,
              other: 1,
              flights: 3,
              hotels: 3,
            },
            offers: []
          }
        ]
      };
      chrome.storage.local.set({ cardOfferTracker: defaultState });
    }
  });
});
