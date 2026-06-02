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
        glasses(c, M + 7, 0.45 * inch, scale=0.30, color=GOLD, width=2)
        c.setFont(SANS_B, 7.5); c.setFillColorRGB(*GOLD)
        c.drawString(M + 34, 0.42 * inch, "LETAIDOIT.PRO")
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

    def _pill(self, x, by, text, fill, txtcol, url):
        c = self.c
        tw = c.stringWidth(text, SANS_B, 8.5)
        w = tw + 32
        c.setFillColorRGB(*fill); c.roundRect(x, by, w, 21, 5, fill=1, stroke=0)
        # play triangle
        c.setFillColorRGB(*txtcol)
        p = c.beginPath(); p.moveTo(x + 12, by + 6); p.lineTo(x + 12, by + 15)
        p.lineTo(x + 19, by + 10.5); p.close(); c.drawPath(p, fill=1, stroke=0)
        c.setFont(SANS_B, 8.5); c.setFillColorRGB(*txtcol)
        c.drawString(x + 24, by + 6.5, text)
        c.linkURL(url, (x, by, x + w, by + 21), relative=0)
        return x + w + 12

    def prompt(self, label, text):
        """A clean, copy-ready prompt card + 'Run in ChatGPT / Claude' pill buttons."""
        from urllib.parse import quote
        plines = wrap(text, SANS, 10, PW - 2 * M - 34)
        h = 30 + len(plines) * 14 + 18 + 24
        self.need(h + 12); c = self.c
        top = self.y
        c.setFillColorRGB(0.972, 0.972, 0.965); c.rect(M, top - h, PW - 2 * M, h, fill=1, stroke=0)
        c.setFillColorRGB(*GOLD); c.rect(M, top - h, 3.5, h, fill=1, stroke=0)
        c.setFont(SANS_B, 8); c.setFillColorRGB(*GOLD)
        c.drawString(M + 16, top - 18, ("PROMPT  ·  " + label).upper())
        yy = top - 36
        c.setFillColorRGB(0.13, 0.16, 0.21)
        for ln in plines:
            c.setFont(SANS, 10); c.drawString(M + 16, yy, ln); yy -= 14
        enc = quote(text)
        by = top - h + 11
        x = self._pill(M + 16, by, "Run in ChatGPT", GREEN, (1, 1, 1),
                       "https://chatgpt.com/?q=" + enc)
        self._pill(x, by, "Run in Claude", GOLD, NAVY,
                   "https://claude.ai/new?q=" + enc)
        c.setFont(SANS, 7.5); c.setFillColorRGB(*MUT)
        c.drawRightString(PW - M - 14, by + 6.5, "tap to auto-fill")
        self.y = top - h - 12

    def onepager(self, headline, steps):
        """Full-page ADHD-friendly summary: the whole system at a glance."""
        c = self.c; self.y = PH - M
        c.setFillColorRGB(*GREEN); c.rect(M, self.y - 20, 246, 28, fill=1, stroke=0)
        c.setFont(SANS_B, 11); c.setFillColorRGB(*NAVY)
        c.drawString(M + 10, self.y - 14, "START HERE  ·  THE 1-PAGE VERSION")
        self.y -= 52
        c.setFont(SERIF, 23); c.setFillColorRGB(*NAVY)
        for ln in wrap(headline, SERIF, 23, PW - 2 * M):
            c.drawString(M, self.y, ln); self.y -= 28
        self.y -= 12
        for i, s in enumerate(steps, 1):
            cy = self.y
            c.setFillColorRGB(*GOLD); c.circle(M + 12, cy + 3, 12, fill=1, stroke=0)
            c.setFont(SANS_B, 12); c.setFillColorRGB(*NAVY)
            c.drawCentredString(M + 12, cy - 1, str(i))
            for j, ln in enumerate(wrap(s, SANS_B if False else SERIF_R, 12.5, PW - 2 * M - 46)):
                c.setFont(SERIF_R, 12.5); c.setFillColorRGB(*INK)
                c.drawString(M + 40, self.y, ln); self.y -= 17
            self.y -= 11
        self.y -= 4
        c.setFillColorRGB(*CREAM); c.rect(M, self.y - 30, PW - 2 * M, 34, fill=1, stroke=0)
        c.setFillColorRGB(*GOLD); c.rect(M, self.y - 30, 4, 34, fill=1, stroke=0)
        c.setFont(SANS_B, 9); c.setFillColorRGB(*INK)
        c.drawString(M + 14, self.y - 13, "That's the whole system. The rest of this guide walks each step,")
        c.drawString(M + 14, self.y - 25, "with copy-paste prompts you can run in one tap.")
        self._footer(); c.showPage(); self.y = PH - M

    def step(self, n, title, body):
        """A numbered, easy-to-follow instruction step."""
        self.need(72); c = self.c; cy = self.y
        c.setFillColorRGB(*NAVY); c.circle(M + 13, cy - 3, 14, fill=1, stroke=0)
        c.setFont(SANS_B, 13); c.setFillColorRGB(*GOLD)
        c.drawCentredString(M + 13, cy - 8, str(n))
        c.setFont(SERIF, 16); c.setFillColorRGB(*NAVY)
        for ln in wrap(title, SERIF, 16, PW - 2 * M - 46):
            c.drawString(M + 42, self.y, ln); self.y -= 20
        self.y -= 3
        for ln in wrap(body, SERIF_R, 11.5, PW - 2 * M - 42):
            self.need(15); c.setFont(SERIF_R, 11.5); c.setFillColorRGB(*INK)
            c.drawString(M + 42, self.y, ln); self.y -= 16
        self.y -= 9

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
        elif t == "onepager": d.onepager(blk[1], blk[2])
        elif t == "step": d.step(blk[1], blk[2], blk[3])
        elif t == "prompt": d.prompt(blk[1], blk[2])
        elif t == "space": d.space()
    d.cta_page(spec.get("contact", DEFAULT_CONTACT))
    d.save()
    print("  ●", spec["file"])
    return path
