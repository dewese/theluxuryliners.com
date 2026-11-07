#!/usr/bin/env python3
"""Write partials/rose-spray.svg: the sample's one bold embroidered element.

A Nudie-style rose spray as satin stitch: every petal and leaf is filled with a
pattern of fine parallel "thread" lines, and the pattern turns with each shape
(it lives in the shape's own rotated space), the way satin stitch changes
direction from petal to petal. Rhinestones sit around it. Colours come from the
--thread-* tokens in css/stitched.css. Decorative: aria-hidden."""
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "partials", "rose-spray.svg")
CX, CY = 220, 150
PETAL = "M0 0C-50 -6 -62 -74 0 -92C62 -74 50 -6 0 0Z"
LEAF = "M0 0C26 -30 84 -34 118 0C84 34 26 30 0 0Z"
BUD = "M0 0C-14 -6 -16 -26 0 -34C16 -26 14 -6 0 0Z"


def pattern(pid, base, hi, angle, gap=3.4):
    return (f'<pattern id="{pid}" width="{gap}" height="{gap}" patternUnits="userSpaceOnUse" '
            f'patternTransform="rotate({angle})"><rect width="{gap}" height="{gap}" class="{base}"/>'
            f'<line x1="0" y1="{gap/2}" x2="{gap}" y2="{gap/2}" class="{hi}" stroke-width="1.1"/></pattern>')


def main():
    p = []
    p.append('<svg class="rose-spray" viewBox="0 0 440 300" aria-hidden="true" focusable="false">')
    p.append("<defs>")
    p.append(pattern("sr1", "th-rose", "th-rose-hi", 30))
    p.append(pattern("sr2", "th-rose", "th-rose-hi", -35, 3.0))
    p.append(pattern("sl1", "th-leaf", "th-leaf-hi", 55))
    p.append(pattern("sl2", "th-leaf", "th-leaf-hi", -55))
    p.append(pattern("sg", "th-gold", "th-rose-hi", 0, 2.6))
    p.append("</defs>")
    # stems: thick satin-stitched curls out to the leaves and buds
    stems = [
        "M220 168C180 196 132 206 86 192C58 184 40 160 52 140",
        "M220 168C260 196 308 206 354 192C382 184 400 160 388 140",
        "M196 196C170 236 128 258 92 254",
        "M244 196C270 236 312 258 348 254",
    ]
    for d in stems:
        p.append(f'<path d="{d}" fill="none" stroke="url(#sl1)" stroke-width="9" stroke-linecap="round"/>')
        p.append(f'<path d="{d}" fill="none" class="th-leaf-edge" stroke-width="1.6" stroke-linecap="round"/>')
    # leaves, two each side, mirrored
    leaves = [(150, 186, 196, "sl1"), (120, 222, 152, "sl2"), (290, 186, -16, "sl2"), (320, 222, 28, "sl1")]
    for x, y, rot, pat in leaves:
        p.append(f'<g transform="translate({x} {y}) rotate({rot})">'
                 f'<path d="{LEAF}" fill="url(#{pat})" class="th-leaf-edge" stroke-width="3"/>'
                 f'<path d="M8 0C40 -3 80 -3 110 0" fill="none" class="th-leaf-edge" stroke-width="2.4" stroke-linecap="round"/></g>')
    # buds at the curl ends
    for x, y, rot in ((52, 140, -20), (388, 140, 20), (92, 254, -80), (348, 254, 80)):
        p.append(f'<g transform="translate({x} {y}) rotate({rot})">'
                 f'<path d="{BUD}" fill="url(#sr2)" class="th-rose-edge" stroke-width="2.6"/></g>')
    # the rose: outer five petals, inner five, then the turned centre
    for i in range(5):
        p.append(f'<path d="{PETAL}" transform="translate({CX} {CY}) rotate({i * 72 + 8})" '
                 f'fill="url(#sr1)" class="th-rose-edge" stroke-width="3.4" stroke-linejoin="round"/>')
    for i in range(5):
        p.append(f'<path d="{PETAL}" transform="translate({CX} {CY}) rotate({i * 72 + 44}) scale(0.6)" '
                 f'fill="url(#sr2)" class="th-rose-edge" stroke-width="5" stroke-linejoin="round"/>')
    p.append(f'<circle cx="{CX}" cy="{CY}" r="20" fill="url(#sg)" class="th-rose-edge" stroke-width="3"/>')
    p.append(f'<path d="M{CX} {CY - 4}c10 -4 14 8 4 13c-12 6 -22 -6 -14 -17c9 -12 30 -8 30 10" fill="none" '
             f'class="th-rose-edge" stroke-width="3.2" stroke-linecap="round"/>')
    # rhinestones
    stones = [(110, 120, 6), (330, 120, 6), (220, 30, 7), (160, 60, 5), (280, 60, 5), (60, 222, 5),
              (380, 222, 5), (220, 268, 6), (170, 252, 4.5), (270, 252, 4.5), (24, 176, 4.5), (416, 176, 4.5)]
    for x, y, r in stones:
        p.append(f'<circle cx="{x}" cy="{y}" r="{r}" class="th-stone" stroke-width="1.6"/>'
                 f'<circle cx="{x - r * 0.35:.1f}" cy="{y - r * 0.35:.1f}" r="{r * 0.3:.1f}" class="th-rose-edge" stroke-width="0" fill="#bcd3e6"/>')
    p.append("</svg>")
    with open(OUT, "w") as fh:
        fh.write("\n".join(p) + "\n")


if __name__ == "__main__":
    main()
