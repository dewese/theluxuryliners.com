// Structured data (plan §8.2, owner decisions LL-5 and LL-9). One MusicGroup on every page
// (by @id; the full node on the home page), a MusicAlbum per release page, FAQPage on /facts/
// for answers visible there. scripts/check-jsonld.mjs checks every page.
import { members, bandRoles, type Member } from './members.ts';
import { SITE, BAND, ONE_LINER, DISAMBIGUATION, SAME_AS } from './site.ts';
import { isoDuration } from './dates.ts';
import { RELEASES, type Release } from './releases.ts';

export const BAND_ID = `${SITE}/#band`;
const plain = (s: string) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

const person = (p: Member) => ({
  '@type': 'Person', '@id': p.jsonldId, name: p.plainName,
  ...(p.url ? { url: p.url } : {}),
  ...(p.id === 'david-wilstermann' ? { alternateName: 'Larry' } : {}),
});

/** LL-9: the four forever members are the band today, so no member has an endDate. Chad left
 *  Nashville in March 2001 and is in the band again today; his membership is modelled as current
 *  from 1997 (BUILD-LOG, "JSON-LD"). LL-5: founded in Texas in 1997; the town is never named. */
export function musicGroup() {
  const forever = members();
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
    member: forever.map((p) => ({ '@type': 'OrganizationRole', roleName: bandRoles(p).join(', '), startDate: p.startDate, member: person(p) })),
    // LL-19: Nashville is the band's home town. Band-level only, never a place per member (LL-7).
    location: { '@type': 'Place', name: 'Nashville, Tennessee', address: { '@type': 'PostalAddress', addressLocality: 'Nashville', addressRegion: 'TN', addressCountry: 'US' } },
    album: RELEASES.map((r) => ({ '@type': 'MusicAlbum', '@id': `${SITE}/music/${r.slug}/#album`, name: r.title, url: `${SITE}/music/${r.slug}/` })),
    genre: ['Power pop', 'Pop rock'],
    logo: `${SITE}/logos/roundel-wordmark.png`,
    image: `${SITE}/img/photos/four-2002-1096.jpg`,
    sameAs: SAME_AS,
  };
}

/** The band as a typed reference with its name, so a page without the full node still names it
 *  (audit-seo round 1, S1). */
export const bandRef = { '@type': 'MusicGroup', '@id': BAND_ID, name: BAND };

export function website() {
  return { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: BAND, publisher: bandRef, inLanguage: 'en-US' };
}

const RELEASE_TYPE: Record<string, string> = { Album: 'AlbumRelease', EP: 'EPRelease', Single: 'SingleRelease' };

/** "Echomusic / Litterbug Records" is two labels: one Organization each (audit-seo round 1, S3). */
const labels = (label: string) => label.split(/\s+\/\s+/).map((name) => ({ '@type': 'Organization', name: name.replace(/\s*\((?:Sweden)\)$/, '') }));

export function musicAlbum(r: Release) {
  const albumId = `${SITE}/music/${r.slug}/#album`;
  return {
    '@type': 'MusicAlbum',
    '@id': albumId,
    name: r.title,
    url: `${SITE}/music/${r.slug}/`,
    byArtist: bandRef,
    datePublished: r.date,
    albumReleaseType: RELEASE_TYPE[r.kind],
    albumProductionType: r.slug === 'shake-it-up-live' ? 'LiveAlbum' : 'StudioAlbum',
    numTracks: r.tracks.length,
    track: r.tracks.map((t) => ({
      '@type': 'MusicRecording', name: t.title, position: t.n, byArtist: bandRef, inAlbum: { '@id': albumId },
      ...(t.duration ? { duration: isoDuration(t.duration) } : {}),
      ...(t.isrc ? { isrcCode: t.isrc } : {}),
      ...(t.writers.length ? { recordingOf: { '@type': 'MusicComposition', name: t.title, composer: t.writers.map((w) => ({ '@type': 'Person', name: plain(w) })) } } : {}),
    })),
    recordLabel: labels(r.label).length === 1 ? labels(r.label)[0] : labels(r.label),
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
