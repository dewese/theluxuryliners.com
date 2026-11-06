#!/usr/bin/env python3
"""Banned-content check for design sample B ("Tonight, No Cover").

Scans the built pages (visible text, alt/title/aria-label/content attributes
and raw markup), js/ and css/, and checks every file in the folder for the
contact address and other private data. Exit 1 on any failure.

    python3 check_sample.py              check the sample
    python3 check_sample.py --self-test  prove every banned pattern fires

Complements the repository's content checker, which can also be run on this
folder:  node content/check-content.mjs --dist-only design/samples/b-tonight-no-cover
"""
import html
import os
import re
import sys
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
PAGES = ["index.html", "overbored.html", "story-nudie-suits.html"]
MAX_BYTES = 8 * 1024 * 1024

ONE_LINER = ("The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad "
             "Edgington, who took it to Nashville together. The name comes from the Gram Parsons "
             "song 'Luxury Liner'.")
LL17 = ("The band never broke up. The four forever members reconnected during the pandemic and "
        "started making music again.")
CAPTION_2002 = "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002"

# (label, pattern) checked against the public text of every page
BANNED_TEXT = [
    ("contact address or any email address (LL-31)", r"[\w.+-]+@[\w-]+\.[\w.]+"),
    ("band Gmail", r"gmail"),
    ("talent-show story (LL-13)", r"talent[\s-]?show|\bcontest\b"),
    ("Great Day demo / bonus disc (LL-13)", r"\bdemo\b|bonus[\s-]?dis[ck]|kool kat"),
    ("downloads or MP3s (LL-27)", r"\.mp3\b|\bmp3s?\b|\bdownload"),
    ("newsletter or sign-up (LL-40)", r"newsletter|mailing list|sign[\s-]?up|subscribe"),
    ("logo designer credit (LL-39)", r"\bglen\b|logo (?:was )?design(?:ed|er)|designed by"),
    ("sourcing notes in public copy", r"as credited|according to|discogs|flickr|wayback|archive\.org|"
                                      r"single-source|verified|confidence|search snippet|research/|"
                                      r"\bLL-\d+\b|\[?\b[FPXR]\d{1,2}\b\]?|withheld"),
    ("lives outside the band (LL-7, LL-19)", r"lives in|living in|\bcareers?\b|\bdads?\b|\bwife\b|"
                                             r"\bkids?\b|children|family|college|university|graduat"),
    ("member-by-state or 'four states' (LL-19)", r"four states|three states|michigan|tennessee"),
    ("parents' house (LL-4, LL-5); the founding town is checked by private_hit()", r"parents"),
    ("phone numbers", r"(?:\(\d{3}\)\s?|\b\d{3}[-.\s])\d{3}[-.]\d{4}\b"),
    ("'broke up' other than 'never broke up' (LL-17)", r"(?<!never )broke up|break[\s-]?up|split up"),
    ("reunion wording (LL-17)", r"reunion|reunit|together again|back together|comeback"),
    ("'former' of a member", r"\bformer\b"),
    ("unverified items", r"hot prospects|monsters of pop|hatch show"),
    ("'2002 line-up' (P23)", r"2002 line-?up"),
    ("Chad left in April (LL-15)", r"april 2001"),
    ("expired or excluded hosts", r"isawtheocean|soundcloud|myspace|noisetrade|bigcartel"),
]


# Private literals (the founding-story town and the rest) are matched by the SHA-256 of a
# lower-cased token, never written in this public repository; the same hashes as
# content/private-literals.mjs (the source of truth: add new ones there and here).
import hashlib
PRIVATE_HASHES = {
    "bd69e39fea034e7dab1702391ba0af52d8bb4cfddeefef293bf9ae1577a013ea",
    "81963d441096beff3a2867e7fbffe88e81a21e90fb6684a4c239b68e9d2b937a",
    "7b8bd6c0abf53d22888beafc48830e1156907dd4ec7e6ea31e55a0dd6dc5a969",
    "f6a761f669dfeafd8086a367b336cbee496a1b13ac5128c8cb9346ca7891ccf3",
    "270e826aaea2ede6497f2383a2e0c2fe418a737a8224fc8888e4821158342f5d",
    "921329720029ded97c7725d6a6508f110e9488d3bbf614a33babec8f3ea383a6",
    "0c6193e11c89c15a1715161c094efa47adfc6585cd66021968336d5b4d4fc321",
    "2c96398674dbc4e58b556e6fbf53f85b80be112a3c9113851f431d3a67275208",
}


def private_hit(text, hashes=PRIVATE_HASHES):
    """The first token (or word pair) of the text whose hash is private, else None."""
    toks = re.findall(r"[a-z0-9][a-z0-9@._-]*[a-z0-9]|[a-z0-9]", text.lower())
    for k, t in enumerate(toks):
        cands = [t] + [p for p in re.split(r"[.@/_-]+", t) if p]
        if k + 1 < len(toks):
            cands += [t + " " + toks[k + 1], t + toks[k + 1]]
        for c in cands:
            if hashlib.sha256(c.encode()).hexdigest() in hashes:
                return c
    return None

REQUIRED = {
    "index.html": [ONE_LINER, LL17, CAPTION_2002,
                   "Founded in 1997. Two new singles in 2026. The band never broke up."],
}


SELF_TEST = [  # one line per banned pattern, in order; each must be caught
    "write to someone@example.com", "the band gmail", "won the talent show", "the 2008 demo",
    "free MP3 downloads", "join the newsletter", "logo designed by Glen", "as credited on Discogs",
    "he lives in a city", "spread across four states", "at my parents' house", "call 615-555-0100",
    "when they broke up", "the reunion show", "former drummer", "Hot Prospects", "the 2002 line-up",
    "Chad left in April 2001", "on SoundCloud",
]


def self_test():
    bad = [ex for (label, pat), ex in zip(BANNED_TEXT, SELF_TEST) if not re.search(pat, norm(ex), re.I)]
    if private_hit("see zz-synthetic here", {hashlib.sha256(b"zz-synthetic").hexdigest()}) is None:
        bad.append("hashed private matcher")
    ok = not re.search(BANNED_TEXT[12][1], "The band never broke up.", re.I)
    print("self-test:", "pass" if not bad and ok and len(SELF_TEST) == len(BANNED_TEXT) else f"FAIL {bad}")
    return 0 if not bad and ok else 1


class Text(HTMLParser):
    """Visible text plus the attributes a reader or search engine sees."""
    ATTRS = ("alt", "title", "aria-label", "content", "placeholder", "data-title")

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts, self.skip = [], 0
        self.scripts, self.links, self.iframes = [], [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
            if tag == "script" and a.get("src"):
                self.scripts.append(a["src"])
        if tag == "link" and a.get("href"):
            self.links.append(a["href"])
        if tag == "iframe":
            self.iframes.append(a.get("src", ""))
        for k in self.ATTRS:
            if a.get(k):
                self.parts.append(a[k])
        self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
        self.parts.append(" ")

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def norm(t):
    t = html.unescape(t)
    for a, b in (("‘", "'"), ("’", "'"), ("“", '"'), ("”", '"'), (" ", " ")):
        t = t.replace(a, b)
    return re.sub(r"\s+", " ", t)


def main():
    fails = []

    def fail(where, msg):
        fails.append(f"{where}: {msg}")

    for page in PAGES:
        raw = open(os.path.join(HERE, page), encoding="utf-8").read()
        p = Text()
        p.feed(raw)
        text = norm("".join(p.parts))
        if private_hit(raw):
            fail(page, "a private literal (hashed match; LL-4, LL-5, LL-7)")
        for label, pat in BANNED_TEXT:
            m = re.search(pat, text, re.I)
            if m:
                fail(page, f"{label}: …{text[max(0, m.start() - 40):m.end() + 40]}…")
        for need in REQUIRED.get(page, []):
            if norm(need) not in text:
                fail(page, f"missing required wording: {need[:60]}…")
        for src in p.scripts + p.links:
            if re.match(r"(?:https?:)?//", src):
                fail(page, f"third-party script or stylesheet: {src}")
        if p.iframes:
            fail(page, "an iframe is in the static page (YouTube must be click-to-load)")
        for m in re.finditer(r"youtube(?:-nocookie)?\.com/embed", raw):
            fail(page, "a YouTube embed URL is in the static page")
        if "<!doctype html>" not in raw.lower()[:20]:
            fail(page, "no doctype")
        if 'class="skip"' not in raw or 'id="main"' not in raw:
            fail(page, "skip link or #main missing")

    js = open(os.path.join(HERE, "js", "site.js"), encoding="utf-8").read()
    if "youtube-nocookie.com/embed/" not in js or re.search(r"www\.youtube\.com/embed", js):
        fail("js/site.js", "facade must load youtube-nocookie.com only")

    # Every file in the folder (README, tools, logos, CSS, JS): private data never appears.
    total = 0
    for dirpath, dirs, files in os.walk(HERE):
        dirs[:] = [d for d in dirs if d != "__pycache__"]
        for f in files:
            path = os.path.join(dirpath, f)
            total += os.path.getsize(path)
            if f.endswith((".png", ".webp", ".woff2")) or f == "check_sample.py":
                continue
            body = open(path, encoding="utf-8", errors="replace").read()
            rel = os.path.relpath(path, HERE)
            if re.search(r"dewese\.com", body.replace("daviddewese.com", "")) or "@dewese" in body:
                fail(rel, "the contact address or its domain")
            if re.search(r"gmail\.com", body, re.I):
                fail(rel, "a Gmail address")
            if re.search(r"\.mp3\b", body, re.I):
                fail(rel, "an .mp3 reference")
    if total > MAX_BYTES:
        fail("folder", f"{total / 1048576:.1f} MB, over the 8 MB budget")

    for f in fails:
        print("FAIL", f)
    print(f"{len(PAGES)} pages checked, folder {total / 1048576:.2f} MB: "
          + ("all clear" if not fails else f"{len(fails)} failure(s)"))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(self_test() if "--self-test" in sys.argv else main())
