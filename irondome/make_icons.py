#!/usr/bin/env python3
"""Generate icon-192.png and icon-512.png for the Iron Dome PWA.
Pure stdlib (zlib + struct) so it runs anywhere. Rerun if the art changes."""
import struct, zlib, math


def png(path, size, pix):
    raw = b''.join(b'\x00' + bytes(v for p in row for v in p) for row in pix)
    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c))
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)))
        f.write(chunk(b'IDAT', zlib.compress(raw, 9)))
        f.write(chunk(b'IEND', b''))


def render(S):
    BG, NAVY, CYAN, GOLD = (10, 18, 38), (34, 65, 127), (62, 230, 255), (255, 209, 102)
    cxp, cyp, R = S / 2, S * 0.74, S * 0.34
    th = S * 0.035
    pix = []
    for y in range(S):
        row = []
        for x in range(S):
            c = BG
            # buildings under the dome
            gy = S * 0.74
            if y >= gy:
                c = (16, 27, 56)
            for bx, bw, bh in ((0.34, 0.10, 0.16), (0.47, 0.09, 0.22), (0.59, 0.10, 0.12)):
                if S * bx <= x <= S * (bx + bw) and S * (0.74 - bh) <= y <= gy:
                    c = NAVY
            # dome ring (upper half)
            d = math.hypot(x - cxp, y - cyp)
            if y <= cyp and abs(d - R) <= th:
                c = CYAN
            elif y <= cyp and abs(d - R) <= th * 2.2:
                k = 1 - (abs(d - R) - th) / (th * 1.2)
                if k > 0:
                    c = tuple(int(c[i] + (CYAN[i] - c[i]) * k * 0.5) for i in range(3))
            # gold spark above the dome
            sd = math.hypot(x - cxp, y - S * 0.22)
            if sd < S * 0.045:
                c = GOLD
            elif sd < S * 0.09:
                k = 1 - (sd - S * 0.045) / (S * 0.045)
                c = tuple(int(c[i] + (GOLD[i] - c[i]) * k * 0.6) for i in range(3))
            row.append(c)
        pix.append(row)
    return pix


for s in (192, 512):
    png(f'icon-{s}.png', s, render(s))
    print(f'icon-{s}.png written')
