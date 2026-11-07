#!/usr/bin/env python3
"""Palette screenshots/overview.png (256 colours, dithered) so the folder stays under ~8 MB."""
import os
from PIL import Image

p = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots", "overview.png")
im = Image.open(p).convert("RGB")
q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
q.save(p, optimize=True)
print(p, im.size, os.path.getsize(p) // 1024, "KB")
