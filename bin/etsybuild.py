#!/usr/bin/env python3
"""
etsybuild — branded PDF generator for the OrganizedOrionDesign digital shop.

Turns a structured product spec into a clean, well-designed, easy-to-follow PDF
in Zorba's brand (navy / gold glasses / action-green accents). Reusable across
all products: define a spec dict, call build(). Local reportlab — no API.
"""
import os
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

OUT = os.path.join(os.getcwd(), "etsy-shop")
os.makedirs(OUT, exist_ok=True)

NAVY = (0.039, 0.086, 0.157)      # #0a1628
NAVY2 = (0.078, 0.137, 0.247)
GOLD = (0.784, 0.643, 0.361)      # #c8a45c
GREEN = (0.412, 0.745, 0.157)     # #69BE28
CREAM = (0.980, 0.973, 0.953)     # #faf8f3
INK = (0.106, 0.137, 0.176)
MUT = (0.45, 0.49, 0.54)
PW, PH = LETTER
M = 0.85 * inch

SERIF = "Times-Bold"
SERIF_R = "Times-Roman"
SANS = "Helvetica"
SANS_B = "Helvetica-Bold"


def glasses(c, cx, cy, scale=1.0, color=GOLD, width=2.2):
    c.setStrokeColorRGB(*color)
    c.setLineWidth(width * scale)
    r = 20 * scale
    gap = 5 * scale
    c.circle(cx - gap - r, cy, r, stroke=1, fill=0)
    c.circle(cx + gap + r, cy, r, stroke=1, fill=0)
    c.line(cx - gap, cy + 2 * scale, cx + gap, cy + 2 * scale)
    c.line(cx - gap - 2 * r, cy + 2 * scale, cx - gap - 2 * r - 11 * scale, cy + 7 * scale)
    c.line(cx + gap + 2 * r, cy + 2 * scale, cx + gap + 2 * r + 11 * scale, cy + 7 * scale)


def wrap(text, font, size, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if stringWidth(t, font, size) <= max_w:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


class Doc:
    def __init__(self, path, footer):
        self.c = canvas.Canvas(path, pagesize=LETTER)
        self.footer = footer
        self.y = PH - M
        self.page = 0

    def _footer(self):
        c = self.c
        c.setStrokeColorRGB(*GOLD); c.setLineWidth(0.5)
        c.line(M, 0.6 * inch, PW - M, 0.6 * inch)
        glasses(c, M + 6, 0.45 * inch, scale=0.32, color=GOLD, width=2)
        c.setFont(SANS_B, 7.5); c.setFillColorRGB(*GOLD)
        c.drawString(M + 22, 0.42 * inch, "LETAIDOIT.PRO")
        c.setFont(SANS, 7.5); c.setFillColorRGB(*MUT)
        c.drawRightString(PW - M, 0.42 * inch, self.footer)
        if self.page:
            c.setFont(SANS, 7.5); c.setFillColorRGB(*MUT)
            c.drawCentredString(PW / 2, 0.42 * inch, str(self.page))
        self.page += 1

    def _page_break(self):
        self._footer(); self.c.showPage(); self.y = PH - M

    def need(self, h):
        if self.y - h < 0.9 * inch:
            self._page_break()

    def cover(self, title, subtitle, kicker):
        c = self.c
        c.setFillColorRGB(*NAVY); c.rect(0, 0, PW, PH, fill=1, stroke=0)
        c.setFillColorRGB(*NAVY2)
        c.rect(0, PH - 2.2 * inch, PW, 2.2 * inch, fill=1, stroke=0)
        glasses(c, PW / 2, PH - 2.0 * inch, scale=2.4, color=GOLD, width=2.6)
        c.setFillColorRGB(*GREEN)
        c.rect(M, PH - 3.5 * inch, 0.9 * inch, 5, fill=1, stroke=0)
        c.setFont(SANS_B, 11); c.setFillColorRGB(*GOLD)
        c.drawString(M, PH - 3.35 * inch, kicker.upper())
        # title
        c.setFillColorRGB(*CREAM)
        y = PH - 4.2 * inch
        for ln in wrap(title, SERIF, 34, PW - 2 * M):
            c.setFont(SERIF, 34); c.drawString(M, y, ln); y -= 40
        y -= 6
        c.setFillColorRGB(0.74, 0.79, 0.85)
        for ln in wrap(subtitle, SERIF_R, 15, PW - 2 * M):
            c.setFont(SERIF_R, 15); c.drawString(M, y, ln); y -= 21
        c.setFont(SANS_B, 9); c.setFillColorRGB(*GOLD)
        c.drawString(M, 1.0 * inch, "A LET AI DO IT GUIDE")
        c.drawRightString(PW - M, 1.0 * inch, "letaidoit.pro")
        c.showPage(); self.y = PH - M

    def h1(self, text):
        self.need(60); c = self.c
        c.setFillColorRGB(*GREEN); c.rect(M, self.y - 4, 26, 4, fill=1, stroke=0)
        self.y -= 26
        c.setFont(SERIF, 22); c.setFillColorRGB(*NAVY)
        for ln in wrap(text, SERIF, 22, PW - 2 * M):
            c.drawString(M, self.y, ln); self.y -= 27
        self.y -= 6

    def h2(self, text):
        self.need(40); c = self.c
        c.setFont(SANS_B, 13); c.setFillColorRGB(*GOLD)
        c.drawString(M, self.y, text.upper()); self.y -= 20

    def body(self, text):
        c = self.c
        for ln in wrap(text, SERIF_R, 11.5, PW - 2 * M):
            self.need(16); c.setFont(SERIF_R, 11.5); c.setFillColorRGB(*INK)
            c.drawString(M, self.y, ln); self.y -= 16
        self.y -= 6

    def bullets(self, items, check=False):
        c = self.c
        for it in items:
            self.need(18)
            if check:
                c.setStrokeColorRGB(*GOLD); c.setLineWidth(1)
                c.rect(M + 2, self.y - 1, 9, 9, fill=0, stroke=1)
                ix = M + 22
            else:
                c.setFillColorRGB(*GREEN); c.circle(M + 6, self.y + 3.5, 2.5, fill=1, stroke=0)
                ix = M + 18
            lines = wrap(it, SERIF_R, 11.5, PW - 2 * M - (ix - M))
            for i, ln in enumerate(lines):
                self.need(15); c.setFont(SERIF_R, 11.5); c.setFillColorRGB(*INK)
                c.drawString(ix, self.y, ln); self.y -= 15
            self.y -= 3
        self.y -= 4

    def callout(self, label, text):
        lines = wrap(text, SERIF_R, 11, PW - 2 * M - 24)
        h = 22 + len(lines) * 15
        self.need(h + 10); c = self.c
        top = self.y
        c.setFillColorRGB(*CREAM); c.rect(M, top - h, PW - 2 * M, h, fill=1, stroke=0)
        c.setFillColorRGB(*GOLD); c.rect(M, top - h, 4, h, fill=1, stroke=0)
        c.setFont(SANS_B, 8.5); c.setFillColorRGB(*GOLD)
        c.drawString(M + 14, top - 16, label.upper())
        yy = top - 30
        for ln in lines:
            c.setFont(SERIF_R, 11); c.setFillColorRGB(*INK)
            c.drawString(M + 14, yy, ln); yy -= 15
        self.y = top - h - 12

    def space(self, h=8):
        self.y -= h

    def cta_page(self, contact):
        """Branded closing page — every product invites deeper paid work."""
        self._footer(); self.c.showPage()
        c = self.c
        c.setFillColorRGB(*NAVY); c.rect(0, 0, PW, PH, fill=1, stroke=0)
        c.setFillColorRGB(*NAVY2); c.rect(0, PH - 2.0 * inch, PW, 2.0 * inch, fill=1, stroke=0)
        glasses(c, PW / 2, PH - 1.8 * inch, scale=2.2, color=GOLD, width=2.6)
        c.setFillColorRGB(*GREEN); c.rect(M, PH - 3.2 * inch, 0.9 * inch, 5, fill=1, stroke=0)
        c.setFont(SANS_B, 11); c.setFillColorRGB(*GOLD)
        c.drawString(M, PH - 3.05 * inch, "GO DEEPER")
        c.setFont(SERIF, 30); c.setFillColorRGB(*CREAM)
        y = PH - 3.85 * inch
        for ln in wrap("Want this done for you?", SERIF, 30, PW - 2 * M):
            c.drawString(M, y, ln); y -= 36
        y -= 6
        c.setFont(SERIF_R, 13.5); c.setFillColorRGB(0.74, 0.79, 0.85)
        body = ("This guide hands you the system. If you'd rather have it built "
                "for you, that's what I do: I find where your time leaks and build "
                "the tool that plugs it. No hype — just your hours, back.")
        for ln in wrap(body, SERIF_R, 13.5, PW - 2 * M):
            c.drawString(M, y, ln); y -= 19
        y -= 18
        c.setFont(SANS_B, 10.5); c.setFillColorRGB(*GOLD)
        c.drawString(M, y, "LET'S TALK"); y -= 22
        c.setFont(SANS, 12.5); c.setFillColorRGB(*CREAM)
        for line in contact:
            c.drawString(M, y, line); y -= 20
        c.setFont(SANS_B, 9); c.setFillColorRGB(*GOLD)
        c.drawString(M, 1.0 * inch, "A LET AI DO IT GUIDE")
        c.drawRightString(PW - M, 1.0 * inch, "letaidoit.pro")
        c.showPage()

    def save(self):
        self.c.save()


DEFAULT_CONTACT = [
    "Web:  letaidoit.pro",
    "Instagram:  @zorb_ai  (DM me — I reply)",
    "Built something with this guide? Send it. I love seeing it.",
]


def build(spec):
    path = os.path.join(OUT, spec["file"])
    d = Doc(path, spec.get("footer", "Let AI Do It"))
    d.cover(spec["title"], spec["subtitle"], spec.get("kicker", "Digital Guide"))
    for blk in spec["blocks"]:
        t = blk[0]
        if t == "h1": d.h1(blk[1])
        elif t == "h2": d.h2(blk[1])
        elif t == "p": d.body(blk[1])
        elif t == "ul": d.bullets(blk[1])
        elif t == "check": d.bullets(blk[1], check=True)
        elif t == "callout": d.callout(blk[1], blk[2])
        elif t == "space": d.space()
    d.cta_page(spec.get("contact", DEFAULT_CONTACT))
    d.save()
    print("  ●", spec["file"])
    return path
