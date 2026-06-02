#!/usr/bin/env python3
"""etsy_thumbs — branded 2000x2000 Etsy listing images for all 20 products."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.getcwd(), "etsy-shop", "thumbs")
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/truetype/liberation/"
SERIF_B = FD + "LiberationSerif-Bold.ttf"
SANS_B = FD + "LiberationSans-Bold.ttf"
NAVY = (10, 22, 40); NAVY2 = (18, 33, 58)
GOLD = (200, 164, 92); GREEN = (105, 190, 40); CREAM = (250, 248, 243); MUT = (150, 165, 180)
S = 2000

PRODUCTS = [
 ("01_ai-chief-of-staff", "The Solo Founder Series", "Build Your AI Chief of Staff"),
 ("02_context-nucleus", "The Solo Founder Series", "The Context Nucleus"),
 ("03_portfolio-like-a-company", "The Solo Founder Series", "Run a Portfolio Like a Company"),
 ("04_adhd-standup-planner", "Daily Systems", "The ADHD Daily Standup Planner"),
 ("05_delegate-to-ai-agents", "The Solo Founder Series", "Delegate to AI Agents"),
 ("06_content-engine", "Content & Posting", "The 1-Video-a-Week Content Engine"),
 ("07_beat-the-posting-block", "Content & Posting", "Beat the Posting Block"),
 ("08_atomize", "Content & Posting", "Atomize One Idea Into a Week"),
 ("09_cross-post", "Content & Posting", "Cross-Post One Video Everywhere"),
 ("10_caption-swipe-file", "Content & Posting", "The Caption Swipe File"),
 ("11_honest-newsletter", "Content & Posting", "The Honest Founder Newsletter"),
 ("12_brand-in-a-day", "Brand in a Day", "Brand Yourself in a Day"),
 ("13_quote-card-pack", "Brand in a Day", "The Quote Card Playbook"),
 ("14_position-the-ai-person", "Brand in a Day", "Position Yourself as the AI Person"),
 ("15_audit-your-subscriptions", "Money & Tools", "Audit Your AI Subscriptions"),
 ("16_cancel-anything", "Money & Tools", "Cancel Anything"),
 ("17_lean-ai-stack", "Money & Tools", "The Lean AI Tool Stack"),
 ("18_50-tasks-to-automate", "Practical AI", "50 Tasks to Automate in Your Business"),
 ("19_first-company-gpt", "Practical AI", "Your First Company GPT"),
 ("20_complete-bundle", "The Complete System", "The Solo Founder's AI Operating System"),
]


def F(p, s): return ImageFont.truetype(p, s)


def wrap(d, t, f, mw):
    w, ls, c = t.split(), [], ""
    for x in w:
        s = (c + " " + x).strip()
        if d.textlength(s, font=f) <= mw: c = s
        else: ls.append(c); c = x
    if c: ls.append(c)
    return ls


def glasses(d, cx, cy, sc, col, wd):
    r = int(150*sc); g = int(38*sc); w = max(6, int(wd*sc))
    d.ellipse([cx-g-2*r, cy-r, cx-g, cy+r], outline=col, width=w)
    d.ellipse([cx+g, cy-r, cx+g+2*r, cy+r], outline=col, width=w)
    d.line([(cx-g, cy-int(12*sc)), (cx+g, cy-int(12*sc))], fill=col, width=w)
    d.line([(cx-g-2*r, cy-int(8*sc)), (cx-g-2*r-int(78*sc), cy-int(44*sc))], fill=col, width=w)
    d.line([(cx+g+2*r, cy-int(8*sc)), (cx+g+2*r+int(78*sc), cy-int(44*sc))], fill=col, width=w)


def make(stem, kicker, title, is_bundle=False):
    img = Image.new("RGB", (S, S), NAVY)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, S, 520], fill=NAVY2)
    glasses(d, S//2, 300, 1.45, GOLD, 16)
    # kicker
    kf = F(SANS_B, 46)
    kt = kicker.upper()
    d.rectangle([180, 740, 320, 754], fill=GREEN)
    d.text((180, 660), kt, font=kf, fill=GOLD)
    # title
    tf = F(SERIF_B, 130)
    lines = wrap(d, title, tf, S-360)
    y = 760 if is_bundle else 850
    for ln in lines:
        d.text((180, y), ln, font=tf, fill=CREAM); y += 150
    if is_bundle:
        gf = F(SANS_B, 44)
        for tl in wrap(d, "Run your whole business with AI. 20 systems, one download.", gf, S-360):
            d.text((180, y + 10), tl, font=gf, fill=GOLD); y += 56
    # badge
    bf = F(SANS_B, 42)
    badge = "COMPLETE BUNDLE · 20 GUIDES" if is_bundle else "DIGITAL PDF GUIDE · INSTANT DOWNLOAD"
    d.text((180, S-330), badge, font=bf, fill=GREEN if is_bundle else MUT)
    # footer mark (clean, minimal — hero glasses already carry the mark)
    d.text((180, S-185), "LET AI DO IT", font=F(SANS_B, 54), fill=GOLD)
    d.text((182, S-108), "letaidoit.pro", font=F(SANS_B, 36), fill=MUT)
    img.save(os.path.join(OUT, stem + ".png"))
    print("  ●", stem + ".png")


if __name__ == "__main__":
    print("🖼️  Etsy thumbnails →", OUT)
    for stem, k, t in PRODUCTS:
        make(stem, k, t, is_bundle=stem.startswith("20"))
    print("done.", len(PRODUCTS))
