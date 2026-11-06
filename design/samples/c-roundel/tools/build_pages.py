#!/usr/bin/env python3
"""Assemble design sample C's three pages from shared partials, so the header, footer
and logo sprite are identical on every page.

Copy comes from content/ (home.md, story/04-believe.md, story/06-overbored.md,
people.json, press.json) and data/releases.json. It is written out here by hand, not
parsed, so nothing internal (sources, notes, confidence labels) can reach a page.

Logos: logos/sprite.svg holds one <symbol> per mark, with the path data from
logos/web/*.svg verbatim (see tools/extract_logos.py); pages draw them with
<use href="logos/sprite.svg#id">. (An inline sprite was tried first: the raw path numbers
trip the repository checker's phone-number rule, so the paths stay out of the HTML.)
External <use> needs HTTP, not file://.

Run:  python3 tools/build_pages.py
"""
import html
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
WEB = os.path.join(SAMPLE, "logos", "web")

SYMBOLS = {
    # symbol id: logos/web file
    "lx-roundel": "roundel-red.svg",          # red "L" roundel, red kept
    "lx-roundel-ink": "roundel-black.svg",    # the same mark in the theme ink (currentColor)
    "lx-wordmark": "condensed-wordmark.svg",  # condensed one-line wordmark, crossed X
    "lx-full": "condensed-over-roundel.svg",  # condensed wordmark over the red roundel
    "lx-spaced": "roundel-red-spaced.svg",    # red roundel with the spaced wordmark
}


def _symbol(sid):
    src = open(os.path.join(WEB, SYMBOLS[sid])).read()
    vb = re.search(r'viewBox="([^"]+)"', src).group(1)
    inner = re.search(r'<g id="mark">(.*?)</g></defs>', src, re.S).group(1).strip()
    return f'<symbol id="{sid}" viewBox="{vb}">{inner}</symbol>', vb


VIEWBOX = {sid: _symbol(sid)[1] for sid in SYMBOLS}


def write_sprite():
    syms = "\n".join(_symbol(s)[0] for s in SYMBOLS)
    with open(os.path.join(SAMPLE, "logos", "sprite.svg"), "w") as fh:
        fh.write(f'<svg xmlns="http://www.w3.org/2000/svg">\n<defs>\n{syms}\n</defs>\n</svg>\n')


def mark(sid, cls, label=None, label_id=None):
    # The outer viewBox starts at 0 0: the <use> viewport is 100% of it, and the
    # symbol's own viewBox maps the original sheet coordinates into it.
    w, h = VIEWBOX[sid].split()[2:]
    vb = f"0 0 {w} {h}"
    use = f'<use href="logos/sprite.svg#{sid}"/>'
    if label:
        return (f'<svg class="{cls}" viewBox="{vb}" role="img" aria-labelledby="{label_id}">'
                f'<title id="{label_id}">{html.escape(label)}</title>{use}</svg>')
    return f'<svg class="{cls}" viewBox="{vb}" aria-hidden="true" focusable="false">{use}</svg>'


def dot(ink=False):
    """The small roundel used as a marker (section heads, bullets, buttons)."""
    return mark("lx-roundel-ink" if ink else "lx-roundel", "dot")


NAV = [
    ("Story", "story-believe.html", "story"),
    ("Music", "overbored.html", "music"),
    ("People", "/people/", None),
    ("Vault", "/vault/", None),
    ("Listen", "/listen/", None),
]

ONE_LINER = ("The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad "
             "Edgington, who took it to Nashville together. The name comes from the Gram Parsons song "
             "'Luxury Liner'.")
STATUS = "Founded in 1997. Two new singles in 2026. The band never broke up."
LL17 = ("The band never broke up. The four forever members reconnected during the pandemic and "
        "started making music again.")
P23 = "David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002"


def page(title, desc, current, main, symbols):
    nav = "\n".join(
        f'<li><a href="{href}"{" aria-current=\"page\"" if key and key == current else ""}>{label}</a></li>'
        for label, href, key in NAV
    )
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="color-scheme" content="light dark">
<link rel="preload" href="fonts/archivo-black.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/archivo-text.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/roundel.css">
<link rel="icon" href="logos/roundel-red.svg" type="image/svg+xml">
<script src="js/theme.js"></script>
<script src="js/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
<div class="wrap masthead__bar">
<a class="brand" href="index.html">{dot()}{mark("lx-wordmark", "brand__word")}<span class="visually-hidden">The Luxury Liners, home</span></a>
<nav class="nav" aria-label="Main">
<ul>
{nav}
</ul>
</nav>
</div>
</header>
<main id="main" tabindex="-1">
{main}
</main>
<footer class="foot">
<div class="wrap foot__grid">
<div class="foot__mark">{mark("lx-roundel-ink", "foot__roundel")}</div>
<nav aria-label="Site">
<ul class="foot__links">
<li><a href="/shows/">Shows</a></li>
<li><a href="/photos/">Photos</a></li>
<li><a href="/press/">Press</a></li>
<li><a href="/epk/">EPK</a></li>
<li><a href="/facts/">Facts</a></li>
<li><a href="/contact/">Contact</a></li>
<li><a href="/accessibility/">Accessibility</a></li>
<li><a href="/privacy/">Privacy</a></li>
</ul>
</nav>
<div>
<ul class="foot__links" aria-label="The band elsewhere">
<li><a href="https://www.instagram.com/theluxuryliners/">Instagram</a></li>
<li><a href="https://www.facebook.com/theluxuryliners">Facebook</a></li>
<li><a href="https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc">Spotify</a></li>
<li><a href="https://music.apple.com/us/artist/the-luxury-liners/47333263">Apple Music</a></li>
<li><a href="https://daviddewese.bandcamp.com/">Bandcamp</a></li>
</ul>
<ul class="foot__links" aria-label="Related sites">
<li><a href="https://daviddewese.com/">David Dewese</a></li>
<li><a href="https://foxymorons.com/">The Foxymorons</a></li>
</ul>
</div>
<div class="foot__meta">
<button class="theme-switch" type="button" aria-pressed="false"><span class="theme-switch__knob" aria-hidden="true"></span>Dark theme</button>
<p class="small">The band’s logos date from 1999–2002.</p>
<p class="small">Cover art: all rights reserved by the rights holders.</p>
<p class="small">Design sample C, “Roundel”.</p>
</div>
</div>
</footer>
</body>
</html>
"""


def listen(links, cls="listen"):
    items = "".join(f'<li><a class="pill" href="{u}">{dot()}<span>{l}</span></a></li>' for l, u in links)
    return f'<ul class="{cls}">{items}</ul>'


NB = [
    ("Spotify", "https://open.spotify.com/album/0r4RvQu4V4jKhSAlwBm7Fz"),
    ("Apple Music", "https://music.apple.com/us/album/new-beginning-single/1888874973"),
    ("YouTube Music", "https://music.youtube.com/browse/MPREb_km85fvzVpxe"),
    ("Tidal", "https://tidal.com/browse/album/511031499"),
    ("Deezer", "https://www.deezer.com/album/949841901"),
]
GD = [
    ("Spotify", "https://open.spotify.com/album/7jEU9cDDgHh7IWUAXlJ9RF"),
    ("Apple Music", "https://music.apple.com/us/album/great-day-single/1870665916"),
    ("YouTube Music", "https://music.youtube.com/browse/MPREb_S37jYFP6dDr"),
    ("Tidal", "https://tidal.com/browse/album/491176925"),
    ("Deezer", "https://www.deezer.com/album/902290832"),
]
OB = [
    ("Spotify", "https://open.spotify.com/album/1pRDTqjcjnt4zDm9pPUaEC"),
    ("Apple Music", "https://music.apple.com/us/album/overbored/529876344"),
    ("Bandcamp", "https://daviddewese.bandcamp.com/album/overbored"),
    ("Tidal", "https://tidal.com/browse/album/31180536"),
    ("Deezer", "https://www.deezer.com/album/3230601"),
]
BE = [
    ("Spotify", "https://open.spotify.com/album/0b8te1vh6pqC1vcUrzmVD5"),
    ("Apple Music", "https://music.apple.com/us/album/believe-single/483219017"),
    ("Bandcamp", "https://daviddewese.bandcamp.com/album/believe-ep"),
]


def video(video_id, title, poster=None, note=""):
    """Click-to-load facade. Nothing is requested from YouTube until the reader presses
    play; then site.js swaps in a youtube-nocookie.com iframe. Without JavaScript it is a
    plain link to the video. The play button is the band's roundel."""
    img = (f'<img src="{poster}" alt="" width="1280" height="720" loading="lazy">' if poster
           else '<span class="yt__plain" aria-hidden="true"></span>')
    cls = "yt" if poster else "yt yt--plain"
    return f"""<a class="{cls}" href="https://www.youtube.com/watch?v={video_id}" data-yt="{video_id}" data-title="{html.escape(title)}">
{img}
<span class="yt__play">{mark("lx-roundel", "yt__roundel")}<span class="yt__label">Play “{html.escape(title)}”<span class="visually-hidden"> (loads YouTube)</span></span></span>
</a>"""


def section_head(hid, text, ink=False, kicker=None):
    k = f'<p class="kicker">{kicker}</p>' if kicker else ""
    return f'<div class="sec-head">{k}<h2 id="{hid}">{dot(ink)}<span>{text}</span></h2></div>'


# ---------------------------------------------------------------- home

def home():
    main = f"""
<section class="hero sky" aria-labelledby="h1t">
<div class="wrap hero__grid">
<div class="hero__text">
<h1 class="hero__logo">{mark("lx-full", "logo-full", "The Luxury Liners", "h1t")}</h1>
<p class="lede">{html.escape(ONE_LINER)}</p>
<p class="status">{STATUS}</p>
</div>
<div class="hero__latest">
<p class="kicker">Latest release: New Beginning, April 2026</p>
<div class="stack">
<img class="stack__back" src="img/cover-great-day.webp" width="1000" height="1000" alt="Cover of Great Day: a red kite on a long string against a blue sky.">
<img class="stack__front" src="img/cover-new-beginning.webp" width="1000" height="1000" alt="Cover of New Beginning: a hand holds up a clear CD case with a sunburst design and the words New Beginning, against a blue sky.">
</div>
{listen([("Listen to New Beginning", NB[0][1]), ("Apple Music", NB[1][1])], "listen listen--hero")}
</div>
</div>
</section>

<section class="band" aria-labelledby="singles">
<div class="wrap">
{section_head("singles", "Two singles in 2026")}
<p class="intro">Two singles in 2026, both written by Chad and David and played by all four forever members. {LL17}</p>
<div class="singles">
<article class="single" aria-labelledby="nb">
<img src="img/cover-new-beginning.webp" width="1000" height="1000" alt="" loading="lazy">
<div class="single__body">
<h3 id="nb">New Beginning</h3>
<p class="meta">Single · April 17, 2026 · Litterbug Records</p>
<p>Two tracks, “New Beginning” and “Great Day”.</p>
<p class="meta">Cover art: David Dewese</p>
{listen(NB)}
</div>
</article>
<article class="single" aria-labelledby="gd">
<img src="img/cover-great-day.webp" width="1000" height="1000" alt="" loading="lazy">
<div class="single__body">
<h3 id="gd">Great Day</h3>
<p class="meta">Single · February 13, 2026 · Litterbug Records</p>
<p>The first of the two.</p>
<p class="meta">Cover art: David Dewese</p>
{listen(GD)}
</div>
</article>
</div>
<figure class="video">
{video("qjZaiwO7KXI", "Great Day", "img/poster-great-day.webp")}
<figcaption class="meta">“Great Day” on YouTube. Nothing loads from YouTube until you press play.</figcaption>
</figure>
</div>
</section>

<section class="band red" aria-labelledby="eras">
<div class="wrap">
{section_head("eras", "Through the eras", ink=True)}
<p class="intro">Matching pale-blue suits in 1998, the white-studio sessions around 2000, all four forever members in 2002 and the trio in 2003.</p>
<div class="collage">
<figure class="col-jump">
<div class="ring" aria-hidden="true"></div>
<img class="jump" src="img/cut-c2000-cartwheel.webp" width="527" height="535" alt="A person with shoulder-length hair, in grey trousers and a black sweater, does a cartwheel against a white studio backdrop." loading="lazy">
<figcaption>A cartwheel in the white studio, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
<figure class="col-a">
<img src="img/1998-pale-blue-backstage.webp" width="844" height="619" alt="Four young men in matching pale-blue suits stand backstage." loading="lazy">
<figcaption>Backstage in matching pale-blue suits, 1998.</figcaption>
</figure>
<figure class="col-b">
<img src="img/1998-pale-blue-trio.webp" width="963" height="600" alt="Three young men in matching pale-blue suits and black ties grin at the camera." loading="lazy">
<figcaption>Pale-blue suits and black ties, about 1998.</figcaption>
</figure>
<figure class="col-c">
<img src="img/c2000-white-studio-dance.webp" width="1200" height="789" alt="The Luxury Liners dance in coloured T-shirts against a white studio backdrop." loading="lazy">
<figcaption>The white studio, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
<figure class="col-d">
<img src="img/c2000-white-studio-coats.webp" width="1100" height="908" alt="The Luxury Liners sit on the floor of a white photo studio in coats." loading="lazy">
<figcaption>In coats, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
<figure class="col-four">
<img src="img/2002-four.webp" width="1096" height="848" alt="Four men in matching green T-shirts stand arm in arm against a concrete wall." loading="lazy">
<figcaption>{P23}<span class="col-note">Chad left Nashville in March 2001, a year before this photo. All four play on the 2026 singles.</span></figcaption>
</figure>
<figure class="col-e">
<img src="img/2003-recesses.webp" width="1400" height="1050" alt="Three members of The Luxury Liners stand apart, each in a recessed dark panel of a pale stone wall." loading="lazy">
<figcaption>The trio in 2003. Photo: Amy Wilstermann</figcaption>
</figure>
</div>
</div>
</section>

<section class="band" aria-labelledby="members">
<div class="wrap">
{section_head("members", "The four forever members")}
<div class="members">
<div>
<ul class="people">
<li>
<h3>{dot()}<span>David Dewese</span></h3>
<p class="roles">Co-founder. Guitar, bass, lead vocals; writes songs. <span class="years">1997–</span></p>
<p>Co-founded the band with Chad in 1997 and carried it on as a trio from 2001.</p>
</li>
<li>
<h3>{dot()}<span>Chad Edgington</span></h3>
<p class="roles">Co-founder. Guitar, bass, vocals; writes songs. <span class="years">1997–2001; on the 2026 singles</span></p>
<p>Co-founded the band with David in 1997. He left Nashville in March 2001, and he plays on “Great Day” and “New Beginning”, which he wrote with David.</p>
</li>
<li>
<h3>{dot()}<span>Scott Carpenter</span></h3>
<p class="roles">Drums, percussion, vocals. <span class="years">1998–</span></p>
<p>Joined on drums in August 1998 and painted the pictures on the cover of <cite>Nonetheless</cite>.</p>
</li>
<li>
<h3>{dot()}<span>David “Larry” Wilstermann</span></h3>
<p class="roles">Bass, keyboards, vocals. <span class="years">2000–</span></p>
<p>Joined on bass in December 2000. The band already had a David, so he became Larry.</p>
</li>
</ul>
</div>
</div>
</div>
</section>

<section class="band surface" aria-labelledby="more">
<div class="wrap">
<h2 id="more" class="visually-hidden">Go further</h2>
<ul class="doors">
<li><a href="story-believe.html">{dot()}<span>Read the story</span></a></li>
<li><a href="overbored.html">{dot()}<span>Hear the records</span></a></li>
<li><a href="/vault/">{dot()}<span>Open the Vault</span></a></li>
</ul>
<p class="meta disamb">Not to be confused with Emmylou Harris’s album <cite>Luxury Liner</cite>; Luxury Liners, the recording name of singer-songwriter Carter Tanton (<cite>They’re Flowers</cite>, 2013); the Finnish band Luxury Liner; or the bands Luxury (Georgia, 1990s) and Luxury (Iowa, 1977–82).</p>
</div>
</section>
"""
    return page("The Luxury Liners", ONE_LINER, None, main, ["lx-full"])


# ---------------------------------------------------------------- Overbored

TRACKS = [
    ("Sunshine", "3:05", "The theme of FOX Sports’ <cite>US Youth Soccer Show</cite>."),
    ("Restless", "3:41", None),
    ("Dreaming", "4:39", "Used in <cite>One Tree Hill</cite>, season 1, episode 15, “Suddenly Everything Has Changed”, first shown on The WB on February 24, 2004."),
    ("Overbored", "4:12", None),
    ("Waiting For The Sun", "3:24", None),
    ("Woman", "3:48", None),
    ("Equasue", "3:35", None),
    ("Fifteen Again", "3:40", None),
    ("It’s You", "3:24", None),
    ("Constellation Invitation", "2:55", None),
]


def overbored():
    rows = []
    for i, (title, dur, note) in enumerate(TRACKS, 1):
        n = f'<p class="track__note">{note}</p>' if note else ""
        rows.append(f'<li class="track"><span class="track__no" aria-hidden="true">{i}</span>'
                    f'<span class="track__title">{html.escape(title)}</span><span class="track__dur">{dur}</span>{n}</li>')
    tracks = "\n".join(rows)
    main = f"""
<section class="release" aria-labelledby="h1t">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/music/">Music</a></li><li><span aria-current="page">Overbored</span></li></ol></nav>
<div class="release__grid">
<figure class="release__cover">
<img src="img/cover-overbored.webp" width="1000" height="1000" alt="Cover of Overbored: a painting of three upside-down figures in coats on off-white, with the band name and title in small capitals.">
<figcaption class="meta">Cover art: David Dewese</figcaption>
</figure>
<div class="release__text">
<p class="kicker">Album · 2003 · The trio’s first album</p>
<h1 id="h1t" class="title-xl">Overbored</h1>
<ul class="facts">
<li>May 2003</li><li>Litterbug Records</li><li>LLCD1003</li><li>10 tracks</li><li>36:23</li>
</ul>
<p class="lede"><cite>Overbored</cite>, the trio’s first album, came out in May 2003 on Litterbug Records. Doug Nightwine recorded it, Chris Henning mixed it, and Paul Seykora added keyboards. David wrote most of the songs, Larry wrote “Restless”, and David made the cover.</p>
{listen(OB)}
</div>
</div>
</div>
</section>

<section class="band surface" aria-labelledby="tl">
<div class="wrap two-col">
<div>
{section_head("tl", "Tracks")}
<ol class="tracks">
{tracks}
</ol>
</div>
<div>
{section_head("cr", "Credits")}
<dl class="credits">
<div><dt>David Dewese</dt><dd>guitar, vocals</dd></div>
<div><dt>David “Larry” Wilstermann</dt><dd>bass</dd></div>
<div><dt>Scott Carpenter</dt><dd>drums</dd></div>
<div><dt>Paul Seykora</dt><dd>keyboards on “Dreaming” and “Woman”</dd></div>
<div><dt>Recorded by</dt><dd>Doug Nightwine</dd></div>
<div><dt>Mixed by</dt><dd>Chris Henning</dd></div>
<div><dt>Cover art</dt><dd>David Dewese</dd></div>
</dl>
<figure class="photo-card">
<img src="img/2003-pillars.webp" width="1400" height="1050" alt="The Luxury Liners lean between stone pillars, one member in a shearling coat in front." loading="lazy">
<figcaption class="meta">The trio in 2003. Photo: Amy Wilstermann</figcaption>
</figure>
</div>
</div>
</section>

<section class="band red" aria-labelledby="said">
<div class="wrap">
{section_head("said", "What they said", ink=True)}
<ul class="quotes">
<li>
<blockquote><p>“‘Waiting for the Sun’ … is drop-dead perfect pop-rock (and the best song here) … This is one of my favorites of the year.”</p></blockquote>
<p class="cite">Erik Hage, <cite>Metroland</cite>, June 2003</p>
</li>
<li>
<blockquote><p>“The bittersweet trio of Woman, Equasue and Fifteen Again really push the album into the pantheon of tremendous local songwriting.”</p></blockquote>
<p class="cite">Todd Anderson, <cite>Nashville Rage</cite>, October 2003</p>
</li>
<li>
<blockquote><p>“<cite>Overbored</cite> … is a must-have for all power pop fans.”</p></blockquote>
<p class="cite"><cite>Performing Songwriter</cite>, July 2004</p>
</li>
</ul>
<p class="onesheet">The band’s one-sheet pitched it as “the perfect CD for traveling up the 5 from San Diego to L.A.”</p>
</div>
</section>

<section class="band" aria-labelledby="vid">
<div class="wrap two-col two-col--media">
<div>
{section_head("vid", "“Equasue” on YouTube")}
<p>Two of its songs went to television. “Dreaming” was used in <cite>One Tree Hill</cite>, and “Sunshine” became the theme of FOX Sports’ <cite>US Youth Soccer Show</cite>.</p>
<p>Chapter 6 of the Story tells how the album was made: <a href="/story/#chapter-6">read the chapter</a>.</p>
</div>
<figure class="video">
{video("M0FOgNUWHlw", "Equasue")}
<figcaption class="meta">“Equasue”, from the band’s YouTube channel. Nothing loads from YouTube until you press play.</figcaption>
</figure>
</div>
</section>

<section class="band surface" aria-labelledby="trio">
<div class="wrap">
{section_head("trio", "The trio in 2003")}
<figure class="wide-photo">
<img src="img/2003-recesses.webp" width="1400" height="1050" alt="Three members of The Luxury Liners stand apart, each in a recessed dark panel of a pale stone wall." loading="lazy">
<figcaption class="meta">The trio in 2003, photographed for <cite>Overbored</cite>. Photo: Amy Wilstermann</figcaption>
</figure>
<nav class="pager" aria-label="Releases">
<a href="/music/believe/"><span class="meta">Previous</span><span>Believe EP (2001)</span></a>
<a href="/music/nonetheless/"><span class="meta">Next</span><span>Nonetheless (2006)</span></a>
</nav>
</div>
</section>
"""
    return page("Overbored · The Luxury Liners",
                "Overbored, the trio’s first album, May 2003 on Litterbug Records.",
                "music", main, [])


# ---------------------------------------------------------------- Story ch. 4

CHAPTERS = [
    ("1", "Two Texans and a Gram Parsons song", "1997"),
    ("2", "Nudie suits and Nashville clubs", "1997–1999"),
    ("3", "Sound As Ever", "2000"),
    ("4", "Believe, SXSW and Chad’s last show", "2001"),
    ("5", "The journal years", "2001–2004"),
    ("6", "Overbored", "2003"),
    ("7", "Nonetheless", "2004–2007"),
    ("8", "The quiet years", "2008–2020"),
    ("9", "Great Day", "2021–2026"),
]


def story():
    chap = []
    for n, t, y in CHAPTERS:
        cur = n == "4"
        href = "story-believe.html" if cur else f"/story/#chapter-{n}"
        ac = ' aria-current="page"' if cur else ""
        chap.append(f'<li><a href="{href}"{ac}><span class="chap__no" aria-hidden="true">{n}</span>'
                    f'<span class="chap__title"><span class="visually-hidden">Chapter {n}: </span>{html.escape(t)}</span>'
                    f'<span class="chap__years">{y}</span></a></li>')
    chapters = "\n".join(chap)
    main = f"""
<article aria-labelledby="h1t">
<header class="chapter red">
<div class="wrap chapter__grid">
<div>
<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/story/">Story</a></li><li><span aria-current="page">Chapter 4</span></li></ol></nav>
<p class="kicker">Chapter 4 · 2001</p>
<h1 id="h1t" class="title-xl">Believe, SXSW and Chad’s last show</h1>
<p class="lede">An EP, a showcase in Austin, and the band carries on as a trio.</p>
</div>
<figure class="chapter__cover">
<img src="img/cover-believe.webp" width="1000" height="1000" alt="Cover of the Believe EP by The Luxury Liners: a black silhouette of a leaping guitarist over a white ring on red, with the band name in spaced capitals.">
<figcaption>Cover art: Mark Montgomery</figcaption>
</figure>
</div>
</header>
<div class="band">
<div class="wrap story">
<div class="prose">
<p class="dropcap">The <cite>Believe</cite> EP came out in March 2001 on Echomusic: “It’s You”, “Shake It Up” and a cover of Cher’s “Believe”. Mark Montgomery produced it with the band, Shane D. Wilson mixed it and Chris Milfred mastered it. It was an enhanced CD, with a video for “It’s You” on the disc. “Shake It Up” is a Luxury Liners original, and this was its first release.</p>
<p>At SXSW 2001 the band played the SESAC Showcase, and “Shake It Up” went out on the CD that SESAC handed out there.</p>
<figure class="inline-photo">
<img src="img/2001-chads-last-show.webp" width="1400" height="933" alt="Four members of The Luxury Liners stand arm in arm in front of a painted mural of a tree and birds." loading="lazy">
<figcaption class="meta">Chad’s last show with the band, March 2001.</figcaption>
</figure>
<p>Chad played his last show with the band in March 2001 (the band wore matching gray slacks from Castner-Knott) and left Nashville that month. David carried the band on as a trio with Scott and Larry. By August the band’s journal was talking about “the new three piece configuration”.</p>
</div>
<aside class="story__aside" aria-labelledby="ep">
<div class="ep-card">
<h2 id="ep">{dot()}<span>The <cite>Believe</cite> EP</span></h2>
<p class="meta">EP · March 2001 · Echomusic</p>
<ol class="mini-tracks">
<li>It’s You <span class="track__dur">3:28</span></li>
<li>Shake It Up <span class="track__dur">2:37</span></li>
<li>Believe <span class="meta">(Cher)</span> <span class="track__dur">2:50</span></li>
</ol>
{listen(BE)}
</div>
<figure class="aside-jump">
<div class="ring ring--small" aria-hidden="true"></div>
<img class="jump" src="img/cut-c2000-cartwheel.webp" width="527" height="535" alt="A person with shoulder-length hair, in grey trousers and a black sweater, does a cartwheel against a white studio backdrop." loading="lazy">
<figcaption class="meta">A cartwheel in the white studio, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
</aside>
</div>
</div>
<nav class="band surface" aria-labelledby="chs">
<div class="wrap">
{section_head("chs", "The Story, chapter by chapter")}
<ol class="chapters">
{chapters}
</ol>
<div class="pager">
<a href="/story/#chapter-3"><span class="meta">Previous</span><span>3. Sound As Ever</span></a>
<a href="/story/#chapter-5"><span class="meta">Next</span><span>5. The journal years</span></a>
</div>
</div>
</nav>
</article>
"""
    return page("Believe, SXSW and Chad’s last show · Story · The Luxury Liners",
                "Chapter 4 of the band’s story, 2001: the Believe EP, the SESAC Showcase at SXSW and Chad’s last show.",
                "story", main, [])


def main():
    write_sprite()
    for name, fn in (("index.html", home), ("overbored.html", overbored), ("story-believe.html", story)):
        with open(os.path.join(SAMPLE, name), "w") as fh:
            fh.write(fn())
        print(name, os.path.getsize(os.path.join(SAMPLE, name)) // 1024, "KB")


if __name__ == "__main__":
    main()
