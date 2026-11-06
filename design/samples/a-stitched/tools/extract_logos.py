#!/usr/bin/env python3
"""Cut the individual marks out of the logo sheets in assets/derived/logos/.

The path data (every `d`, fill rule and transform) is copied byte for byte from
the sheets; only the viewBox is tightened around each mark. Nothing is redrawn.
Original colours are kept in the files written here; the pages inline these
paths and may map the near-black ink to the theme ink (see README, "Logos").

Run from anywhere:  python3 tools/extract_logos.py
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(SAMPLE, "..", "..", ".."))
SRC = os.path.join(REPO, "assets", "derived", "logos")
OUT = os.path.join(SAMPLE, "logos")


def paths(svg_text):
    """Every drawn <path/> (not clip paths), in document order, as raw strings."""
    body = svg_text.split("</defs>", 1)[-1]
    return re.findall(r"<path\b[^>]*?/>", body)


def bbox(raw):
    d = re.search(r' d="([^"]*)"', raw).group(1)
    nums = [float(x) for x in re.findall(r"-?\d+\.?\d*", d)]
    xs, ys = nums[0::2], nums[1::2]
    if "matrix(1, 0, 0, -1, 0, 792)" in raw:
        ys = [792 - y for y in ys]
    return min(xs), min(ys), max(xs), max(ys)


INK_FILLS = ('fill="rgb(13.729858%, 12.159729%, 12.548828%)"', 'fill="rgb(13.725281%, 12.156677%, 12.548828%)"')


def write(name, raws, title, pad=2.0):
    boxes = [bbox(r) for r in raws]
    x0 = min(b[0] for b in boxes) - pad
    y0 = min(b[1] for b in boxes) - pad
    x1 = max(b[2] for b in boxes) + pad
    y1 = max(b[3] for b in boxes) + pad
    vb = f"{x0:.2f} {y0:.2f} {x1 - x0:.2f} {y1 - y0:.2f}"
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-labelledby="t">'
        f'<title id="t">{title}</title>\n' + "\n".join(raws) + "\n</svg>\n"
    )
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(svg)
    # Web copy for the pages: the same paths in a <g id="mark">, with only the
    # near-black ink mapped to currentColor (the theme ink); red, slate and white kept.
    # Pages draw it with <svg><use href="logos/web/NAME#mark"/></svg>.
    inked = "\n".join(raws)
    for f in INK_FILLS:
        inked = inked.replace(f, 'fill="currentColor"')
    web = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">'
        f'<defs><g id="mark">\n{inked}\n</g></defs><use href="#mark"/></svg>\n'
    )
    os.makedirs(os.path.join(OUT, "web"), exist_ok=True)
    with open(os.path.join(OUT, "web", name), "w") as fh:
        fh.write(web)
    print(name, vb)


def main():
    os.makedirs(OUT, exist_ok=True)
    masters = paths(open(os.path.join(SRC, "logo-masters-sheet.svg")).read())
    ai = paths(open(os.path.join(SRC, "logos-ai-sheet.svg")).read())
    # logo-masters-sheet.svg, in document order (see the 300 dpi PNG beside it):
    #  0      black "L" roundel
    #  1-16   layered "distressed" wordmark
    #  17     red "L" roundel (flipped by its own transform)
    #  18-32  spaced wordmark
    #  33-35  slate "LXL" oval and its white L, L
    #  36     stacked "THE LUXURY LINERS" wordmark with the crossed X
    write("roundel-black.svg", [masters[0]], "The Luxury Liners roundel")
    write("roundel-red-spaced.svg", [masters[17]] + masters[18:33], "The Luxury Liners")
    write("stacked-lxl.svg", masters[33:37], "The Luxury Liners")
    # logos-ai-sheet.svg: 0 red roundel, 1-15 condensed one-line wordmark
    write("condensed-over-roundel.svg", ai[0:16], "The Luxury Liners")
    write("condensed-wordmark.svg", ai[1:16], "The Luxury Liners")


if __name__ == "__main__":
    main()
