#!/usr/bin/env python3
"""Cut individual marks out of the logo sheets in assets/derived/logos/.

Every <path> element (its d, fill rule, colour and transform) is copied byte for
byte from the sheet; only a tight viewBox is computed around each mark. Nothing
is redrawn. Run from anywhere:  python3 tools/extract_logos.py

Each mark is also written in two ink variants for the two themes:
  <name>--oxblood.svg  near-black ink rgb(13.7%, 12.2%, 12.5%) -> #6E1410 (paper theme)
  <name>--paper.svg    near-black ink -> #F4E6D0 (after-hours theme)
Only that fill value changes; every d, fill rule, transform and the red, slate
and white fills stay exactly as drawn. Pages load the variants with <img>.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SAMPLE, "..", "..", ".."))
SRC = os.path.join(REPO, "assets", "derived", "logos")
OUT = os.path.join(SAMPLE, "logos")


def paths(svg_text):
    body = svg_text.split("</defs>", 1)[-1]
    return re.findall(r"<path\b[^>]*?/>", body)


def bbox(raw):
    d = re.search(r' d="([^"]*)"', raw).group(1)
    nums = [float(x) for x in re.findall(r"-?\d+\.?\d*", d)]
    xs, ys = nums[0::2], nums[1::2]
    if "matrix(1, 0, 0, -1, 0, 792)" in raw:
        ys = [792 - y for y in ys]
    return min(xs), min(ys), max(xs), max(ys)


def write(name, raws, pad=1.0):
    boxes = [bbox(r) for r in raws]
    x0 = min(b[0] for b in boxes) - pad
    y0 = min(b[1] for b in boxes) - pad
    x1 = max(b[2] for b in boxes) + pad
    y1 = max(b[3] for b in boxes) + pad
    vb = f"{x0:.2f} {y0:.2f} {x1 - x0:.2f} {y1 - y0:.2f}"
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">\n' + "\n".join(raws) + "\n</svg>\n"
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(svg)
    for suffix, colour in (("oxblood", "#6E1410"), ("paper", "#F4E6D0")):
        var = re.sub(r'fill="rgb\(13\.72[0-9.%, ]*\)"', f'fill="{colour}"', svg)
        with open(os.path.join(OUT, name.replace(".svg", f"--{suffix}.svg")), "w") as fh:
            fh.write(var)
    print(name, vb, len(raws), "paths")


def main():
    os.makedirs(OUT, exist_ok=True)
    m = paths(open(os.path.join(SRC, "logo-masters-sheet.svg")).read())
    ai = paths(open(os.path.join(SRC, "logos-ai-sheet.svg")).read())
    # logo-masters-sheet.svg, document order (compare the 300 dpi PNG beside it):
    #   0 black "L" roundel; 1-16 layered wordmark; 17 red "L" roundel;
    #   18-32 spaced wordmark; 33 slate "LXL" oval; 34-35 its white letters;
    #   36 stacked "THE LUXURY LINERS" with the crossed X.
    write("stacked-lxl.svg", m[33:37])
    write("roundel-red-spaced.svg", m[17:33])
    # logos-ai-sheet.svg: 0 red roundel; 1-15 condensed wordmark over it.
    write("condensed-over-roundel.svg", ai[0:16])


if __name__ == "__main__":
    main()
