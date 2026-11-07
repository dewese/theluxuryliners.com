// Canonical strings for the whole site. One fact, one wording (plan §2 rule 9, §8.1).
// Owner decisions are quoted in comments only; never on a page.

export const SITE = 'https://theluxuryliners.com';
export const BAND = 'The Luxury Liners';

/** LL-6: the canonical one-liner, byte for byte as approved (straight quotes around 'Luxury
 *  Liner' included). It is the one string the curly-quote pass (typo.ts) never touches, so it reads
 *  the same on every page, in JSON-LD and in llms.txt; content/check-content.mjs --dist compares it
 *  raw. */
export const ONE_LINER =
  "The Luxury Liners are a power-pop band co-founded in 1997 by David Dewese and Chad Edgington, who took it to Nashville together. The name comes from the Gram Parsons song 'Luxury Liner'.";

/** LL-17: exact site wording. */
export const NEVER_BROKE_UP =
  'The band never broke up. The four forever members reconnected during the pandemic and started making music again.';

/** Plan §5.3 item 2: the honest status line; Carly's team edits it when something real happens. */
export const STATUS_LINE = 'Founded in 1997. Two singles in 2026.';

/** Plan §8.4: disambiguation, visible on Home and Facts, in JSON-LD and llms.txt. No year for Luxury Liner (§4.3). */
export const DISAMBIGUATION =
  'Not to be confused with Emmylou Harris’s album Luxury Liner; Luxury Liners, the recording name of singer-songwriter Carter Tanton (They’re Flowers, 2013); the Finnish band Luxury Liner; or the bands Luxury (Georgia, 1990s) and Luxury (Iowa, 1977–82).';

/** LL-19: may say this; never which member lives where. */
export const SPREAD = 'Nashville is the band’s home town; the four are now spread across Tennessee, Michigan and Texas.';

export const NAV = [
  { href: '/story/', label: 'Story' },
  { href: '/music/', label: 'Music' },
  { href: '/people/', label: 'People' },
  { href: '/vault/', label: 'Vault' },
  { href: '/listen/', label: 'Listen' },
];

export const FOOTER_NAV = [
  { href: '/shows/', label: 'Shows' },
  { href: '/photos/', label: 'Photos' },
  { href: '/press/', label: 'Press' },
  { href: '/epk/', label: 'EPK' },
  { href: '/facts/', label: 'Facts' },
  { href: '/contact/', label: 'Contact' },
  { href: '/accessibility/', label: 'Accessibility' },
  { href: '/privacy/', label: 'Privacy' },
];

/** LL-36: the band's own social accounts (footer and JSON-LD). No SoundCloud. */
export const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/theluxuryliners/' },
  { label: 'Facebook', href: 'https://www.facebook.com/theluxuryliners/' },
];

/** Where the band's music lives (artist pages). Bandcamp is David's account (LL-36). */
export const ARTIST_LINKS = [
  { key: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc' },
  { key: 'apple_music', label: 'Apple Music', href: 'https://music.apple.com/us/artist/the-luxury-liners/47333263' },
  { key: 'bandcamp', label: 'Bandcamp', href: 'https://daviddewese.bandcamp.com/' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCi2Kheqfw714F4v8bwBbViA' },
  { key: 'deezer', label: 'Deezer', href: 'https://www.deezer.com/artist/1518436' },
  { key: 'tidal', label: 'Tidal', href: 'https://tidal.com/browse/artist/5748092' },
];

/** Plan §8.3 allow-list for MusicGroup sameAs (checked by scripts/check-jsonld.mjs). Bandcamp is
 *  deliberately absent: daviddewese.bandcamp.com is David's account, so it is linked from each
 *  release (url) and from /listen/, never as the band entity's sameAs (BUILD-LOG, "sameAs"). */
export const SAME_AS = [
  'https://open.spotify.com/artist/3416B3EOd5itWZazwzw9Qc',
  'https://music.apple.com/us/artist/the-luxury-liners/47333263',
  'https://www.youtube.com/channel/UCi2Kheqfw714F4v8bwBbViA',
  'https://www.instagram.com/theluxuryliners/',
  'https://www.facebook.com/theluxuryliners/',
  'https://musicbrainz.org/artist/7af7fd54-1d1b-4353-ab60-4b61bceed337',
  'https://www.discogs.com/artist/4298743-The-Luxury-Liners',
  'https://www.deezer.com/artist/1518436',
  'https://tidal.com/browse/artist/5748092',
  // the band page on David's site: the same band, so engines see one entity (audit-seo round 1, S4)
  'https://daviddewese.com/bands/the-luxury-liners/',
];

export const RELATED = [
  { label: 'David Dewese', href: 'https://daviddewese.com/' },
  { label: 'The Foxymorons', href: 'https://foxymorons.com/' },
];

/** LL-39: no designer credit; the colophon dates the logos. */
export const COLOPHON = 'The band’s logos date from 1999–2002.';

/** P40: the neutral rights line for cover art. */
export const COVER_RIGHTS = 'All rights reserved by the rights holders.';
/** The footer's line (plan line 58, P40): every page that can show a cover carries it. */
export const COVER_RIGHTS_LINE = 'Cover art: all rights reserved by the rights holders.';
