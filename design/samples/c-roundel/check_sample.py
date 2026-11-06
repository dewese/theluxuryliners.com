#!/usr/bin/env python3
"""Banned-content check for design sample C ("Roundel"). Adapted from sample A's checker.

Scans every public file in this folder (HTML, CSS, JS, SVG, README) for things the
owner decisions rule out, plus the sample's own rules. Exit 1 on any error.

    python3 check_sample.py            # scan
    python3 check_sample.py --self-test  # prove every rule fires

It complements, not replaces, the repository's content checker, which is also worth
running here:  node content/check-content.mjs --dist-only design/samples/c-roundel

Rules are kept generic on purpose: the excluded-names list (X1) and the privacy
specifics (the college, later-life profile, family pages) are not written into this
public repository; their *categories* are caught instead (school words, addresses,
phone numbers, any email address, state-by-member wording).
"""
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEXT_EXT = {".html", ".css", ".js", ".svg", ".md"}

ONE_LINER = ("The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad "
             "Edgington, who took it to Nashville together. The name comes from the Gram Parsons song "
             "'Luxury Liner'.")
LL17 = "The band never broke up. The four forever members reconnected during the pandemic and started making music again."
P23 = "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002"

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

PRIVATE = object()  # rule marker: the hashed private-literal matcher instead of a regex

# (id, regex, message, where) where: "text" = visible page text and attributes,
# "raw" = the whole file (code and markup too)
RULES = [
    ("email", r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", "No email address of any kind (LL-31: the contact address lives only in the Worker config)", "raw"),
    ("gmail", r"gmail", "No band Gmail", "raw"),
    ("phone", r"(?<![\d.])\(?\d{3}\)?[ .-]\d{3}-\d{4}(?![\d.])", "No phone numbers", "text"),
    ("postal", r"\b\d{2,5} [A-Z][a-z]+ (Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Blvd|Pike)\b|\bP\.?O\.? Box\b", "No mailing addresses", "text"),
    ("school", r"\b(college|university|campus|graduat\w*|alma mater)\b", "No college or school details (LL-7, privacy)", "text"),
    ("family", r"\b(parents|wife|husband|kids|children|daughter|son|brother|sister|family)\b", "Nothing about members' lives outside the band (LL-7)", "text"),
    ("jobs", r"\b(dads? with careers|day jobs?|his job|works as|career)\b", "Nothing about members' lives outside the band (LL-7, LL-17)", "text"),
    ("lives-where", r"\b(lives|living|moved|based) in (Tennessee|Michigan|Texas)\b|\bfour states\b", "Never which member lives where (LL-19)", "text"),
    ("town", PRIVATE, "Founding-story town names never appear (LL-4, LL-5)", "text"),
    ("talent-show", r"talent[- ]show|won the contest|win the contest", "No talent-show story (LL-13)", "text"),
    ("demo", r"\bdemo\b|bonus disc|Make The Best Of It|Kool Kat", "Never imply 'Great Day' is the 2008 demo; no bonus-disc mention or link (LL-13)", "text"),
    ("downloads", r"\.mp3\b|\bdownload(s|able)?\b|\bfree MP3", "No MP3s or downloads (LL-27)", "text"),
    ("mp3-link", r"href=\"[^\"]*\.(mp3|wav|zip)\"|\bdownload=", "No download links (LL-27)", "raw"),
    ("newsletter", r"newsletter|mailing list|sign[- ]?up|subscribe", "No newsletter (LL-40)", "text"),
    ("logo-credit", r"\b(logo|logos)\b[^.]{0,40}\b(designed|design) by\b|\bGlen\b|Cowart|andersonthomas", "No logo designer credit (LL-39)", "text"),
    ("sourcing", r"as credited|according to (the|his|David)|search snippet|per Discogs|Wayback|single-source|confirmed-owner|verified-source|\bLL-\d+\b|\b[FPXR]\d{1,2}\b", "No sourcing notes or decision codes in public copy", "text"),
    ("broke-up", r"(?<!never )broke up|break-?up\b|\breunion\b|reunited|back together|together again", "Only 'never broke up'; no reunion wording (LL-17)", "text"),
    ("former", r"\bformer (member|bassist|drummer|guitarist)|\bone-time\b|Nashville-based", "No 'former', 'one-time' or 'Nashville-based'", "text"),
    ("april-2001", r"April 2001", "Chad left in March 2001, never April (LL-15)", "text"),
    ("line-up-2002", r"2002 line-?up", "Never 'the 2002 line-up' (P23)", "text"),
    ("held", r"Hot Prospects|Monsters of Pop|Texas Pop|Barlowe|Hatch Show", "Held or unverified items never publish", "text"),
    ("contact-addr", r"dewese\.com(?!/)|mailto:", "The contact address never appears in built files (LL-31)", "raw"),
    ("believe-cher", r"(?<!Cher’s )(?<!Cher's )“Believe”(?![^<]{0,40}\(Cher\))", "“Believe” the song always comes with Cher (P27)", "raw-html-believe"),
    ("shake-cover", r"Shake It Up[^.]{0,60}\bcover\b(?! of Cher)", "“Shake It Up” is an original, never a cover (P27)", "text"),
    ("dates-unverified", r"\(confirm\)|probable; confirm|positions unconfirmed", "Unconfirmed caption notes never publish", "text"),
    ("ten-songs", r"Ten songs by the trio|songs by the trio", "Overbored lede must not credit all the songs to the trio (Chad co-wrote)", "text"),
    ("quote-1998", r"Manuel[^.]{0,80}1998[^.]{0,40}(said|says|told)|“[^”]*Nudie[^”]*”", "No Manuel/Nudie quotation (David's account is from 2001 and must not be dated 1998 or set over the pale-suit photos)", "text"),
    ("youtube-cookie", r"youtube\.com/embed", "Embeds use youtube-nocookie.com only", "raw"),
    ("third-party", r"fonts\.googleapis|fonts\.gstatic|<script[^>]+src=\"https?://|<link[^>]+href=\"https?://[^\"]+\.css", "Fonts and scripts are self-hosted", "raw"),
    ("inline-style", r"<style\b|\sstyle=\"", "No inline styles", "raw-html"),
    ("soundcloud", r"soundcloud|myspace|noisetrade|bigcartel|isawtheocean", "Excluded hosts", "raw"),
]

REQUIRED = {
    "index.html": [ONE_LINER, P23, LL17, "Founded in 1997. Two new singles in 2026. The band never broke up.",
                   "Latest release: New Beginning, April 2026", "writes songs"],
    "overbored.html": ["Cover art: David Dewese", "Cover art: all rights reserved by the rights holders."],
    "story-believe.html": ["Believe, SXSW and Chad’s last show", "a cover of Cher’s “Believe”", "March 2001",
                           "Cover art: Mark Montgomery"],
}

# Photo credits: only credits marked named-credit-confirmed in data/assets.json may show.
ALLOWED_CREDITS = {"Photo: Mark Montgomery", "Photo: Amy Wilstermann"}


def visible_text(src):
    """Visible text plus alt/title/aria-label/content attributes, entity-decoded."""
    attrs = " ".join(re.findall(r'\b(?:alt|title|aria-label|content|placeholder)="([^"]*)"', src))
    body = re.sub(r"<(script|style)\b.*?</\1>", " ", src, flags=re.S | re.I)
    body = re.sub(r"<svg\b.*?</svg>", " ", body, flags=re.S | re.I)  # logo/ornament geometry
    body = re.sub(r"<[^>]+>", " ", body)
    t = html.unescape(body + " " + html.unescape(attrs))
    t = t.replace("‘", "'").replace("’", "'").replace(" ", " ")
    return re.sub(r"\s+", " ", t)


def scan_file(rel, src, kind):
    errors = []
    text = visible_text(src) if kind == ".html" else (src if kind == ".md" else "")
    for rid, rx, msg, where in RULES:
        if where == "text" and kind not in (".html",):
            continue
        if where in ("raw-html", "raw-html-believe") and kind != ".html":
            continue
        hay = text if where == "text" else src
        if where == "raw-html-believe":
            hay = re.sub(r"<[^>]+>", "", src)
        if rx is PRIVATE:
            if private_hit(hay):
                errors.append(f"{rel}: [{rid}] {msg}")
            continue
        flags = re.I if rid not in ("sourcing", "phone") else 0
        for m in re.finditer(rx, hay, flags):
            errors.append(f"{rel}: [{rid}] {msg}\n    > {hay[max(0, m.start() - 40):m.end() + 40]!r}")
            break
    if kind == ".html":
        # any sentence that begins the one-liner must be the whole one-liner
        start = "The Luxury Liners are a power-pop band"
        for m in re.finditer(re.escape(start), text):
            if not text[m.start():].startswith(ONE_LINER):
                errors.append(f"{rel}: [one-liner] the LL-6 one-liner must be verbatim")
        # the reconnection is told only in LL-17's words
        if re.search(r"reconnect", text, re.I) and LL17 not in text:
            errors.append(f"{rel}: [ll17] the reconnection must use the LL-17 wording verbatim")
        # the cover-rights line only where a cover is shown
        if "all rights reserved by the rights holders" in text and not re.search(r'alt="(Cover of|Artwork for)', src):
            errors.append(f"{rel}: [rights-line] cover-rights notice without a cover on the page")
        for c in re.findall(r"Photo: [A-Z][a-z]+ [A-Z][a-z]+", text):
            if c not in ALLOWED_CREDITS:
                errors.append(f"{rel}: [credit] {c!r} is not a confirmed credit")
        # the 2002 photo's caption is exact wherever it appears
        if "in 2002" in text and "Scott Carpenter" in text and P23 not in text:
            errors.append(f"{rel}: [p23] the 2002 caption must be exact")
    return errors


def scan():
    errors = []
    for root, dirs, files in os.walk(HERE):
        dirs[:] = [d for d in dirs if d not in ("screenshots", "__pycache__", "node_modules")]
        for f in files:
            ext = os.path.splitext(f)[1]
            if ext not in TEXT_EXT or f == "check_sample.py":
                continue
            p = os.path.join(root, f)
            rel = os.path.relpath(p, HERE)
            if rel == "README.md":
                # the README explains the rules, so only the raw privacy rules apply to it
                src = open(p, encoding="utf-8").read()
                for rid in ("email", "gmail", "town"):
                    rx = next(r for r in RULES if r[0] == rid)[1]
                    if private_hit(src) if rx is PRIVATE else re.search(rx, src, re.I):
                        errors.append(f"{rel}: [{rid}] privacy rule")
                continue
            errors += scan_file(rel, open(p, encoding="utf-8").read(), ext)
    for page, needles in REQUIRED.items():
        p = os.path.join(HERE, page)
        if not os.path.exists(p):
            errors.append(f"{page}: missing")
            continue
        t = visible_text(open(p, encoding="utf-8").read())
        for n in needles:
            if n.replace("’", "'") not in t:
                errors.append(f"{page}: [required] missing {n!r}")
    return errors


def self_test():
    bad = {
        "email": "<p>write to someone@example.com</p>",
        "talent-show": "<p>the college talent show</p>",
        "demo": "<p>Great Day was a demo</p>",
        "downloads": "<p>free download</p>",
        "newsletter": "<p>Join our newsletter</p>",
        "logo-credit": "<p>Logos designed by Glen</p>",
        "sourcing": "<p>as credited on David's 2010 discography page</p>",
        "broke-up": "<p>the band broke up</p>",
        "april-2001": "<p>left in April 2001</p>",
        "ten-songs": "<p>Ten songs by the trio.</p>",
        "lives-where": "<p>Scott lives in Michigan</p>",
        "youtube-cookie": '<iframe src="https://www.youtube.com/embed/x"></iframe>',
        "inline-style": '<p style="color:red">x</p>',
        "rights-line": "<p>Cover art: all rights reserved by the rights holders.</p>",
        "contact-addr": "<p>mailto:x</p>",
        "believe-cher": "<p>a song called “Believe”</p>",
        "shake-cover": "<p>Shake It Up, a cover version</p>",
        "credit": "<p>Photo: Trey Mitchell</p>",
        "one-liner": "<p>The Luxury Liners are a power-pop band from Texas.</p>",
    }
    missed = [k for k, v in bad.items() if not any(f"[{k}]" in e for e in scan_file("t.html", v, ".html"))]
    # the hashed matcher, on a synthetic token (never a real private literal)
    if private_hit("see zz-synthetic here", {_digest("zz-synthetic", "zz-self-test-key")}, "zz-self-test-key") is None:
        missed.append("town (hashed matcher)")
    if missed:
        print("self-test: rules that did not fire:", missed)
        return 1
    print(f"self-test: all {len(bad)} probes fired")
    return 0


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(self_test())
    errs = scan()
    for e in errs:
        print("ERROR", e)
    print(f"{len(errs)} error(s)")
    sys.exit(1 if errs else 0)
