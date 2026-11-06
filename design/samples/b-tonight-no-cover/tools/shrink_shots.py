#!/usr/bin/env python3
"""Keep screenshots small: palette PNGs (256 colours, Floyd-Steinberg).
  python3 tools/shrink_shots.py                 shrink screenshots/*.png in place
  python3 tools/shrink_shots.py --overview a b c  join a, b, c side by side into overview.png
"""
import glob
import os
import sys
from PIL import Image

SHOTS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots")


def shrink(img, path):
    img.convert("RGB").quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(path, optimize=True)
    print(os.path.basename(path), img.size, os.path.getsize(path) // 1024, "KB")


if sys.argv[1:2] == ["--overview"]:
    ims = [Image.open(p) for p in sys.argv[2:]]
    gap = 40
    w = sum(i.width for i in ims) + gap * (len(ims) + 1)
    h = max(i.height for i in ims) + 2 * gap
    out = Image.new("RGB", (w, h), (60, 12, 9))
    x = gap
    for i in ims:
        out.paste(i, (x, gap))
        x += i.width + gap
    shrink(out, os.path.join(SHOTS, "overview.png"))
    for p in sys.argv[2:]:
        os.remove(p)
else:
    for p in sorted(glob.glob(os.path.join(SHOTS, "*.png"))):
        if os.path.basename(p) != "overview.png":
            shrink(Image.open(p), p)
