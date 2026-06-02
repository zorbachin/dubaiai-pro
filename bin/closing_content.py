#!/usr/bin/env python3
"""Closing-tool content push — branded carousel + quote cards (navy/gold glasses)."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.getcwd(), "content-assets", "closing-tool")
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/truetype/liberation/"
SERIF_B = FD + "LiberationSerif-Bold.ttf"
SANS_B = FD + "LiberationSans-Bold.ttf"
SANS = FD + "LiberationSans-Regular.ttf"
NAVY = (10, 22, 40); NAVY2 = (16, 31, 54)
GOLD = (200, 164, 92); GREEN = (105, 190, 40); CREAM = (250, 248, 243); MUT = (140, 156, 172)
W = H = 1080


def F(p, s): return ImageFont.truetype(p, s)


def wrap(d, t, f, mw):
    out, cur = [], ""
    for w in t.split():
        s = (cur + " " + w).strip()
        if d.textlength(s, font=f) <= mw: cur = s
        else: out.append(cur); cur = w
    if cur: out.append(cur)
    return out


def glasses(d, cx, cy, sc, col, wd):
    r = int(95 * sc); g = int(24 * sc); w = max(4, int(wd * sc))
    d.ellipse([cx-g-2*r, cy-r, cx-g, cy+r], outline=col, width=w)
    d.ellipse([cx+g, cy-r, cx+g+2*r, cy+r], outline=col, width=w)
    d.line([(cx-g, cy-int(8*sc)), (cx+g, cy-int(8*sc))], fill=col, width=w)
    d.line([(cx-g-2*r, cy-int(6*sc)), (cx-g-2*r-int(50*sc), cy-int(28*sc))], fill=col, width=w)
    d.line([(cx+g+2*r, cy-int(6*sc)), (cx+g+2*r+int(50*sc), cy-int(28*sc))], fill=col, width=w)


def footer(d):
    d.text((70, H-92), "LET AI DO IT", font=F(SANS_B, 30), fill=GOLD)
    d.text((W-300, H-90), "letaidoit.pro", font=F(SANS_B, 26), fill=MUT)


def slide(n, total, kicker, text, fname, accent=GOLD):
    img = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 12], fill=accent)
    d.text((70, 70), f"{n}/{total}", font=F(SANS_B, 34), fill=MUT)
    d.rectangle([70, 150, 210, 162], fill=GREEN)
    d.text((70, 180), kicker.upper(), font=F(SANS_B, 30), fill=accent)
    fnt = F(SERIF_B, 70); lines = wrap(d, text, fnt, W-160)
    y = (H - len(lines)*84)//2 + 30
    for ln in lines:
        d.text((70, y), ln, font=fnt, fill=CREAM); y += 84
    footer(d); img.save(os.path.join(OUT, fname)); print("  ●", fname)


def quote(text, fname):
    img = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(img)
    glasses(d, W//2, 230, 1.1, GOLD, 16)
    d.rectangle([W//2-44, 360, W//2+44, 370], fill=GREEN)
    fnt = F(SERIF_B, 86); lines = wrap(d, text, fnt, W-200)
    y = 470
    for ln in lines:
        tw = d.textlength(ln, font=fnt); d.text(((W-tw)/2, y), ln, font=fnt, fill=CREAM); y += 100
    footer(d); img.save(os.path.join(OUT, fname)); print("  ●", fname)


if __name__ == "__main__":
    print("🎨 closing-tool content →", OUT)
    T = 6
    slide(1, T, "The hard truth", "Most deals don't die on the call. They die in the follow-up gap.", "carousel-1.png")
    slide(2, T, "The gap", "You hang up. The proposal takes two days. By then they've cooled — or picked someone faster.", "carousel-2.png")
    slide(3, T, "The flip", "What if the proposal was done before the call even ended?", "carousel-3.png", accent=GREEN)
    slide(4, T, "The tool", "Drop in the deal. It writes the proposal instantly — in your voice.", "carousel-4.png")
    slide(5, T, "The result", "Send it while you're still warm. Close while they're still excited.", "carousel-5.png")
    slide(6, T, "Your move", "Want this closing for your business? Tap letaidoit.pro.", "carousel-6.png", accent=GREEN)
    quote("Deals die in the follow-up gap.", "quote-follow-up-gap.png")
    quote("The proposal should be done before the call ends.", "quote-before-call-ends.png")
    quote("Speed is the close.", "quote-speed-is-the-close.png")
    print("done.")
