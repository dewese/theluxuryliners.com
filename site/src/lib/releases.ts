// The public release model, built from the repository's master catalogue data/releases.json
// (LL-3: this repository is the master for the band's releases). Only public fields leave this
// module: never the research notes, candidate dates, confidence labels or internal links.
import raw from '../../../data/releases.json';
import artwork from '../../data/artwork.json';
import press from '../../data/press.json';
import { monthYear } from './dates.ts';

type Raw = (typeof raw)[number] & Record<string, any>;

/** Release id (master data) -> page slug. Only these get pages under /music/<slug>/. */
export const SLUGS: Record<string, string> = {
  'luxury-liners-2000-sound-as-ever': 'sound-as-ever',
  'luxury-liners-2001-believe-ep': 'believe-ep',
  'luxury-liners-2003-overbored': 'overbored',
  'luxury-liners-2006-nonetheless': 'nonetheless',
  'luxury-liners-2021-shake-it-up-live': 'shake-it-up-live',
  'luxury-liners-2026-great-day': 'great-day',
  'luxury-liners-2026-new-beginning': 'new-beginning',
};
export const LP_ID = 'luxury-liners-2026-sound-as-ever-lp';

/** Cover masters (repository-relative). LL-30: the live single uses the 3000 px released cover. */
export const COVER_SOURCES: Record<string, string> = {
  'sound-as-ever': 'assets/source/covers/soundasever.jpg',
  'believe-ep': 'assets/source/covers/believe.jpg',
  overbored: 'assets/source/covers/overbored.jpg',
  nonetheless: 'assets/source/covers/nonetheless.jpg',
  'shake-it-up-live': 'assets/reference/dsp-artwork/shake-it-up-live-apple-music-3000.jpg',
  'great-day': 'assets/source/covers/great-day-1-upscale.png',
  'new-beginning': 'assets/source/covers/new-beginning-3000x3000-final.jpg',
};

/** LL-14: owner songwriting decisions override the master data's per-track writers. */
const WRITER_OVERRIDES: Record<string, (title: string) => string[] | undefined> = {
  nonetheless: () => ['David Dewese'],
  'great-day': () => ['Chad Edgington', 'David Dewese'],
  'new-beginning': () => ['Chad Edgington', 'David Dewese'],
  'sound-as-ever': (t) => (t === 'The Duke Of Gloucester' ? ['David Dewese'] : undefined),
};
/** Writers that rest on one source (Discogs) and are attributed on the page. */
const WRITERS_ATTRIBUTED: Record<string, string> = {
  'believe-ep': 'Writers as Discogs credits them.',
  'shake-it-up-live': 'Writers as Discogs credits them on the Believe EP.',
};

/** Who plays on each record (from the credits and the owner decisions; band roles only). */
const PLAYERS: Record<string, string[]> = {
  'sound-as-ever': ['David Dewese', 'Chad Edgington', 'Scott Carpenter'],
  'believe-ep': ['David Dewese', 'Chad Edgington', 'Scott Carpenter'],
  overbored: ['David Dewese (guitar, vocals)', 'David “Larry” Wilstermann (bass)', 'Scott Carpenter (drums)', 'Paul Seykora (keyboards on “Dreaming” and “Woman”)'],
  nonetheless: ['David Dewese (vocals, guitar)', 'David “Larry” Wilstermann (bass, keyboards, vocals)', 'Scott Carpenter (drums, percussion, vocals)', 'Ryan Gilbert (keyboards, vocals)', 'Gary Ishee (guitar on “Breaking Out” and “How It Should Be”)', 'Erika Proegler (violin on “Sold Out”)', 'Brent Milligan (cello on “Sold Out”)'],
  'shake-it-up-live': ['Chad Edgington (guitar)', 'David Dewese (bass)', 'Scott Carpenter (drums)'],
  'great-day': ['David Dewese', 'Chad Edgington', 'Scott Carpenter', 'David “Larry” Wilstermann'],
  'new-beginning': ['David Dewese', 'Chad Edgington', 'Scott Carpenter', 'David “Larry” Wilstermann'],
};
const PRODUCTION: Record<string, string[]> = {
  'sound-as-ever': ['Produced by Mike Poole (tracks 1–7 and 10–15) and Mark Montgomery (tracks 8–9)', 'Recorded and mixed by Mike Poole in Nashville'],
  'believe-ep': ['Produced by Mark Montgomery and The Luxury Liners', 'Engineered by Mark Montgomery and Chris Milfred', 'Mixed by Shane D. Wilson', 'Mastered by Chris Milfred'],
  overbored: ['Recorded by Doug Nightwine', 'Mixed by Chris Henning'],
  nonetheless: ['Mixed and mastered by Chris Henning'],
};
/** Short public notes (no dates: the date is shown once, in the release header). */
const NOTES: Record<string, string[]> = {
  'sound-as-ever': ['The album is named after Gram Parsons’s sign-off, “Sound as ever”.', 'Tracks 13–15 are hidden tracks.'],
  'believe-ep': ['“Shake It Up” is a Luxury Liners original. “Believe” is a cover of the Cher song.'],
  overbored: ['“Dreaming” was used in One Tree Hill, season 1, episode 15, “Suddenly Everything Has Changed” (The WB).', '“Sunshine” was the theme song of FOX Sports’ US Youth Soccer Show.'],
  nonetheless: [],
  'shake-it-up-live': ['Recorded live at the Texas Music Café in Waco, Texas, in autumn 1998. The song first appeared on the Believe EP (2001).'],
  'great-day': [],
  'new-beginning': ['Track 2 is “Great Day”.'],
};
/** One-line blurbs for the home page and the Music list: what is true and particular about each
 *  record. Never filler, never a date (the date is shown next to it). */
export const BLURBS: Record<string, string> = {
  'sound-as-ever': 'The debut album, named after Gram Parsons’s sign-off.',
  'believe-ep': 'Three songs: two originals, including “Shake It Up”, and a cover of Cher’s “Believe”.',
  overbored: 'The first album by the trio, with “Dreaming”, heard on One Tree Hill.',
  nonetheless: 'Twelve songs, all written by David Dewese.',
  'shake-it-up-live': 'The Believe EP original, recorded live in Waco, Texas, in autumn 1998, with Chad on guitar, David on bass and Scott on drums.',
  'great-day': 'Written by Chad Edgington and David Dewese, with all four forever members playing.',
  'new-beginning': 'A second song by Chad Edgington and David Dewese with all four forever members playing, paired with “Great Day”.',
};

const KIND: Record<string, string> = { album: 'Album', ep: 'EP', single: 'Single' };
const LISTEN_LABELS: Record<string, string> = { spotify: 'Spotify', apple_music: 'Apple Music', bandcamp: 'Bandcamp', youtube_music: 'YouTube Music', tidal: 'Tidal', deezer: 'Deezer', amazon_music: 'Amazon Music' };

export interface Track { n: number; title: string; duration?: string; writers: string[]; isrc?: string; coverOf?: string }
export interface Release {
  id: string; slug: string; title: string; kind: string; date: string; dateLabel: string; year: string;
  label: string; catalog?: string; upc?: string; tracks: Track[]; writersNote?: string;
  listen: { key: string; label: string; href: string }[]; discogs?: string;
  cover: string; coverAlt: string; artwork: { name: string; role: string; edition?: string }[];
  players: string[]; production: string[]; notes: string[]; blurb: string;
  press: (typeof press.items)[number][];
  lp?: { year: string; label: string; tracks: number; artwork: { name: string; role: string }[]; listen: { label: string; href: string }[] };
}

function findRaw(id: string): Raw {
  const r = (raw as Raw[]).find((x) => x.id === id);
  if (!r) throw new Error(`releases.json: no release ${id}`);
  return r;
}

const coverAlt = (r: Raw, title: string) => `Sleeve art for ${title} by The Luxury Liners.`;

export function release(id: string): Release {
  const r = findRaw(id);
  const slug = SLUGS[id];
  const tracks: Track[] = (r.tracklist ?? []).map((t: any, i: number) => {
    const over = WRITER_OVERRIDES[slug]?.(t.title);
    const cover = t.original_artist ?? (t.title === 'Believe' && slug === 'believe-ep' ? 'Cher' : undefined);
    return {
      n: t.number ?? i + 1, title: t.title, duration: t.duration ?? undefined,
      writers: cover ? [] : (over ?? t.writers ?? []), isrc: t.isrc ?? undefined, coverOf: cover,
    };
  });
  const listen = Object.entries(r.links ?? {}).filter(([, v]) => typeof v === 'string' && v).map(([k, v]) => ({ key: k, label: LISTEN_LABELS[k] ?? k, href: v as string }));
  const art = artwork.credits.filter((c) => c.release === slug && c.status === 'publish');
  const out: Release = {
    id, slug, title: r.title, kind: KIND[r.type] ?? r.type, date: r.release_date, dateLabel: monthYear(r.release_date), year: r.release_date.slice(0, 4),
    label: r.label, catalog: r.catalog_number ?? undefined, upc: r.upc ?? undefined, tracks, writersNote: WRITERS_ATTRIBUTED[slug],
    listen, discogs: r.other_links?.discogs ?? r.links?.discogs ?? undefined,
    cover: `/img/covers/${slug}`, coverAlt: coverAlt(r, r.title),
    artwork: art.filter((c) => !c.edition).map((c) => ({ name: c.name, role: c.role })),
    players: PLAYERS[slug] ?? [], production: PRODUCTION[slug] ?? [], notes: NOTES[slug] ?? [], blurb: BLURBS[slug] ?? '',
    press: press.items.filter((p) => p.status === 'publish' && (p as any).release === slug),
  };
  if (slug === 'sound-as-ever') {
    const lp = findRaw(LP_ID);
    out.lp = {
      year: lp.release_date.slice(0, 4), label: 'Sound Asleep Records (Sweden)', tracks: (lp.tracklist ?? []).length,
      artwork: art.filter((c) => c.edition).map((c) => ({ name: c.name, role: c.role })),
      listen: [],
    };
  }
  return out;
}

/** The seven releases with pages, newest first. */
export const RELEASES: Release[] = Object.keys(SLUGS).map(release).sort((a, b) => b.date.localeCompare(a.date));
export const bySlug = (slug: string) => RELEASES.find((r) => r.slug === slug)!;
export const LATEST = RELEASES[0];

/** Compilations and bonus discs (/music/appearances/). Third-party art is never hosted. */
export interface Appearance { id: string; title: string; year: string; label?: string; songs: string[]; note?: string; links: { label: string; href: string }[] }
const APPEARANCE_PUBLIC: Record<string, { note?: string; songs?: string[] | null; links?: boolean; label?: string }> = {
  'll-appearance-1998-fireworks-vol-2': { note: 'A power-pop compilation from Sweden.' },
  'll-appearance-1998-nashpop': { label: 'Not Lame Recordings' },
  'll-appearance-2001-sesac-sxsw-promo': { note: 'A promo CD from the SESAC Showcase at SXSW 2001, where the band played.', label: '' },
  'll-appearance-2005-between-goodlettsville-and-murfreesboro': {},
  // LL-13: the 2008 disc that carries the 'Great Day' demo is never listed or linked.
  'll-appearance-2023-texas-music-cafe-25-years-vol-1': { note: 'A different live recording of “Shake It Up” from the 2021 single.' },
  'll-appearance-2025-fireworks-vol-3': { note: '“Precious To My Heart” is the first hidden track of Sound As Ever.' },
};
export const APPEARANCES: Appearance[] = Object.entries(APPEARANCE_PUBLIC).map(([id, pub]) => {
  const r = findRaw(id);
  const links = pub.links === false ? [] : Object.entries({ ...(r.links ?? {}), ...(r.other_links ?? {}) })
    .filter(([, v]) => typeof v === 'string' && v).map(([k, v]) => ({ label: LISTEN_LABELS[k] ?? (k === 'discogs' ? 'Discogs' : k), href: v as string }));
  const label = pub.label ?? (r.label && r.label !== 'None' ? r.label : undefined);
  return {
    id, title: r.title, year: r.release_date.slice(0, 4), label: label || undefined,
    songs: pub.songs === null ? [] : (r.tracklist ?? []).map((t: any) => t.title), note: pub.note, links,
  };
}).sort((a, b) => a.year.localeCompare(b.year));
