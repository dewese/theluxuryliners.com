// Structured data (plan §8.2, owner decisions LL-5 and LL-9). One MusicGroup on every page
// (by @id; the full node on the home page), a MusicAlbum per release page, FAQPage on /facts/
// for answers visible there. scripts/check-jsonld.mjs checks every page.
import people from '../../data/people.json';
import { SITE, BAND, ONE_LINER, DISAMBIGUATION, SAME_AS } from './site.ts';
import { isoDuration } from './dates.ts';
import type { Release } from './releases.ts';

export const BAND_ID = `${SITE}/#band`;
const plain = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

const person = (p: (typeof people.forever)[number]) => ({
  '@type': 'Person', '@id': p.jsonldId, name: (p as any).plainName ?? p.name,
  ...((p as any).url ? { url: (p as any).url } : {}),
  ...(p.id === 'david-wilstermann' ? { alternateName: 'Larry' } : {}),
});

/** LL-9: the four forever members are the band today, so no member has an endDate. Chad left
 *  Nashville in March 2001 and plays on the 2026 singles; his membership is modelled as current
 *  from 1997 (BUILD-LOG, "JSON-LD"). LL-5: founded in Texas in 1997; the town is never named. */
export function musicGroup() {
  const forever = people.forever.filter((p) => p.status === 'publish');
  const founders = forever.filter((p) => p.id === 'david-dewese' || p.id === 'chad-edgington');
  return {
    '@type': 'MusicGroup',
    '@id': BAND_ID,
    name: BAND,
    alternateName: 'Luxury Liners',
    url: `${SITE}/`,
    description: plain(ONE_LINER),
    disambiguatingDescription: plain(DISAMBIGUATION),
    foundingDate: '1997',
    foundingLocation: { '@type': 'Place', name: 'Texas', address: { '@type': 'PostalAddress', addressRegion: 'TX', addressCountry: 'US' } },
    founder: founders.map(person),
    member: forever.map((p) => ({ '@type': 'OrganizationRole', roleName: p.role.replace(/^Co-founder; /, ''), startDate: p.startDate, member: person(p) })),
    genre: ['Power pop', 'Pop rock'],
    logo: `${SITE}/logos/roundel-wordmark.png`,
    image: `${SITE}/img/photos/four-2002-1096.jpg`,
    sameAs: SAME_AS,
  };
}

export const bandRef = { '@id': BAND_ID };

export function website() {
  return { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: BAND, publisher: bandRef, inLanguage: 'en-US' };
}

const RELEASE_TYPE: Record<string, string> = { Album: 'AlbumRelease', EP: 'EPRelease', Single: 'SingleRelease' };

export function musicAlbum(r: Release) {
  return {
    '@type': 'MusicAlbum',
    '@id': `${SITE}/music/${r.slug}/#album`,
    name: r.title,
    url: `${SITE}/music/${r.slug}/`,
    byArtist: bandRef,
    datePublished: r.date,
    albumReleaseType: RELEASE_TYPE[r.kind],
    albumProductionType: r.slug === 'shake-it-up-live' ? 'LiveAlbum' : 'StudioAlbum',
    numTracks: r.tracks.length,
    track: r.tracks.map((t) => ({
      '@type': 'MusicRecording', name: t.title, position: t.n,
      ...(t.duration ? { duration: isoDuration(t.duration) } : {}),
      ...(t.isrc ? { isrcCode: t.isrc } : {}),
      ...(t.writers.length ? { recordingOf: { '@type': 'MusicComposition', name: t.title, composer: t.writers.map((w) => ({ '@type': 'Person', name: plain(w) })) } } : {}),
    })),
    recordLabel: { '@type': 'Organization', name: r.label },
    image: `${SITE}${r.cover}-1200.jpg`,
    ...(r.upc ? { gtin: r.upc } : {}),
    sameAs: r.listen.map((l) => l.href),
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage', '@id': `${SITE}/facts/#faq`,
    mainEntity: items.map((i) => ({ '@type': 'Question', name: plain(i.q), acceptedAnswer: { '@type': 'Answer', text: plain(i.a) } })),
  };
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
