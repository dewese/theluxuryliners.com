"""Build /home/user/theluxuryliners.com/data/legacy-urls.json from the Wayback CDX
(urlkey-collapsed), the daviddewese.com LL audit, and a live status check (2026-10-07)."""
import json, re, collections, sys

CDX = '/home/user/daviddewese.com/daviddewese-com/research/legacy/cdx-theluxuryliners.com.json'
LLA = '/home/user/daviddewese.com/daviddewese-com/architecture/redirects/ll-legacy-urls.json'
LIVE = sys.argv[1]
OUT = '/home/user/theluxuryliners.com/data/legacy-urls.json'

rows = json.load(open(CDX))[1:]
dd = {x['path']: x['target'] for x in json.load(open(LLA))}
live = {}
for line in open(LIVE):
    p, c = line.rstrip('\n').split('\t')
    live[p] = int(c)

# Later captures that the daviddewese.com team actually opened (research/04, site-inventory, vault.json).
KNOWN_LATER = {
    '/': ['20000407063254', '20010308175130', '20020122083859', '20030523111724', '20050305090711',
          '20070205211156', '20090105172729', '20120521212708', '20200814053240', '20240415061227',
          '20241103070211'],
    '/bio.htm': ['20000926003543'],
    '/albums.html': ['20011212092215'],
    '/press.html': ['20051225072849'],
    '/lyrics.html': ['20050425000737'],
    '/bios.html': ['20050425000647'],
    '/data.html': ['20050308093846'],
    '/history/story.html': ['20050321225706'],
    '/history/music.html': ['20050321225645'],
    '/history/intro.html': ['20050826054452'],
    '/store/cat/LuxuryLiners': ['20080930224438'],
}

JOURNAL_OK = set()


def ts_iso(ts):
    return f"{ts[0:4]}-{ts[4:6]}-{ts[6:8]}"


def norm(o):
    return re.sub(r'^https?://(www\.)?theluxuryliners\.com(:80)?', '', o, flags=re.I) or '/'


PHOTO_SETS = {
    'sxsw': 'SXSW (thumbnail archived 2001-06-24, so SXSW 2001 or earlier)', 'capitol': 'Capitol (thumbnail archived 2001-08-25, so older than the July 2002 DC trip; subject unknown)',
    'detroit_3-03': 'Detroit, March 2003', 'rocketown_4-03': 'Rocketown, Nashville, April 2003',
    'recording_7-03': 'Recording, July 2003', 'columbia_10-03': 'Columbia SC, October 2003',
    'trio': 'Trio', 'studio': 'Studio', 'live': 'Live', 'live2': 'Live 2', 'dancin': "Dancin'",
    'dancin_02': "Dancin' 2002 (Dancin' in the District?)", 'atlanta_02': 'Atlanta 2002',
    'july_02': 'July 2002', 'random_02': 'Random 2002', 'misc': 'Misc', 'misc_5-03': 'Misc, May 2003',
    'various_live_03': 'Various live 2003',
}


GALLERY_PERIOD = {
    'sxsw': '2001 or earlier (thumbnail archived 2001-06-24)',
    'capitol': '2001 or earlier (thumbnail archived 2001-08-25)',
    'detroit_3-03': '2003-03', 'rocketown_4-03': '2003-04', 'recording_7-03': '2003-07',
    'columbia_10-03': '2003-10', 'misc_5-03': '2003-05', 'various_live_03': '2003',
    'dancin_02': '2002', 'atlanta_02': '2002', 'july_02': '2002-07', 'random_02': '2002',
    'trio': '2001 or earlier (first archived 2001-06-24)', 'studio': '2001 or earlier (first archived 2001-06-22)',
    'live': '2001 or earlier (first archived 2001-08-26)', 'misc': '2001 or earlier (first archived 2001-08-26)',
    'live2': '2002 or earlier (first archived 2002-04-04)', 'dancin': '2002 or earlier (first archived 2002-06-16)',
}


def gallery_period(s):
    return GALLERY_PERIOD.get(s, 'undated (see first_capture)')


def classify(p, status, mime):
    """Return (era, category, action, target, note). Targets are PROVISIONAL paths on the new
    theluxuryliners.com; the architecture track must confirm the IA."""
    base = p.split('?')[0]
    q = '?' in p
    is_html = mime.startswith('text/html') or base.endswith(('.htm', '.html')) or base.endswith('/')

    # --- junk / probes / internals
    if base.startswith('/.well-known/') or base in ('/ads.txt', '/app-ads.txt'):
        return ('2024 hand-coded', 'bot-probe', 'none', None, 'Crawler probe, 404 when captured. No rule.')
    if re.match(r'^/(AcroPDF|Adobe|MediaPlayer|PDF\.|QuickTime|SWCtl|ShockwaveFlash|application/|audio/|image/svg|video/|org\.w3c)', base):
        return ('2007-09 echomusic CMS', 'plugin-probe', 'none', None,
                'Not a real page: a browser-plugin detection string the 2007 Flash/JS code requested as a relative URL. No rule.')
    if base == '/theluxuryliners.com':
        return ('2007-09 echomusic CMS', 'broken-link', 'none', None, 'A relative link missing "http://"; 404 when captured. No rule.')
    if base.startswith('/cdn-cgi/'):
        return ('2024- Carrd', 'host-internal', 'none', None, 'Cloudflare internal path. Never redirect /cdn-cgi/.')
    if base.startswith('/_vti_bin/'):
        return ('2000 FrontPage', 'form-handler', '301', '/contact/', 'FrontPage mailing-list form handler (2000).')
    if base in ('/robots.txt', '/sitemap.xml', '/favicon.ico'):
        return ('site-wide', 'site-file', 'serve', base, 'Served by the new site itself.')
    if base.startswith('/assets/images/'):
        return ('2024- Carrd', 'carrd-asset', 'none', None,
                'Current Carrd image. Dies when Carrd is replaced; the new site has its own images. Ask for the originals first (photographer unknown).')
    if base in ('/style.css',) or base.startswith('/images/icon-'):
        return ('2024 hand-coded', 'asset', 'none', None, 'Asset of the April 2024 hand-coded page.')

    # --- home and splash pages
    if base in ('/', '/index.html', '/index.php') and not q:
        return ('all', 'home', 'keep', '/', 'Home page.')
    if base in ('/', '/index.php') and q:
        m = re.search(r'content=(\w+)', p)
        c = m.group(1) if m else None
        tgt = {'bio': '/story/', 'contact': '/contact/', 'mailinglist': '/contact/', 'mailorder': '/music/',
               'music': '/music/', 'news': '/vault/news/', 'photos': '/photos/', 'album': '/music/'}.get(c, '/vault/news/')
        if c is None and 'em1884' in p:
            tgt = '/vault/news/'
        note = ('2007-09 echomusic CMS query-string URL. Carrd redirects and Cloudflare _redirects cannot match '
                'query strings, so this lands on the home page (200) unless a Worker or Cloudflare Redirect Rule '
                'matches the query. Low traffic; acceptable to leave on home.')
        if 'album=88761' in p:
            note += ' Album 88761 has 12 track IDs (em1886): probably Nonetheless (12 tracks); unverified inference.'
        return ('2007-09 echomusic CMS', 'query-page', '301-if-query-capable', tgt, note)
    if base in ('/index4.html', '/splash.html', '/luxuryliners.html'):
        return ('2002-05 framed/red splash', 'home-variant', '301', '/', 'Old splash/frame page.')

    # --- journal
    m = re.match(r'^/(?:blogs/)?(\d{4})_(\d{2})_01_(archives|month)\.html$', base)
    if m:
        y, mo, kind = m.groups()
        if status == '200' and kind == 'archives':
            return ('2001-04 journal', 'journal-month', '301', f'/vault/journal/{y}-{mo}/',
                    'Monthly archive of the band journal (Blogger-style). Re-publish the month on the new site.'
                    + (' Early copy under /blogs/ (Aug 2001).' if base.startswith('/blogs/') else ''))
        return ('2001-05 journal', 'journal-month-empty', '301', '/vault/journal/',
                '404 when captured: the archive link existed but the month had no page (journal stopped March 2004).')
    if base in ('/journal.html', '/archives.html'):
        return ('2001-04 journal', 'journal-index', '301', '/vault/journal/', 'Journal front page / archive index.')
    if base.startswith('/blogs/images/'):
        return ('2001 blue', 'asset', 'none', None, 'Broken relative image path from the /blogs/ copy; 404 when captured.')

    # --- music / store
    if base in ('/music.html', '/albums.html', '/history/music.html', '/merch.htm', '/store', '/store/',
                '/store/cat/LuxuryLiners'):
        if base == '/history/music.html':
            return ('2004-05 history (album notes)', 'music', '301', '/music/',
                    'Album notes page (2004-05): Trunk Box tracklist, Live Liners, From The Vaults. High value: re-publish its copy on /music/.')
        return ('2000-08', 'music', '301', '/music/', 'Albums / music / store page.')

    # --- story / bios
    if base in ('/bio.htm', '/biography.htm', '/bio.html', '/bios.html', '/band.html', '/history', '/history/',
                '/history/index.html', '/history/intro.html', '/history/story.html'):
        return ('2000-05', 'story', '301', '/story/', 'Band bio / history / roster page.')
    if base == '/data.html':
        return ('2002-05 khaki', 'story', '301', '/story/', '"data": Overbored one-sheet bio and member "data" profiles.')
    if base == '/history/concerts.html':
        return ('1997-2003 (guess; page captured 2003-05)', 'shows', '301', '/shows/', 'Concert history page (list of past shows).')
    if base in ('/events.htm',):
        return ('2000', 'shows', '301', '/shows/', 'Shows / concert history.')
    if base == '/history/photos.html':
        return ('2003-05 history', 'photos', '301', '/photos/', 'History photo page (dated 1997-2000 photos).')
    if base == '/history/photos/00_blackfaces.jpg':
        return ('2000 (file name)', 'sensitive-image', 'none', None,
                'SENSITIVE: do not re-host or reuse without owner review. A human must look at this image before any decision; do not describe it in public copy.')
    if base.startswith('/history/photos/'):
        return ('2003-05 history', 'photo-file', 'rehost-or-none', None,
                'Dated history photo (filename gives year and subject). Ask David for the original; re-host only if it is used.')
    if base.startswith('/history/'):
        return ('2003-05 history', 'asset', 'none', None, 'History-section asset.')

    if base == '/store/product/5/Nonetheless':
        return ('2007-09 echomusic CMS', 'music', '301', '/music/nonetheless/', '2008 store product page.')
    if base == '/lyrics.html':
        return ('2002-05 khaki', 'lyrics', '301', '/lyrics/', 'Overbored lyrics and chord charts.')

    # --- audio
    if base.startswith('/mp3/waco/') or base.startswith('/web/mp3/waco/'):
        return ('2001 blue', 'mp3', 'rehost-same-path' if status == '200' else '301', '/vault/trunk-box/',
                'Trunk Box (live, E-Cleff Studios, Waco TX, fall 1998). Best: re-host the file at this same path; otherwise 301.')
    if base.startswith('/mp3/7.18.02/') or base.startswith('/mp3/20021117/'):
        return ('2004-05 red splash', 'mp3', '301', '/vault/live-liners/',
                'Live Liners (12th & Porter, 2002-07-18 / 2002-11-17). 404 when captured (2005/2021): the file names were cut off; get the audio from David.')
    if base.startswith('/mp3/misc/') and status != '200':
        return ('2004-05 red splash', 'mp3', '301', '/vault/mp3s/', 'Covers/unreleased MP3 link, truncated URL, 404 when captured.')
    if base.startswith('/mp3/'):
        return ('2005-07', 'mp3', 'rehost-same-path', '/vault/mp3s/',
                'Free MP3 archived as audio/mpeg. Best: re-host the file at this same path (old links and blog posts keep working); otherwise 301 to the Vault.')
    if base.startswith('/ram/'):
        return ('2001 blue', 'realaudio', '301', '/vault/mp3s/', 'RealAudio pointer file (.ram) for a streaming clip. Point to the MP3 in the Vault.')

    # --- photos
    m = re.match(r'^/photos/([^/]+)/', base)
    if m and base.endswith('.html'):
        s = m.group(1)
        return (gallery_period(s), 'photo-page', '301', '/photos/',
                f'Gallery "{PHOTO_SETS.get(s, s)}" page. No credits on the old pages.')
    if m:
        return (gallery_period(m.group(1)), 'photo-file', 'rehost-or-none', None,
                f'Image from gallery "{PHOTO_SETS.get(m.group(1), m.group(1))}". Ask David for originals.')
    if base in ('/photos.htm', '/photos.html', '/pictures.htm', '/xml/photos.php'):
        return ('2000-09', 'photos', '301', '/photos/', 'Photos index (or the 2007 Flash gallery XML feed).')
    if base.startswith('/photos/'):
        return ('2002-05 khaki', 'asset', 'none', None, 'Gallery button image.')

    # --- press / downloads
    if base == '/press.html':
        return ('2000-05', 'press', '301', '/press/', 'Press quotes page (about 30 dated quotes 2001-04).')
    if base.startswith('/downloads/'):
        return ('2002-05 khaki', 'press-file', 'rehost-same-path', '/press/',
                'Press download (one-sheet PDF or 300 dpi band photo). Re-host at the same path if David approves; otherwise 301 to /press/.')

    # --- contact
    if base in ('/contact.html', '/email.html', '/mail_list.htm', '/mail_list.html'):
        return ('2000-05', 'contact', '301', '/contact/', 'Contact / mailing-list page.')

    # --- misc pages
    if base == '/ethan.html':
        return ('2002', 'private-family-page', '301', '/', 'Private family page. PRIVATE: do not republish or describe; redirect to home only.')
    if base in ('/links.html', '/misc.html', '/multimedia.html'):
        return ('2001-03', 'misc', '301', '/vault/', 'Links / misc / multimedia (videos) page.')
    if base in ('/news.htm', '/news.html'):
        return ('2000-02', 'news', '301', '/vault/news/', 'News page (2000 / 2002).')
    if base.startswith('/foxymorons/'):
        if base.endswith('.html'):
            return ('2002 khaki', 'foxymorons', '301', 'https://foxymorons.com/',
                    'The Foxymorons mailing-list page, hosted on this domain in Dec 2002.')
        return ('2002 khaki', 'asset', 'none', None, 'Foxymorons list asset.')
    if base.startswith('/go/'):
        return ('2007-09 echomusic CMS', 'tracking-link', '301', '/',
                'echomusic e-mail/click-tracking link (2008); the query-string variants were 404 by 2021.')
    if base.startswith('/email/'):
        return ('2002-04 e-newsletters', 'newsletter-image', 'none', None,
                'Image from an HTML e-mail newsletter; the file name dates the mailing. 404 (or revisit) when captured in 2021.')
    if base.startswith('/client_images/') or base.startswith('/swf/') or base.startswith('/scripts/') \
            or base.startswith('/javascript/') or base == '/expressinstall.swf' or base == '/css.css':
        return ('2007-09 echomusic CMS', 'asset', 'none', None, 'echomusic CMS asset.')
    if base == '/css/theluxuryliners.css' or base == '/images/jumping.jpg':
        return ('2009-24 link list', 'asset', 'none', None,
                'Asset of the 2009-2024 page. /images/jumping.jpg was the 2024 og:image; ask David for the original photo.')
    if re.search(r'(ethan|liliana)', base, re.I):
        return ('see capture_era', 'private-image', 'none', None, 'Personal/family image. PRIVATE: never re-host or describe.')
    if base.startswith('/images/') or base.startswith('/gif/') or base.startswith('/web/images/') \
            or base.startswith('/background/') or base in ('/animate.js', '/main.css', '/content.css') \
            or base.endswith(('.jpg', '.JPG', '.gif')):
        return ('see capture_era', 'asset', 'none', None, 'Old image/script/style file. No rule (404). See 03 §7 for images worth asking David for.')
    return ('?', 'other', 'none', None, 'Unclassified.')


ERAS = [
    ('20000101', 'E1 FrontPage (Apr-Sep 2000)'),
    ('20001001', 'E2 blue table layout (Oct 2000-Mar 2002)'),
    ('20020401', 'E3 khaki photo-collage frame (Apr 2002-Sep 2004)'),
    ('20040928', 'E4 red rotating-photo splash (Sep 2004-Nov 2005)'),
    ('20051201', 'E5 white logo page, then echomusic CMS (Dec 2005-Jun 2009)'),
    ('20090701', 'E6 link list, then hand-coded page (Jul 2009-Sep 2024)'),
    ('20241001', 'E7 Carrd (Oct 2024-today)'),
]


def capture_era(ts):
    e = ERAS[0][1]
    for start, name in ERAS:
        if ts[:8] >= start:
            e = name
    return e

out = []
for o, t, s, m in rows:
    p = norm(o)
    era, cat, action, tgt, note = classify(p, s, m)
    base = p.split('?')[0]
    later = KNOWN_LATER.get(p, [])
    allts = sorted(set([t] + later))
    rec = {
        'url': o,
        'path': p,
        'first_capture': ts_iso(t),
        'first_capture_ts': t,
        'last_known_capture': ts_iso(allts[-1]) if len(allts) > 1 else None,
        'last_known_capture_ts': allts[-1] if len(allts) > 1 else None,
        'wayback_url': 'Wayback link to the first capture. null for private-* and sensitive-image rows on purpose: the path stays in the inventory, but nobody should be one click from those files.',
        'cdx_status': s,
        'cdx_mimetype': m,
        'live_status_2026_10_07': live.get(p),
        'capture_era': capture_era(t),
        'content_period': era,
        'category': cat,
        'action': action,
        'suggested_target': tgt,
        'daviddewese_handover_target': dd.get(base),
        'wayback_url': None if cat.startswith('private') or cat == 'sensitive-image' else f'https://web.archive.org/web/{t}/{o}',
        'note': note,
    }
    out.append(rec)

out.sort(key=lambda r: (r['path'].split('?')[0], r['path']))
counts = collections.Counter(r['action'] for r in out)
cats = collections.Counter(r['category'] for r in out)
doc = {
    'generated': '2026-10-07',
    'site': 'theluxuryliners.com',
    'source': {
        'cdx': CDX,
        'cdx_query': 'https://web.archive.org/cdx/search/cdx?url=theluxuryliners.com/*&output=json&fl=original,timestamp,statuscode,mimetype&collapse=urlkey (pulled by the daviddewese.com team, 2026-09-28; Wayback is blocked from this session)',
        'handover_audit': LLA,
        'live_check': 'curl https://theluxuryliners.com<path> for every path, 2026-10-07',
    },
    'field_notes': {
        'capture_era': 'Design era of the site on the date of first capture (eras in research/03 §2). A file may be older than its first capture.',
        'content_period': 'Rough period the page/file CONTENT belongs to: from dated gallery names, the earliest archive date of the gallery (photos can be no newer than that), or the page subject. Hand-assigned rule; where it says "or earlier" the photos may be older. For the design era use capture_era.',
        'first_capture': 'Earliest Wayback capture of that URL (the CDX is collapsed by urlkey, so it holds one row per URL: the first).',
        'last_known_capture': 'Only filled where a later capture was actually opened and cited by research/04 (daviddewese.com). null = unknown, NOT "only captured once". Get real last-capture dates from a fresh CDX pull without collapse (needs-a-browser list).',
        'wayback_url': 'Wayback link to the first capture. null for private-* and sensitive-image rows on purpose: the path stays in the inventory, but nobody should be one click from those files.',
        'cdx_status': 'HTTP status Wayback recorded at first capture ("-" = warc/revisit).',
        'live_status_2026_10_07': 'What the live Carrd site returns today. Query-string URLs return 200 because Carrd ignores the query and serves the home page.',
        'action': '301 = permanent redirect to suggested_target; 301-if-query-capable = only possible with a Cloudflare Worker / Redirect Rule (Carrd and _redirects cannot match query strings), otherwise it lands on home; rehost-same-path = put the file back at the same path (best for MP3s and press downloads), else 301 to suggested_target; rehost-or-none = re-host only if the image is used; keep = live page; serve = the new site serves this file; none = no rule (404 is correct).',
        'suggested_target': 'PROVISIONAL path on the new theluxuryliners.com (/, /story/, /music/, /music/<slug>/, /lyrics/, /shows/, /press/, /photos/, /vault/, /vault/journal/<yyyy-mm>/, /vault/news/, /vault/mp3s/, /vault/trunk-box/, /vault/live-liners/, /contact/). The architecture track must confirm the IA; then regenerate.',
        'daviddewese_handover_target': 'Target in the daviddewese.com handover pack (architecture/redirects/ll-legacy-urls.json), which assumed the archive would fold into daviddewese.com. Superseded for this rebuild because the band keeps its own site (L1); kept for traceability.',
    },
    'counts': {'rows': len(out), 'by_action': dict(counts), 'by_category': dict(cats)},
    'urls': out,
}
json.dump(doc, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(out), dict(counts))
print(dict(cats))
