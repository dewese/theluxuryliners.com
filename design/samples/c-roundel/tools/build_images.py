#!/usr/bin/env python3
"""Build every image design sample C uses from the masters in assets/ (nothing is drawn).

  photos and covers -> img/*.webp      resized, sRGB, full colour; covers never recoloured
  cut-out           -> img/cut-*.webp  a real photo with its white studio backdrop made
                                       transparent (alpha mask only; no pixel is painted)

The cut-out (plan §6, Direction C: "cut-out jump photos, masked from real photos, never
redrawn") works only on the c. 2000 white-studio frames, whose backdrop is a smooth white
cyclorama. The backdrop is modelled as a low-order polynomial colour surface fitted to the
frame's own light pixels; pixels close to that surface and connected to the frame edge
become transparent; enclosed pockets that match it closely too. Small specks are removed
and the edge is eroded one pixel and feathered, so no white halo is left. Numpy + Pillow
only; no segmentation model, no inpainting.

Run:  python3 tools/build_images.py
"""
import os
from collections import deque

import numpy as np
from PIL import Image, ImageFilter, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SAMPLE, "..", "..", ".."))
A = os.path.join(REPO, "assets")
IMG = os.path.join(SAMPLE, "img")

PHOTOS = {
    # out name: (master, long edge, crop box or None)
    "cover-new-beginning": ("source/covers/new-beginning-3000x3000-final.jpg", 1000, None),
    "cover-great-day": ("source/covers/great-day-1-upscale.png", 1000, None),
    "cover-overbored": ("source/covers/overbored.jpg", 1000, None),
    "cover-believe": ("source/covers/believe.jpg", 1000, None),
    # Great Day video poster: the cover, cropped to 16:9 around the kite (not recoloured)
    "poster-great-day": ("source/covers/great-day-1-upscale.png", 1280, (0, 420, 3000, 2108)),
    "1998-pale-blue-backstage": ("source/photos/flickr/2068108792_aaf265604b_o.jpg", 844, None),
    "1998-pale-blue-trio": ("source/photos/flickr/2067311761_a4fe334886_o.jpg", 963, None),
    "1998-hard-rock": ("source/photos/flickr/2068110424_a752172b0e_o.jpg", 919, None),
    "c2000-white-studio-dance": ("source/photos/flickr/2073239851_acb61c77da_o.jpg", 1200, None),
    "c2000-white-studio-coats": ("source/photos/flickr-web/2074031888_d9651e3520_h.jpg", 1100, None),
    "2001-chads-last-show": ("source/photos/flickr/530769478_c58cab562e_o.jpg", 1400, None),
    "2002-four": ("source/photos/luxury-liners-2002.jpg", 1096, None),
    "2003-recesses": ("source/photos/flickr-web/2084406418_1829b8926e_k.jpg", 1400, None),
    "2003-pillars": ("source/photos/flickr/2083621513_a9e3d8439d_o.jpg", 1400, None),
}

CUTOUTS = {
    # out name: (master, long edge, tolerance, crop or None)
    "cut-c2000-cartwheel": ("source/photos/flickr-web/4471053728_bcdf7d1e1d_z.jpg", 1200, 24, None),
}


def save_photo(name, rel, long_edge, crop):
    im = ImageOps.exif_transpose(Image.open(os.path.join(A, rel))).convert("RGB")
    if crop:
        im = im.crop(crop)
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    out = os.path.join(IMG, name + ".webp")
    im.save(out, "WEBP", quality=80, method=6)
    return out, im.size


def _design(h, w, deg=3):
    yy, xx = np.mgrid[0:h, 0:w]
    x, y = xx / w - 0.5, yy / h - 0.5
    return np.stack([(x ** i * y ** j).ravel() for i in range(deg + 1) for j in range(deg + 1 - i)], 1)


def _flood_from_edges(cand):
    h, w = cand.shape
    seen = np.zeros_like(cand)
    q = deque()
    for y in range(h):
        for x in range(w):
            if (y in (0, h - 1) or x in (0, w - 1)) and cand[y, x]:
                seen[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    return seen


def _components(mask):
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32)
    n = 0
    for y0, x0 in zip(*np.nonzero(mask)):
        if lab[y0, x0]:
            continue
        n += 1
        lab[y0, x0] = n
        q, pts = deque([(y0, x0)]), []
        while q:
            y, x = q.popleft()
            pts.append((y, x))
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = n
                    q.append((ny, nx))
        yield np.array(pts)


def cutout(name, rel, long_edge, tol, crop):
    im = ImageOps.exif_transpose(Image.open(os.path.join(A, rel))).convert("RGB")
    if crop:
        im = im.crop(crop)
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    a = np.asarray(im.filter(ImageFilter.GaussianBlur(1.0))).astype(np.float32)
    h, w, _ = a.shape
    # fit the backdrop's colour surface on a coarse grid, refining which pixels are backdrop
    s = 4
    sm = a[::s, ::s]
    hs, ws = sm.shape[:2]
    X = _design(hs, ws)
    bg_s = sm.mean(2) > 200
    for _ in range(4):
        idx = bg_s.ravel()
        coef = np.linalg.lstsq(X[idx], sm.reshape(-1, 3)[idx], rcond=None)[0]
        bg_s = np.abs(sm - (X @ coef).reshape(hs, ws, 3)).max(2) < tol
    dist = np.abs(a - (_design(h, w) @ coef).reshape(h, w, 3)).max(2)
    cand = dist < tol
    bg = _flood_from_edges(cand) | (cand & (dist < tol * 0.6))
    fg = ~bg
    lum = a.mean(2)
    keep = np.zeros_like(fg)
    for pts in _components(fg):
        # a person has dark pixels (hair, shoes); a stray shadow does not
        if len(pts) > 200 and lum[pts[:, 0], pts[:, 1]].min() < 90:
            keep[pts[:, 0], pts[:, 1]] = True
    m = Image.fromarray((keep * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))  # specks
    m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))  # pinholes
    m = m.filter(ImageFilter.MinFilter(3))  # erode one pixel: no white fringe
    m = m.filter(ImageFilter.GaussianBlur(0.8))
    out_im = im.copy()
    out_im.putalpha(m)
    bbox = m.point(lambda v: 255 if v > 8 else 0).getbbox()
    out_im = out_im.crop(bbox)
    out = os.path.join(IMG, name + ".webp")
    out_im.save(out, "WEBP", quality=86, method=6)
    return out, out_im.size


def main():
    os.makedirs(IMG, exist_ok=True)
    for name, (rel, edge, crop) in PHOTOS.items():
        out, size = save_photo(name, rel, edge, crop)
        print(f"{os.path.relpath(out, SAMPLE)} {size[0]}x{size[1]} {os.path.getsize(out) // 1024} KB")
    for name, (rel, edge, tol, crop) in CUTOUTS.items():
        out, size = cutout(name, rel, edge, tol, crop)
        print(f"{os.path.relpath(out, SAMPLE)} {size[0]}x{size[1]} {os.path.getsize(out) // 1024} KB (cut-out)")


if __name__ == "__main__":
    main()
