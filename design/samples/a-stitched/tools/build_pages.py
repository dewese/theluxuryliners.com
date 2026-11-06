#!/usr/bin/env python3
"""Assemble the three sample pages from shared partials (header, footer, logos,
the rose spray) so the markup stays identical across pages.

Copy comes from content/ (home.md, story/02-nudie-suits.md, story/06-overbored.md,
people.json, press.json) and data/releases.json; it is written out here by hand,
not parsed, so nothing internal (sources, notes) can leak into the page.

Run:  python3 tools/build_pages.py
"""
import html
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.dirname(HERE)
INK = 'fill="rgb(13.729858%, 12.159729%, 12.548828%)"'
INK_AI = 'fill="rgb(13.725281%, 12.156677%, 12.548828%)"'


def logo(name, cls, label=None, label_id=None):
    """Draw one of logos/web/*.svg by reference. Path data stays verbatim in that file;
    only the near-black ink is currentColor there (the theme ink). Red, slate and white
    are kept."""
    src = open(os.path.join(SAMPLE, "logos", "web", name)).read()
    vb = re.search(r'viewBox="([^"]+)"', src).group(1)
    use = f'<use href="logos/web/{name}#mark"/>'
    if label:
        return f'<svg class="{cls}" viewBox="{vb}" role="img" aria-labelledby="{label_id}"><title id="{label_id}">{html.escape(label)}</title>{use}</svg>'
    return f'<svg class="{cls}" viewBox="{vb}" aria-hidden="true" focusable="false">{use}</svg>'


ROSE = open(os.path.join(HERE, "partials", "rose-spray.svg")).read()
PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4.5v15l13-7.5z"/></svg>'
STITCH = '<div class="stitch" role="presentation"></div>'

NAV = [
    ("Story", "story-nudie-suits.html", "story"),
    ("Music", "overbored.html", "music"),
    ("People", "/people/", None),
    ("Shows", "/shows/", None),
    ("Vault", "/vault/", None),
    ("Facts", "/facts/", None),
]


def page(title, desc, era, current, main, covers_shown):
    nav = "\n".join(
        f'<li><a href="{href}"{" aria-current=\"page\"" if key and key == current else ""}>{label}</a></li>'
        for label, href, key in NAV
    )
    rights = (
        '<p class="small">Cover art: all rights reserved by the rights holders.</p>' if covers_shown else ""
    )
    return f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="preload" href="fonts/archivo-display.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/inter-roman.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/stitched.css">
<link rel="icon" href="logos/roundel-red-spaced.svg" type="image/svg+xml">
<script src="js/theme.js"></script>
<script src="js/site.js" defer></script>
</head>
<body class="band {era}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
<div class="wrap">
<a class="brand" href="index.html" aria-label="The Luxury Liners, home">{logo("condensed-wordmark.svg", "wordmark")}</a>
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
<footer class="site-footer era-oxblood">
<div class="wrap">
{logo("roundel-black.svg", "roundel")}
<div>
<ul aria-label="The band elsewhere">
<li><a href="https://www.instagram.com/theluxuryliners/">Instagram</a></li>
<li><a href="https://www.facebook.com/theluxuryliners">Facebook</a></li>
<li><a href="https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc">Spotify</a></li>
<li><a href="https://music.apple.com/us/artist/the-luxury-liners/47333263">Apple Music</a></li>
<li><a href="https://daviddewese.bandcamp.com/">Bandcamp</a></li>
<li><a href="/contact/">Contact</a></li>
</ul>
<p class="small">The band’s logos date from 1999–2002.</p>
{rights}
<p class="small">Design sample A, “Stitched”.</p>
</div>
<button class="theme-switch" type="button" aria-pressed="false"><span class="theme-switch__track" aria-hidden="true"></span>Light theme</button>
</div>
</footer>
</body>
</html>
"""


def listen(links, primary=None):
    items = []
    for label, url in links:
        cls = ' class="primary"' if label == primary else ""
        items.append(f'<li{cls}><a href="{url}">{label}</a></li>')
    return '<ul class="listen">' + "".join(items) + "</ul>"


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

ONE_LINER = ("The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad "
             "Edgington, who took it to Nashville together. The name comes from the Gram Parsons song "
             "'Luxury Liner'.")


def yt(video_id, title, poster, poster_alt_is_decorative=True):
    return f"""<a class="yt" href="https://www.youtube.com/watch?v={video_id}" data-yt="{video_id}" data-title="{html.escape(title)}">
<img src="{poster}" alt="" width="960" height="540" loading="lazy">
<span class="yt__play">{PLAY}Play “{html.escape(title)}”<span class="visually-hidden"> (loads YouTube)</span></span>
</a>"""


def home():
    main = f"""
<section class="hero era-oxblood" aria-labelledby="h1t">
<div class="wrap hero__grid">
<div>
<h1 class="hero__logo">{logo("stacked-lxl.svg", "logo-stacked", "The Luxury Liners", "h1t")}</h1>
<p class="lede">{html.escape(ONE_LINER)}</p>
<p class="hero__status">Founded in 1997. Two new singles in 2026. The band never broke up.</p>
{listen([("Listen to New Beginning", NB[0][1]), ("Read the story", "story-nudie-suits.html")], primary="Listen to New Beginning")}
</div>
<div class="hero__covers">
{ROSE}
<p class="kicker">Latest release: New Beginning, April 2026</p>
<figure class="lead-cover">
<img src="img/cover-new-beginning.webp" width="900" height="900" alt="Cover of New Beginning: a hand holds up a clear CD case with a sunburst design and the words New Beginning, against a blue sky.">
</figure>
<figure class="second-cover">
<img src="img/cover-great-day.webp" width="900" height="900" alt="Cover of Great Day: a red kite on a long string against a blue sky.">
</figure>
</div>
</div>
</section>

<section class="era-sky band" aria-labelledby="singles">
<div class="wrap">
<h2 id="singles">Two singles in 2026</h2>
<p class="prose">Two singles in 2026, both written by Chad and David and played by all four forever members.</p>
<div class="singles__grid">
<article class="release-card" aria-labelledby="nb">
<img src="img/cover-new-beginning.webp" width="900" height="900" alt="" loading="lazy">
<div>
<h3 id="nb">New Beginning</h3>
<p class="small">Single · April 17, 2026 · Litterbug Records</p>
<p>Two tracks, “New Beginning” and “Great Day”.</p>
<p class="small">Cover art: David Dewese</p>
{listen(NB)}
</div>
</article>
<article class="release-card" aria-labelledby="gd">
<img src="img/cover-great-day.webp" width="900" height="900" alt="" loading="lazy">
<div>
<h3 id="gd">Great Day</h3>
<p class="small">Single · February 13, 2026 · Litterbug Records</p>
<p>The first of the two.</p>
<p class="small">Cover art: David Dewese</p>
{listen(GD)}
</div>
</article>
</div>
<figure class="video">
{yt("qjZaiwO7KXI", "Great Day", "img/cover-great-day.webp")}
<figcaption class="small">“Great Day” on YouTube. Nothing loads from YouTube until you press play.</figcaption>
</figure>
</div>
</section>

<section class="era-oxblood band band--surface" aria-labelledby="eras">
<div class="wrap">
<h2 id="eras">Through the eras</h2>
<p class="prose">Pale-blue suits in 1998, the white-studio sessions around 2000, and the trio in 2003.</p>
<div class="collage">
<figure class="c-a">
<img src="img/1998-pale-blue-backstage.webp" width="844" height="619" alt="Four young men in matching pale-blue suits stand backstage." loading="lazy">
<figcaption>Backstage in matching pale-blue suits, 1998.</figcaption>
</figure>
<figure class="c-b">
<img src="img/1998-hard-rock.webp" width="600" height="919" alt="The band in white suits plays the Hard Rock Cafe stage under a Bud Light banner." loading="lazy">
<figcaption>On stage at the Hard Rock Cafe, Nashville, 1998.</figcaption>
</figure>
<figure class="c-c">
<img src="img/c2000-white-studio-dance.webp" width="1200" height="789" alt="The Luxury Liners dance in coloured T-shirts against a white studio backdrop." loading="lazy">
<figcaption>The white studio, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
<figure class="c-e">
<img src="img/2003-recesses.webp" width="1200" height="900" alt="Three members of The Luxury Liners stand apart, each in a recessed dark panel of a pale stone wall." loading="lazy">
<figcaption>The trio in 2003. Photo: Amy Wilstermann</figcaption>
</figure>
<figure class="c-d">
<img src="img/c2000-white-studio-coats.webp" width="1100" height="908" alt="The Luxury Liners sit on the floor of a white photo studio in coats." loading="lazy">
<figcaption>In coats, about 2000. Photo: Mark Montgomery</figcaption>
</figure>
</div>
</div>
</section>

<section class="era-oxblood band" aria-labelledby="members">
<div class="wrap">
<h2 id="members">The four forever members</h2>
{STITCH}
<figure class="plate plate--2002">
<div class="plate__img" role="img" aria-label="Engraving made from a photo: four men in matching T-shirts stand arm in arm against a concrete wall."></div>
<figcaption>David Wilstermann, Chad Edgington, David Dewese and Scott Carpenter in 2002</figcaption>
</figure>
<p class="context small">Chad left Nashville in March 2001, a year before this photo. All four play on the 2026 singles.</p>
<ul class="members__grid">
<li class="member">
<h3>David Dewese</h3>
<p class="roles">Co-founder. Guitar, bass, lead vocals; writes songs.</p>
<p class="years">1997–</p>
<p>Co-founded the band with Chad in 1997 and carried it on as a trio from 2001.</p>
</li>
<li class="member">
<h3>Chad Edgington</h3>
<p class="roles">Co-founder. Guitar, bass, vocals; writes songs.</p>
<p class="years">1997–2001; on the 2026 singles</p>
<p>Co-founded the band with David in 1997. He left Nashville in March 2001, and he plays on “Great Day” and “New Beginning”, which he wrote with David.</p>
</li>
<li class="member">
<h3>Scott Carpenter</h3>
<p class="roles">Drums, percussion, vocals.</p>
<p class="years">1998–</p>
<p>Joined on drums in August 1998 and painted the pictures on the cover of <cite>Nonetheless</cite>.</p>
</li>
<li class="member">
<h3>David “Larry” Wilstermann</h3>
<p class="roles">Bass, keyboards, vocals.</p>
<p class="years">2000–</p>
<p>Joined on bass in December 2000. The band already had a David, so he became Larry.</p>
</li>
</ul>
</div>
</section>

<section class="era-oxblood band band--surface" aria-labelledby="more">
<div class="wrap">
<h2 id="more">Go further</h2>
<ul class="doors">
<li><a href="story-nudie-suits.html">Read the story</a></li>
<li><a href="overbored.html">Hear the records</a></li>
<li><a href="/vault/">Open the Vault</a></li>
</ul>
{STITCH}
<p class="small prose">Not to be confused with Emmylou Harris’s album <cite>Luxury Liner</cite>; Luxury Liners, the recording name of singer-songwriter Carter Tanton (<cite>They’re Flowers</cite>, 2013); the Finnish band Luxury Liner; or the bands Luxury (Georgia, 1990s) and Luxury (Iowa, 1977–82).</p>
</div>
</section>
"""
    return page(
        "The Luxury Liners",
        ONE_LINER,
        "era-oxblood",
        None,
        main,
        True,
    )


TRACKS = [
    ("Sunshine", "3:05", "The theme of FOX Sports’ <cite>US Youth Soccer Show</cite>."),
    ("Restless", "3:41", None),
    ("Dreaming", "4:39", "Used in <cite>One Tree Hill</cite>, season 1, episode 15, first shown February 24, 2004."),
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
    for title, dur, note in TRACKS:
        n = f'<span class="note">{note}</span>' if note else ""
        rows.append(f'<li><span class="title">{html.escape(title)}</span><span class="dur">{dur}</span>{n}</li>')
    tracks = "\n".join(rows)
    main = f"""
<section class="era-oxblood band" aria-labelledby="h1t">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/music/">Music</a></li><li><span aria-current="page">Overbored</span></li></ol></nav>
<div class="release-hero__grid">
<figure class="release-hero__cover">
<img src="img/cover-overbored.webp" width="900" height="900" alt="Cover of Overbored: a painting of three upside-down figures in coats on off-white, with the band name and title in small capitals.">
<figcaption class="small">Cover art: David Dewese</figcaption>
</figure>
<div>
<p class="kicker">Album · 2003</p>
<h1 id="h1t">Overbored</h1>
<ul class="facts-row">
<li>May 2003</li><li>Litterbug Records</li><li>LLCD1003</li><li>10 tracks · 36:23</li>
</ul>
<p class="lede">The trio’s first album, played by David Dewese, David “Larry” Wilstermann and Scott Carpenter after Chad left Nashville. Two of its songs went to television.</p>
{listen(OB, primary="Spotify")}
</div>
</div>
</div>
</section>

<section class="era-oxblood band band--surface" aria-labelledby="tl">
<div class="wrap two-col">
<div>
<h2 id="tl">Tracks</h2>
<ol class="tracks">
{tracks}
</ol>
<p class="small total">Total time 36:23.</p>
</div>
<div>
<h2 id="cr">Credits</h2>
<dl class="credits" aria-labelledby="cr">
<dt>David Dewese</dt><dd>guitar, vocals</dd>
<dt>David “Larry” Wilstermann</dt><dd>bass</dd>
<dt>Scott Carpenter</dt><dd>drums</dd>
<dt>Paul Seykora</dt><dd>keyboards on “Dreaming” and “Woman”</dd>
<dt>Recorded by</dt><dd>Doug Nightwine</dd>
<dt>Mixed by</dt><dd>Chris Henning</dd>
<dt>Cover art</dt><dd>David Dewese</dd>
</dl>
<p class="small">David wrote most of the songs, some of them with Chad, Larry and Scott; Larry wrote “Restless”.</p>
</div>
</div>
</section>

<section class="era-oxblood band" aria-labelledby="said">
<div class="wrap two-col">
<div>
<h2 id="said">What they said</h2>
{STITCH}
<ul class="press">
<li>
<blockquote><p>“‘Waiting for the Sun’ … is drop-dead perfect pop-rock (and the best song here) … This is one of my favorites of the year.”</p></blockquote>
<p class="cite">Erik Hage, <cite>Metroland</cite>, June 2003</p>
</li>
<li>
<blockquote><p>“<cite>Overbored</cite> … is a must-have for all power pop fans.”</p></blockquote>
<p class="cite"><cite>Performing Songwriter</cite>, July 2004</p>
</li>
</ul>
<p class="small">The band’s own one-sheet pitched it as “the perfect CD for traveling up the 5 from San Diego to L.A.”</p>
</div>
<div>
<h2 id="vid">Equasue on YouTube</h2>
<figure class="video">
{yt("M0FOgNUWHlw", "Equasue", "img/video-equasue.webp")}
<figcaption class="small">“Equasue”, from the band’s YouTube channel. Nothing loads from YouTube until you press play.</figcaption>
</figure>
</div>
</div>
</section>

<section class="era-oxblood band band--surface" aria-labelledby="trio">
<div class="wrap">
<h2 id="trio">The trio in 2003</h2>
<figure class="plate plate--2003">
<div class="plate__img" role="img" aria-label="Engraving made from a photo: three band members lean between stone pillars, one in a shearling coat in front."></div>
<figcaption>The trio in 2003, photographed for <cite>Overbored</cite>. Engraved from a photo by Amy Wilstermann.</figcaption>
</figure>
</div>
</section>

<section class="era-oxblood band" aria-labelledby="next">
<div class="wrap">
<h2 id="next" class="visually-hidden">More</h2>
<p>Chapter 6 of the Story tells how <cite>Overbored</cite> was made: <a href="/story/#chapter-6">read the chapter</a>.</p>
<div class="release-nav">
<a class="btn" href="/music/believe/">← Believe EP (2001)</a>
<a class="btn" href="/music/nonetheless/">Nonetheless (2006) →</a>
</div>
</div>
</section>
"""
    return page(
        "Overbored · The Luxury Liners",
        "Overbored, the trio’s first album, May 2003 on Litterbug Records.",
        "era-oxblood",
        "music",
        main,
        True,
    )


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
        if n == "2":
            chap.append(f'<li><a href="story-nudie-suits.html" aria-current="page"><span class="n">{n}</span><span>{html.escape(t)}</span></a> <span class="small">{y}</span></li>')
        else:
            chap.append(f'<li><a href="/story/#chapter-{n}"><span class="n">{n}</span><span>{html.escape(t)}</span></a> <span class="small">{y}</span></li>')
    chapters = "\n".join(chap)
    main = f"""
<article class="era-powder band" aria-labelledby="h1t">
<section class="chapter-intro">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/story/">Story</a></li><li><span aria-current="page">Chapter 2</span></li></ol></nav>
<div class="chapter-head">
<div>
<p class="chapter-no" aria-hidden="true">2</p>
<p class="kicker">Chapter 2 · 1997–1999</p>
<h1 id="h1t">Nudie suits and Nashville clubs</h1>
<p class="lede">Emmylou Harris at Zanies, suits by Manuel, <cite>Billboard</cite>, and a drummer for keeps.</p>
</div>
{ROSE}
</div>
{STITCH}
</div>
</section>
<section>
<div class="wrap story-body">
<div class="prose">
<p>The band leaned into its namesake. When The Luxury Liners played Billy Block’s Western Beat Roots Revival at Zanies in Nashville, probably in the autumn of 1997 or the winter of 1998, they met Emmylou Harris and Phil Kaufman, Gram Parsons’s old road manager.</p>
<p>They wore Nudie suits on stage. For the band’s first full-band concert, at 12th &amp; Porter in July or August 1998, opening for Austin Hanks, the Western-wear designer Manuel suited them up.</p>
<p>The rhythm section took a while to settle. Jeff LaFrate played drums and Mark W. Winchester played bass in 1997 and 1998, and Kyle Edgington drummed in the summer of 1998. Then, in August 1998, Scott Carpenter joined on drums, and stayed.</p>
<p>In 1998 the band was featured in <cite>Billboard</cite>. It also turned up on two compilations that year: “Since You Met Me” and “Think She’s Coming Around” on <cite>Fireworks Vol. 2</cite> from Sweden’s Sound Asleep Records, and “If I Cry” on <cite>Nashpop</cite> from Not Lame Recordings.</p>
<p>That autumn the band played the Texas Music Café in Waco, Texas, with Chad on guitar, David on bass and Scott on drums. Their “Shake It Up” from that night came out as a single in 2021. In Waco that autumn they also recorded a live set at E-Cleff Studios, which later went up on the band’s website as <cite>Trunk Box</cite>.</p>
</div>
<aside aria-label="Pictures from these years">
<figure>
<img src="img/1998-pale-blue-trio.webp" width="963" height="600" alt="Three young men in matching pale-blue suits and black ties grin at the camera." loading="lazy">
<figcaption>Matching pale-blue suits, about 1998.</figcaption>
</figure>
<figure>
<img src="img/cover-shake-it-up.webp" width="600" height="600" alt="Artwork for the single Shake It Up (Live at the Texas Music Café): three band members in embroidered Western suits leap in the air against white, under the band name with a red X." loading="lazy">
<figcaption>“Shake It Up (Live at the Texas Music Café)”, recorded in autumn 1998 and released in 2021. Cover art: David Dewese, from a photo by Mark Montgomery.</figcaption>
</figure>
</aside>
</div>
</section>
<section class="band--surface" aria-labelledby="chs">
<div class="wrap">
<h2 id="chs">The Story, chapter by chapter</h2>
<ol class="chapters">
{chapters}
</ol>
{STITCH}
<div class="release-nav">
<a class="btn" href="/story/#chapter-1">← 1. Two Texans and a Gram Parsons song</a>
<a class="btn" href="/story/#chapter-3">3. Sound As Ever →</a>
</div>
</div>
</section>
</article>
"""
    return page(
        "Nudie suits and Nashville clubs · Story · The Luxury Liners",
        "Chapter 2 of the band’s story, 1997–1999: Zanies, Manuel’s suits, Billboard and Scott Carpenter.",
        "era-powder",
        "story",
        main,
        True,
    )


def main():
    for name, fn in (("index.html", home), ("overbored.html", overbored), ("story-nudie-suits.html", story)):
        with open(os.path.join(SAMPLE, name), "w") as fh:
            fh.write(fn())
        print(name)


if __name__ == "__main__":
    main()
