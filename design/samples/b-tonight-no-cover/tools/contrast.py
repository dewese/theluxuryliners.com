#!/usr/bin/env python3
"""WCAG 2.x contrast for the sample's colour pairs, both themes.
Text pairs must reach 7:1 (the plan's pair rule); UI pairs 3:1.  python3 tools/contrast.py"""
import sys


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


PAIRS = [  # (theme, what, fg, bg, minimum)
    ("light", "ink on paper", "#6E1410", "#F4E6D0", 7), ("light", "link on paper", "#1F4E79", "#F4E6D0", 7),
    ("light", "ink on card", "#6E1410", "#FBF4E8", 7), ("light", "link on card", "#1F4E79", "#FBF4E8", 7),
    ("light", "paper on blue block", "#F4E6D0", "#1F4E79", 7),
    ("dark", "paper on oxblood", "#F4E6D0", "#6E1410", 7), ("dark", "powder link on oxblood", "#CFE3F2", "#6E1410", 7),
    ("dark", "paper on card", "#F4E6D0", "#4E0D0A", 7), ("dark", "powder link on card", "#CFE3F2", "#4E0D0A", 7),
    ("dark", "paper on navy block", "#F4E6D0", "#0E2A44", 7),
    ("both", "white play label on black", "#FFFFFF", "#000000", 7),
    ("both", "white play label on oxblood (hover)", "#FFFFFF", "#6E1410", 4.5),
]
bad = 0
for theme, what, fg, bg, need in PAIRS:
    r = ratio(fg, bg)
    ok = r >= need
    bad += not ok
    print(f"{'ok  ' if ok else 'FAIL'} {theme:5} {what:38} {r:5.2f}:1 (need {need})")
sys.exit(1 if bad else 0)
