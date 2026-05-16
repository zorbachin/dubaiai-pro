# Card Offer Tracker — Chrome Extension

## Install (takes 60 seconds)

1. Open Chrome and go to `chrome://extensions`
2. Toggle **Developer mode** ON (top-right corner)
3. Click **Load unpacked**
4. Navigate to and select the `extension/` folder in this repo
5. The 💳 icon appears in your toolbar — pin it for easy access

---

## How to use

### Import offers from your bank

1. Go to your bank's **offers page** in Chrome:
   - **Amex**: americanexpress.com → Card Benefits → Amex Offers
   - **Capital One**: capitalone.com → Account → Rewards & Benefits
   - **Chase**: chase.com → Account → Chase Offers
   - **Citi**: citibank.com → Account → Offers for You
2. Scroll down so all offers are visible on screen
3. Click the 💳 extension icon → **Scan Page**
4. Review detected offers, select the ones you've activated, choose which card to import to → **Import Selected**

### Shopping site auto-detection

When you're on **Amazon, Delta, Best Buy, Marriott, DoorDash**, or 40+ other sites, the extension automatically shows your best card for that merchant at the top — no typing needed.

### Cart Optimizer (manual)

1. Open the extension → **Optimizer** tab
2. Enter merchant name, category, and cart total
3. Hit **Find Best Card** — cards are ranked by lowest effective price after offers + rewards

### Manage cards & offers

- **My Cards** tab → expand any card → toggle offers on/off
- ↑ Import / ↓ Export buttons let you back up your data as JSON and transfer it between the extension and the web tracker (`card-offers.html`)

---

## Sync with the web tracker (card-offers.html)

The extension and the web page use separate storage. To sync:

1. In the extension → My Cards → **↓ Export** → saves `card-offers-backup.json`
2. Open `card-offers.html` → **↑ Import** → select the JSON file

---

## Badge number

The 💳 icon shows a yellow badge with the count of **offers expiring within 7 days** — your reminder to use them before they're gone.

---

## Troubleshooting

**"Cannot scan this page"** — Make sure you're on the bank's offers section, not the homepage. The offers need to be visible on screen.

**Offers not detected** — Banks use React and load content dynamically. Try: scroll down to load all offers → click Scan again. The scanner retries 3 times with a 1.5s gap.

**Extension disappeared** — Go to `chrome://extensions`, find Card Offer Tracker, and re-enable it.
