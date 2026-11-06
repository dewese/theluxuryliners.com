#!/usr/bin/env python3
"""Export the web copies used by sample B from the masters in assets/.

Real photos and covers only, resized and re-encoded as WebP. No filters, no
grain, no recolouring (plan rule 4). Run from anywhere:
    python3 tools/build_images.py
"""
import os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SAMPLE, "..", "..", ".."))
OUT = os.path.join(SAMPLE, "img")

P = "assets/source/photos/"
# (output name, source file relative to the repo, max long edge, quality[, crop box])
JOBS = [
    # covers (full colour, P32)
    ("cover-great-day", "assets/source/covers/great-day-1-upscale.png", 900, 80),
    ("cover-new-beginning", "assets/source/covers/new-beginning-3000x3000-final.jpg", 900, 80),
    ("cover-overbored", "assets/source/covers/overbored.jpg", 900, 82),
    ("cover-shake-it-up", "assets/reference/dsp-artwork/shake-it-up-live-apple-music-3000.jpg", 700, 80),
    # era photos (assets.json ids in comments)
    ("1998-backstage", P + "flickr/2068108792_aaf265604b_o.jpg", 844, 80),        # flickr-2068108792
    ("1998-pale-blue-trio", P + "flickr/2067311761_a4fe334886_o.jpg", 963, 80),   # flickr-2067311761
    ("1998-hard-rock", P + "flickr/2068110424_a752172b0e_o.jpg", 919, 80),        # flickr-2068110424
    ("1998-waco-sign", P + "flickr-web/2067318469_8bb412488f_c.jpg", 350, 85),    # flickr-2067318469
    ("nudie-label", P + "flickr-web/529049789_59400b3b37_c.jpg", 450, 85),        # flickr-529049789
    ("c2000-coats", P + "flickr-web/2074031888_d9651e3520_h.jpg", 1200, 78),      # flickr-2074031888
    ("c2000-dance", P + "flickr/2073239851_acb61c77da_o.jpg", 1200, 78),          # flickr-2073239851
    ("2002-four", P + "luxury-liners-2002.jpg", 1096, 80),                        # ext-luxury-liners-2002-four-piece
    ("2003-recesses", P + "flickr-web/2084406418_1829b8926e_k.jpg", 1400, 76),   # flickr-2084406418
    ("2003-pillars", P + "flickr/2083621513_a9e3d8439d_o.jpg", 1400, 76),        # flickr-2083621513
    ("2003-sky", P + "flickr-web/2083620879_55e6dba4fa_k.jpg", 1200, 76),        # flickr-2083620879
    # flyers and posters (always transcribed in the page)
    ("flyer-texas-pop", P + "flickr/2083681019_b3944b2a14_o.jpg", 350, 88, (0, 62, 350, 299)),  # black scan margins trimmed      # flickr-2083681019
    ("flyer-12th-porter-postcard", P + "flickr-web/2067318521_b3eaee5716_c.jpg", 350, 88),  # flickr-2067318521
    ("flyer-exit-in-dec-9", P + "flickr/2084463656_d975406557_o.jpg", 330, 88),  # flickr-2084463656
]


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, src, edge, q, *crop in JOBS:
        im = Image.open(os.path.join(REPO, src))
        im = im.convert("RGB")
        if crop:  # only plain black scanner margins are ever trimmed
            im = im.crop(crop[0])
        w, h = im.size
        s = min(1.0, edge / max(w, h))
        if s < 1.0:
            im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
        path = os.path.join(OUT, name + ".webp")
        im.save(path, "WEBP", quality=q, method=6)
        print(f"{name}.webp {im.size[0]}x{im.size[1]} {os.path.getsize(path)//1024} KB")


if __name__ == "__main__":
    main()
