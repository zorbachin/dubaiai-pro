#!/usr/bin/env python3
"""
cinema_news : The Dispatch masthead as a vintage NEWSPAPER MOVIE-LISTING.
Two columns split by a center rule (left = the feature, right = the program),
aged paper, double frame, marquee bar. Brand: black/cream/gold.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.getcwd(), "content-assets", "newsletter")
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/truetype/liberation/"
SERIF_B = FD + "LiberationSerif-Bold.ttf"
SERIF_I = FD + "LiberationSerif-Italic.ttf"
SERIF_R = FD + "LiberationSerif-Regular.ttf"
SANS_B = FD + "LiberationSans-Bold.ttf"
PAPER = (247, 242, 230); INK = (26, 24, 20); GOLD = (160, 120, 44); RED = (140, 36, 30)
W, H = 1200, 1000


def F(p, s): return ImageFont.truetype(p, s)


def ctext(d, cx, y, text, font, fill, ls=0):
    if ls == 0:
        w = d.textlength(text, font=font); d.text((cx - w / 2, y), text, font=font, fill=fill); return
    widths = [d.textlength(c, font=font) for c in text]
    total = sum(widths) + ls * (len(text) - 1)
    x = cx - total / 2
    for c, wdt in zip(text, widths):
        d.text((x, y), c, font=font, fill=fill); x += wdt + ls


def ltext(d, x, y, text, font, fill, ls=0):
    if ls == 0:
        d.text((x, y), text, font=font, fill=fill); return
    for c in text:
        d.text((x, y), c, font=font, fill=fill); x += d.textlength(c, font=font) + ls


def wrapw(d, text, font, maxw):
    out, cur = [], ""
    for word in text.split():
        t = (cur + " " + word).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: out.append(cur); cur = word
    if cur: out.append(cur)
    return out


def rule(d, x1, x2, y, w=2, fill=INK): d.rectangle([x1, y, x2, y + w], fill=fill)
def vrule(d, x, y1, y2, w=2, fill=INK): d.rectangle([x, y1, x + w, y2], fill=fill)


def glasses(d, cx, cy, sc, color=GOLD, wd=2):
    r = int(18 * sc); g = int(5 * sc); w = max(2, int(wd * sc))
    d.ellipse([cx - g - 2 * r, cy - r, cx - g, cy + r], outline=color, width=w)
    d.ellipse([cx + g, cy - r, cx + g + 2 * r, cy + r], outline=color, width=w)
    d.line([(cx - g, cy), (cx + g, cy)], fill=color, width=w)


def build(presents, title_lines, tagline, billing, dateline, cta, fname, masthead="THE DISPATCH"):
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    for i in range(36):
        d.rectangle([i, i, W - i, H - i], outline=(238 - i // 2, 232 - i // 2, 218 - i // 2))
    d.rectangle([40, 40, W - 40, H - 40], outline=INK, width=6)
    d.rectangle([58, 58, W - 58, H - 58], outline=INK, width=2)
    cx = W // 2

    # ---- MASTHEAD (full width) ----
    ctext(d, cx, 92, dateline.upper(), F(SANS_B, 20), INK, ls=6)
    rule(d, 90, W - 90, 128, 3)
    rule(d, 90, W - 90, 136, 1)
    ctext(d, cx, 150, masthead, F(SERIF_B, 70), INK, ls=8)
    ctext(d, cx, 232, "A LET AI DO IT PICTURE", F(SERIF_I, 24), GOLD)
    glasses(d, cx, 266, 0.8, GOLD, 3)
    rule(d, 90, W - 90, 290, 1)
    rule(d, 90, W - 90, 296, 3)

    # ---- TWO COLUMNS, split down the middle ----
    top = 312
    bot = H - 250
    vrule(d, cx, top, bot, 2)
    rule(d, 90, W - 90, top - 6, 1)

    # LEFT: the feature
    lx = 104
    lw = cx - 40 - lx
    y = top + 24
    ltext(d, lx, y, presents.upper(), F(SANS_B, 18), RED, ls=4); y += 40
    tf = F(SERIF_B, 78)
    for ln in title_lines:
        for w in wrapw(d, ln, tf, lw):
            d.text((lx, y), w, font=tf, fill=INK); y += 86
    y += 6
    d.polygon([(lx, y + 6), (lx + 14, y - 2), (lx + 28, y + 6), (lx + 14, y + 14)], fill=GOLD)
    rule(d, lx + 38, cx - 40, y + 6, 2); y += 34
    itf = F(SERIF_I, 26)
    for ln in tagline:
        for w in wrapw(d, ln, itf, lw):
            d.text((lx, y), w, font=itf, fill=INK); y += 34
        y += 4
    y += 10
    ltext(d, lx, y, "RATED H, FOR HONEST", F(SANS_B, 15), INK, ls=3)

    # RIGHT: the program / listing
    rxx = cx + 36
    rw = (W - 90) - rxx
    y = top + 24
    ltext(d, rxx, y, "THE PROGRAM", F(SANS_B, 18), RED, ls=4); y += 40
    bf = F(SERIF_B, 30)
    for item in billing:
        d.text((rxx, y + 6), "✦", font=F(SERIF_B, 20), fill=GOLD)
        for i, w in enumerate(wrapw(d, item, bf, rw - 34)):
            d.text((rxx + 34, y), w, font=bf, fill=INK); y += 36
        y += 14
    y += 6
    rule(d, rxx, W - 90, y, 1); y += 18
    ltext(d, rxx, y, "RUN TIME: ONE HONEST READ", F(SERIF_R, 18), INK); y += 30
    ltext(d, rxx, y, "WRITTEN, SHOT, AND LIVED", F(SERIF_R, 18), INK); y += 24
    ltext(d, rxx, y, "BY ZORBA", F(SERIF_R, 18), INK); y += 40
    # admit-one stamp
    d.rectangle([rxx, y, rxx + 250, y + 64], outline=RED, width=3)
    ctext(d, rxx + 125, y + 12, "ADMIT ONE", F(SANS_B, 26), RED, ls=4)
    ctext(d, rxx + 125, y + 42, "NO. 001", F(SANS_B, 14), RED, ls=3)

    # ---- BOTTOM MARQUEE (full width) ----
    by = H - 226
    d.rectangle([74, by, W - 74, by + 122], fill=INK)
    ctext(d, cx, by + 22, cta.upper(), F(SANS_B, 24), PAPER, ls=6)
    ctext(d, cx, by + 60, "LETAIDOIT.PRO", F(SERIF_B, 50), GOLD, ls=4)
    for (sx, sy) in [(92, 92), (W - 116, 92), (92, H - 150), (W - 116, H - 150)]:
        d.text((sx, sy), "✦", font=F(SERIF_B, 36), fill=GOLD)
    ctext(d, cx, H - 92, "PRINTED FOR A SELECT READERSHIP", F(SANS_B, 16), INK, ls=4)
    img.save(os.path.join(OUT, fname)); print("  ●", fname)


if __name__ == "__main__":
    print("\U0001F3AC cinematic newspaper listing →", OUT)
    build(
        presents="Now Showing",
        title_lines=["The First", "Call"],
        tagline=["The real story behind Let AI Do It.",
                 "From a sublet, to a shelter, to the first call."],
        billing=["Sunset at the Duomo", "Weddings and Wartime",
                 "Mission Possible: AI"],
        dateline="Vol. I  ·  The Premiere Issue  ·  2026",
        cta="Now Showing At",
        fname="dispatch-no-001.png",
        masthead="ZORBASPHERE",
    )
    print("done.")
