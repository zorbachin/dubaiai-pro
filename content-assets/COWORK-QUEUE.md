# 🤖 Cowork Task Queue (the browser hands)

_The nucleus is the shared brain. Claude Code (me) prepares the content and writes
the exact steps here. Cowork (the browser agent) reads this, logs into the sites,
and executes, then marks each task done. This is how the browser-only steps
(Substack, Etsy) get automated without me controlling your screen._

**How to run it:** open Cowork, point it at this file, say "run the open tasks in
COWORK-QUEUE.md." It already shares the nucleus, so it has the content.

---

## TASK A — Publish a Zorbasphere issue (Substack)
**Status:** open · **Source file:** `content-assets/newsletter/ISSUE-00X-*.md`
Steps for Cowork:
1. Go to substack.com, ensure logged in as zgrashin.
2. New post → **Text**.
3. Title = the issue's Title. Subtitle = the issue's Subtitle (SEO).
4. Paste the body (everything under the `---`, skipping the publish-settings block and any `[PHOTO/VIDEO]` slots).
5. Upload the cover image (`content-assets/newsletter/dispatch-no-001.png` or the issue's specified cover).
6. For each `[PHOTO: ...]` slot, leave a placeholder note for Zorba to drop the image (Cowork cannot access his local photos).
7. Add the issue's Tags. Set audience = **Everyone**.
8. **Do not hit publish. Leave it as a draft and notify Zorba to review + publish.** (Publishing is the one human approval.)

## TASK B — Create an Etsy digital listing
**Status:** open · **Source:** `etsy-shop/LISTINGS.md` (per product) + `etsy-shop/NN_*.pdf` + `etsy-shop/thumbs/NN_*.png`
Steps for Cowork:
1. Etsy → Shop Manager → Listings → Add a listing.
2. Type = **Digital**. Title, Tags (13), Description, Price = from LISTINGS.md for that product.
3. Upload `thumbs/NN_*.png` as the first photo.
4. Upload the matching `NN_*.pdf` as the digital file.
5. Category = Digital Prints / Templates. Save as **draft** for Zorba to review + publish.

## TASK C — Create the two Etsy discount codes
**Status:** open
Steps for Cowork:
1. Etsy → Shop Manager → Marketing → Sales and discounts → Create a code.
2. Code `DISPATCH15` = 15% off, all items. (For free Substack subscribers.)
3. Code `INSIDER40` = 40% off, all items. (For paid Substack subscribers.)
4. Report both codes back as confirmed.

---

## Queue (what is pending)
- [ ] A: Substack draft of Issue 002 "I Don't Sell AI. I Sell Time." (`ISSUE-002-time-not-ai.md`)
- [ ] A: Substack draft of Issue 003 "The Ring" (`ISSUE-003-the-ring.md`)
- [ ] B: Etsy listing — start with #20 bundle, then the launch shelf (07, 15, 18, 04)
- [ ] C: Create `DISPATCH15` and `INSIDER40`

_When Cowork finishes a task, it should change its Status to done and check the box,
then push a one-line note: `nucleus push "Cowork: <task> done" --from cowork`._
