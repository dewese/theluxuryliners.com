#!/usr/bin/env python3
"""Build every image the sample uses from the masters in assets/ (nothing is drawn).

  photos and covers  -> img/*.webp   (resized, sRGB, full colour; covers never recoloured)
  engraved plates    -> img/eng/{slot}--shadow.webp and --light.webp

An engraved plate is an ALPHA MASK, not a picture: alpha 255 = ink. The page paints it
with `mask-image` over a block of the theme's ink colour, so one file serves any colour
pair and the theme toggle recolours it instantly.
  --shadow  lines draw the shadows (dark ink on a light ground: the light theme)
  --light   lines draw the highlights (light ink on a dark ground: the dark theme)
Both read as a positive portrait, the same idea as daviddewese.com's engrave.py (P32),
re-implemented here with numpy + Pillow only (no segmentation model): wavy lines a fixed
`spacing` apart, width following tone, anti-aliased analytically, no subject mask, a soft
edge window so the plate has no hard rectangle. Plates are rendered at 2x their largest
CSS size with wide line spacing, so they never turn into small mushy engravings.

Run:  python3 tools/build_images.py
"""
import os

import numpy as np
from PIL import Image, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SAMPLE, "..", "..", ".."))
A = os.path.join(REPO, "assets")
IMG = os.path.join(SAMPLE, "img")

PHOTOS = {
    # out name: (master, long edge, crop box or None)
    "cover-new-beginning": ("source/covers/new-beginning-3000x3000-final.jpg", 900, None),
    "cover-great-day": ("source/covers/great-day-1-upscale.png", 900, None),
    "cover-overbored": ("source/covers/overbored.jpg", 900, None),
    "cover-shake-it-up": ("reference/dsp-artwork/shake-it-up-live-apple-music-3000.jpg", 600, None),
    "1998-pale-blue-backstage": ("source/photos/flickr/2068108792_aaf265604b_o.jpg", 844, None),
    "1998-pale-blue-trio": ("source/photos/flickr/2067311761_a4fe334886_o.jpg", 963, None),
    "1998-hard-rock": ("source/photos/flickr/2068110424_a752172b0e_o.jpg", 919, None),
    "c2000-white-studio-dance": ("source/photos/flickr/2073239851_acb61c77da_o.jpg", 1200, None),
    "c2000-white-studio-coats": ("source/photos/flickr-web/2074031888_d9651e3520_h.jpg", 1100, None),
    "2002-four": ("source/photos/luxury-liners-2002.jpg", 1096, None),
    "2003-recesses": ("source/photos/flickr-web/2084406418_1829b8926e_k.jpg", 1200, None),
}

PLATES = {
    # slot: (master, crop [l, t, r, b] in master px, output width px, spacing px, gamma)
    "2002-four": ("source/photos/luxury-liners-2002.jpg", (150, 160, 1060, 700), 2000, 9.0, 0.75),
    "2003-trio": ("source/photos/flickr/2083621513_a9e3d8439d_o.jpg", (0, 120, 2560, 1720), 2000, 9.0, 0.8),
}


def save_photo(name, rel, long_edge, crop):
    im = Image.open(os.path.join(A, rel))
    im = ImageOps.exif_transpose(im).convert("RGB")
    if crop:
        im = im.crop(crop)
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    out = os.path.join(IMG, name + ".webp")
    im.save(out, "WEBP", quality=80, method=6)
    return out, im.size


def tone_map(grey, spacing):
    """grey 0..1 (1 = white) -> smoothed, locally contrasted tone 0..1."""
    img = Image.fromarray((grey * 255).astype(np.uint8))
    # low-pass at about the line pitch: finer detail cannot be drawn and only aliases
    img = img.filter(ImageFilter.GaussianBlur(spacing * 0.35))
    # local contrast: large-radius unsharp mask keeps faces readable
    img = img.filter(ImageFilter.UnsharpMask(radius=int(spacing * 6), percent=160, threshold=0))
    t = np.asarray(img).astype(np.float32) / 255.0
    lo, hi = np.percentile(t, 1.5), np.percentile(t, 98.5)
    return np.clip((t - lo) / max(hi - lo, 1e-3), 0, 1)


def engrave(slot, rel, crop, width, spacing, gamma):
    im = ImageOps.exif_transpose(Image.open(os.path.join(A, rel))).convert("L").crop(crop)
    h = round(width * im.height / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    t = tone_map(np.asarray(im).astype(np.float32) / 255.0, spacing) ** gamma

    yy, xx = np.mgrid[0:h, 0:width].astype(np.float32)
    # wavy lines: a slow wave plus a nudge from the tone itself (the "contour" of a burin)
    smooth = np.asarray(Image.fromarray((t * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(spacing * 2))).astype(np.float32) / 255.0
    phase = yy + spacing * 0.55 * np.sin(xx / (spacing * 9.0)) + spacing * 1.1 * smooth
    d = np.abs(((phase / spacing) % 1.0) - 0.5) * spacing  # distance to line centre, px
    # edge window: plain ground at the rim, lines taper in
    margin, ramp = spacing * 0.6, spacing * 7
    ex = np.minimum(xx, width - 1 - xx)
    ey = np.minimum(yy, h - 1 - yy)
    win = np.clip((np.minimum(ex, ey) - margin) / ramp, 0, 1)
    win = win * win * (3 - 2 * win)
    floor, cap = 0.04, 0.8  # never a solid fill; a hairline survives
    for kind, ink in (("shadow", 1.0 - t), ("light", t)):
        half = (floor + (cap - floor) * ink) * spacing / 2.0 * win
        alpha = np.clip(half - d + 0.5, 0, 1)  # analytic anti-aliasing
        a8 = (alpha * 255).astype(np.uint8)
        rgba = np.zeros((h, width, 4), np.uint8)
        rgba[..., 3] = a8
        out = os.path.join(IMG, "eng", f"{slot}--{kind}.webp")
        Image.fromarray(rgba, "RGBA").save(out, "WEBP", lossless=True, quality=100, method=6)
        print(out, f"{os.path.getsize(out) // 1024} KB", (width, h))


def main():
    os.makedirs(os.path.join(IMG, "eng"), exist_ok=True)
    for name, (rel, edge, crop) in ({} if os.environ.get('PLATES_ONLY') else PHOTOS).items():
        out, size = save_photo(name, rel, edge, crop)
        print(out, size, f"{os.path.getsize(out) // 1024} KB")
    for slot, args in PLATES.items():
        engrave(slot, *args)


if __name__ == "__main__":
    main()
