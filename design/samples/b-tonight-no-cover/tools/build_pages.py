#!/usr/bin/env python3
"""Assemble the three sample pages from tools/src/*.html.

Substitutions:
  {{HEAD title|description}}  the shared <head>
  {{HEADER page}}             masthead with the stacked LXL logo inlined
  {{FOOTER}}                  footer with the red roundel + spaced wordmark inlined
  {{LOGO name}}               any logo from logos/, inlined (paths verbatim)
Every <img> under img/ gets width and height read from the file.
Run:  python3 tools/build_pages.py
"""
import os
import re
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
SRC = os.path.join(HERE, "src")
INK = 'fill="rgb(13.7'  # the sheets' near-black ink, both sheets


def logo(name):
    svg = open(os.path.join(SAMPLE, "logos", name + ".svg")).read().strip()
    svg = svg.replace("<svg ", '<svg aria-hidden="true" focusable="false" ', 1)
    # tag the near-black ink so CSS can paint it in the theme ink; d is untouched
    svg = re.sub(r'<path (?=[^>]*' + re.escape(INK) + ')', '<path class="ink" ', svg)
    return svg


NAV = [("story-nudie-suits.html", "Story", "story"), ("overbored.html", "Music", "music"),
       ("#people", "People", "people"), ("#vault", "Vault", "vault"), ("#listen", "Listen", "listen")]


def head(arg):
    title, desc = [s.strip() for s in arg.split("|", 1)]
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex">
<script>(function(){{var t=null;try{{t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("ll-theme");}}catch(e){{}}if(t==="dark"||t==="light"){{document.documentElement.setAttribute("data-theme",t);}}}})();</script>
<link rel="preload" href="fonts/big-shoulders-display-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/archivo-roman.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/poster.css">
<script src="js/site.js" defer></script>
</head>"""


def header(page):
    items = []
    for href, label, key in NAV:
        cur = ' aria-current="page"' if key == page else ""
        items.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    home_cur = ' aria-current="page"' if page == "home" else ""
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
<div class="wrap">
<a class="home-link" href="index.html"{home_cur}><span class="visually-hidden">The Luxury Liners, home</span>{logo("stacked-lxl")}</a>
<nav class="nav" aria-label="Main">
<ul>{"".join(items)}</ul>
</nav>
</div>
</header>"""


FOOTER = """<footer class="site-foot">
<div class="wrap foot-grid">
<div>
<div class="foot-logo">{roundel}</div>
<button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false" hidden>After hours (dark theme)</button>
</div>
<div>
<h2 class="visually-hidden">More from the band</h2>
<ul class="foot-links">
<li><a href="#shows">Shows</a></li><li><a href="#photos">Photos</a></li><li><a href="#press">Press</a></li>
<li><a href="#epk">EPK</a></li><li><a href="#facts">Facts</a></li><li><a href="#contact">Contact</a></li>
<li><a href="#accessibility">Accessibility</a></li><li><a href="#privacy">Privacy</a></li>
</ul>
<ul class="foot-links" style="margin-top:0.75rem">
<li><a href="https://www.instagram.com/theluxuryliners/">Instagram</a></li>
<li><a href="https://www.facebook.com/theluxuryliners">Facebook</a></li>
<li><a href="https://daviddewese.bandcamp.com/">Bandcamp</a></li>
<li><a href="https://daviddewese.com/">David Dewese</a></li>
<li><a href="https://foxymorons.com/">The Foxymorons</a></li>
</ul>
<p class="colophon">The band’s logos date from 1999–2002 and are reproduced from the original artwork. Set in Big Shoulders Display and Archivo. Cover art: all rights reserved by the rights holders.</p>
<p class="colophon">Design sample B, “Tonight, No Cover”. Not the live site.</p>
</div>
</div>
</footer>"""


def img_sizes(html):
    def fix(m):
        tag = m.group(0)
        if " width=" in tag:
            return tag
        src = re.search(r'src="(img/[^"]+)"', tag).group(1)
        w, h = Image.open(os.path.join(SAMPLE, src)).size
        return tag[:-1].rstrip("/").rstrip() + f' width="{w}" height="{h}">'
    return re.sub(r'<img\b[^>]*src="img/[^>]*>', fix, html)


def build(name):
    s = open(os.path.join(SRC, name)).read()
    s = re.sub(r"\{\{HEAD ([^}]*)\}\}", lambda m: head(m.group(1)), s)
    s = re.sub(r"\{\{HEADER (\w+)\}\}", lambda m: header(m.group(1)), s)
    s = s.replace("{{FOOTER}}", FOOTER.replace("{roundel}", logo("roundel-red-spaced")))
    s = re.sub(r"\{\{LOGO ([\w-]+)\}\}", lambda m: logo(m.group(1)), s)
    s = img_sizes(s)
    assert "{{" not in s, name
    with open(os.path.join(SAMPLE, name), "w") as fh:
        fh.write(s)
    print(name, len(s) // 1024, "KB")


if __name__ == "__main__":
    for n in sorted(os.listdir(SRC)):
        if n.endswith(".html"):
            build(n)
