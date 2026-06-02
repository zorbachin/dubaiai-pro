#!/usr/bin/env python3
"""
cinema_news — vintage 'newspaper announces a movie' newsletter masthead.
Aged paper, double-rule frame, dramatic serif billing. Brand: black/cream/gold.
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
W, H = 1200, 1600


def F(p, s): return ImageFont.truetype(p, s)


def ctext(d, cx, y, text, font, fill, ls=0):
    """centered text with optional letter-spacing."""
    if ls == 0:
        w = d.textlength(text, font=font); d.text((cx - w/2, y), text, font=font, fill=fill); return
    widths = [d.textlength(c, font=font) for c in text]
    total = sum(widths) + ls * (len(text) - 1)
    x = cx - total/2
    for c, wdt in zip(text, widths):
        d.text((x, y), c, font=font, fill=fill); x += wdt + ls


def rule(d, x1, x2, y, w=3, fill=INK):
    d.rectangle([x1, y, x2, y + w], fill=fill)


def diamond_rule(d, cx, y, half=320):
    rule(d, cx-half, cx-30, y, 2); rule(d, cx+30, cx+half, y, 2)
    d.polygon([(cx-16, y+1), (cx, y-9), (cx+16, y+1), (cx, y+11)], fill=GOLD)


def build(presents, title_lines, tagline, billing, dateline, cta, fname):
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    # subtle vignette/aged tint
    for i in range(40):
        a = 6
        d.rectangle([i, i, W-i, H-i], outline=(238-i, 232-i, 218-i))
    # double frame
    d.rectangle([40, 40, W-40, H-40], outline=INK, width=6)
    d.rectangle([58, 58, W-58, H-58], outline=INK, width=2)
    cx = W//2
    # top dateline strip
    ctext(d, cx, 92, dateline.upper(), F(SANS_B, 22), INK, ls=6)
    rule(d, 90, W-90, 132, 2)
    # masthead brand
    ctext(d, cx, 150, "LET AI DO IT", F(SERIF_B, 56), INK, ls=10)
    ctext(d, cx, 224, "— THE DISPATCH —", F(SERIF_I, 28), GOLD)
    rule(d, 90, W-90, 270, 2)
    # presents
    ctext(d, cx, 300, presents.upper(), F(SANS_B, 24), RED, ls=8)
    # title (the feature)
    y = 360
    tf = F(SERIF_B, 104)
    for ln in title_lines:
        ctext(d, cx, y, ln.upper(), tf, INK, ls=2); y += 116
    y += 6
    diamond_rule(d, cx, y); y += 34
    # tagline
    for ln in tagline:
        ctext(d, cx, y, ln, F(SERIF_I, 36), INK); y += 48
    y += 24
    # billing block (movie-credits style)
    ctext(d, cx, y, "FEATURING", F(SANS_B, 22), GOLD, ls=8); y += 44
    bf = F(SERIF_B, 40)
    for ln in billing:
        ctext(d, cx, y, ln.upper(), bf, INK, ls=1); y += 52
    # bottom marquee bar
    by = H - 230
    d.rectangle([70, by, W-70, by+120], fill=INK)
    ctext(d, cx, by+22, cta.upper(), F(SANS_B, 26), PAPER, ls=6)
    ctext(d, cx, by+62, "LETAIDOIT.PRO", F(SERIF_B, 52), GOLD, ls=4)
    # corner stars
    for (sx, sy) in [(95, 95), (W-115, 95), (95, H-150), (W-115, H-150)]:
        d.text((sx, sy), "✦", font=F(SERIF_B, 40), fill=GOLD)
    ctext(d, cx, H-92, "PRINTED FOR A SELECT READERSHIP  ·  NO. 001", F(SANS_B, 18), INK, ls=4)
    img.save(os.path.join(OUT, fname)); print("  ●", fname)


if __name__ == "__main__":
    print("🎬 cinematic newsletter →", OUT)
    build(
        presents="Let AI Do It Proudly Presents",
        title_lines=["Buy Back", "Your Time"],
        tagline=["An honest dispatch on AI — from a man who did", "the 1,000 hours so you don't have to."],
        billing=["The Closing Tool", "The Time You Lost", "A Glimpse Behind the Curtain"],
        dateline="Vol. I  ·  The Premiere Issue  ·  2026",
        cta="Now Showing At",
        fname="dispatch-no-001.png",
    )
    print("done.")
