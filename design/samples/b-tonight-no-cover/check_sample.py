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


# Private literals (the founding-story town and the rest) are matched by a keyed digest
# (HMAC-SHA256) of a lower-cased token, never written in this public repository; the same
# digests as content/private-literals.mjs (the source of truth: add new ones there and here).
import hashlib, hmac
def _private_key():
    """PRIVATE_LITERALS_KEY, else the git-ignored data/private/private-literals.key (None: no check)."""
    k = os.environ.get("PRIVATE_LITERALS_KEY", "").strip()
    if k:
        return k
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "data", "private", "private-literals.key")
    try:
        return open(p).read().strip() or None
    except OSError:
        return None
PRIVATE_KEY = _private_key()
def _digest(s, key=None):
    return hmac.new((key or PRIVATE_KEY).encode(), s.encode(), hashlib.sha256).hexdigest()
PRIVATE_HASHES = {
    "8acbf0d82b2b671ff0e3fbcaeb0218e817b3d173fd31d894144e0cc5f32f735e",
    "ea6ce4733b8604c4800279fb041c0529dbb0752854ecacfed8386f465a1dcb37",
    "708aadc7fe42db927f180a49b7f33ec17e546fc654d615f75be87c882f3f6812",
    "6fc1e9b9955b7845b6f47a327b6eb949905c8ff02c757d359c88c13aa2338d20",
    "d7cdad84a3be17cc5a28986250ad3a0b283484169f7f88081529d5146a9ecab0",
    "5873f749d4392e386d5276f406a47c24fd2943bcadcae78d948ab057bf2ed8e8",
    "6b8af0fa26a6764f737bfcea3f1acaf9416ef4ef5f58b9af551897b03ebf8d40",
    "d5666a5ac38c2934235aaa8bee2cf08f60b6580609e72e93d806dad75e75253f",
}


def private_hit(text, hashes=PRIVATE_HASHES, key=None):
    """The first token (or word pair) of the text whose digest is private, else None (also None
    when there is no key on this machine: the check is off, as in content/private-literals.mjs)."""
    if not (key or PRIVATE_KEY):
        return None
    toks = re.findall(r"[a-z0-9][a-z0-9@._-]*[a-z0-9]|[a-z0-9]", text.lower())
    for k, t in enumerate(toks):
        cands = [t] + [p for p in re.split(r"[.@/_-]+", t) if p]
        if k + 1 < len(toks):
            cands += [t + " " + toks[k + 1], t + toks[k + 1]]
        for c in cands:
            if _digest(c, key) in hashes:
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
    if private_hit("see zz-synthetic here", {_digest("zz-synthetic", "zz-self-test-key")}, "zz-self-test-key") is None:
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
