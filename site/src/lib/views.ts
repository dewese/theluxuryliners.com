// What each page shows: the copy track's content/ files when they exist, else site/data and
// PLACEHOLDER copy. Every string that can hold Markdown is returned as HTML ('...Html').
import { json, md, live, inl, storyChapters, sections, PENDING_CREDITS } from './content.ts';
import { mdToHtml } from './markdown.ts';
import { STATUS_LINE, DISAMBIGUATION } from './site.ts';
import { SLUGS, BLURBS, bySlug } from './releases.ts';
import { sortKey } from './dates.ts';
import { sortShows, where } from './shows.ts';
import { PHOTOS } from './photos.ts';
import { members } from './members.ts';
import siteFacts from '../../data/facts.json';
import sitePeople from '../../data/people.json';
import siteArtwork from '../../data/artwork.json';
import sitePress from '../../data/press.json';
import siteShows from '../../data/shows.json';
import siteVault from '../../data/vault.json';
import siteStory from '../../data/story.json';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slugFor = (releaseId?: string | null) => (releaseId ? SLUGS[releaseId] : undefined);
/** A link target for a release id: its page, or the Vault for archive items. */
export const releaseHref = (releaseId?: string | null): string | undefined => {
  if (!releaseId) return undefined;
  if (SLUGS[releaseId]) return `/music/${SLUGS[releaseId]}/`;
  if (releaseId === 'luxury-liners-2026-sound-as-ever-lp') return '/music/sound-as-ever/#lp-2026';
  if (releaseId.startsWith('ll-archive-')) return '/vault/#archive-recordings';
  if (releaseId.startsWith('ll-appearance-')) return '/music/appearances/';
  return undefined;
};

// ---------- home ----------
/** A home-page single blurb must say something particular (not filler) and carry no date: the
 *  date is printed once, next to it (the critics' notes on the lost run; tests/dist/pages.test.mjs). */
export const blurbOk = (b: string) => b.replace(/[*“”"]/g, '').trim().length > 30 && !/\b(19|20)\d\d\b|January|February|March|April|May|June|July|August|September|October|November|December/.test(b);
export function homeView() {
  const h = md('home.md');
  const d = h?.data ?? {};
  const blurb = (slug: string) => {
    const s = (d.singles ?? []).find((x: any) => slugFor(x.release_id) === slug);
    if (s?.blurb && blurbOk(s.blurb)) return inl(s.blurb);
    if (s?.blurb) console.warn(`content: home.md: the blurb for ${slug} ("${s.blurb}") is too thin or carries a date; the site's own blurb is used (BUILD-LOG, "Home blurbs")`);
    return esc(BLURBS[slug]);
  };
  // Roles come from the one members source (members.ts), the same as /people/ and the JSON-LD.
  const memberList = members().map((m) => ({ nameHtml: esc(m.name), roleHtml: esc(m.roles.join(', ')) }));
  return {
    statusLine: d.status_line ?? STATUS_LINE,
    blurb,
    membersHeading: d.members_heading ?? 'The four forever members',
    members: memberList,
    membersNoteHtml: d.members_note ? inl(d.members_note) : 'The band called David Wilstermann “Larry” because it already had a David.',
    disambiguationHtml: d.disambiguation ? inl(d.disambiguation) : esc(DISAMBIGUATION),
    bodyHtml: h?.html || null,
  };
}

// ---------- story ----------
export function storyView() {
  const s = md('story.md');
  const chapters = storyChapters();
  const photoFor = (n: number) => siteStory.chapters[n - 1]?.photo ?? null;
  if (chapters.length) {
    return { introHtml: s?.html || (s?.data.intro ? `<p>${inl(s.data.intro)}</p>` : null), fromContent: true,
      chapters: chapters.map((c) => ({ id: `chapter-${c.n}`, n: c.n, titleHtml: inl(c.title), years: c.years, photo: photoFor(c.n), html: c.html, facts: [] as string[], slot: null as string | null })) };
  }
  return { introHtml: null, fromContent: false,
    chapters: siteStory.chapters.map((c, i) => ({ id: c.id, n: i + 1, titleHtml: esc(c.title), years: c.years, photo: c.photo, html: null as string | null, facts: c.facts, slot: `story/${c.id}` })) };
}

// ---------- facts ----------
export function factsView() {
  const c = json('facts.json');
  if (c?.facts) {
    const rows = live(c.facts).filter((f: any) => f.question && f.answer);
    const dn = c.dating_note;
    return { introHtml: md('facts.md')?.html || null, datingHeading: (typeof dn === 'object' && dn?.heading) || 'How we date things', dating: (typeof dn === 'string' ? dn : dn?.text) ?? siteFacts.dating,
      rows: rows.map((f: any) => ({ q: f.question, aHtml: inl(f.answer), aText: f.answer.replace(/\*/g, ''), faq: f.faq_jsonld !== false })) };
  }
  const link = (a: string, html: boolean) => a.replace(/\{\{link:(\/[^|}]*)\|([^}]*)\}\}/g, html ? '<a href="$1">$2</a>' : '$2');
  return { introHtml: null, datingHeading: 'How we date things', dating: siteFacts.dating,
    rows: siteFacts.facts.filter((f) => f.status === 'publish').map((f) => ({ q: f.q, aHtml: link(esc(f.a), true), aText: link(f.a, false), faq: true })) };
}

// ---------- people ----------
/** Release slugs whose cover credit is still pending in data/artwork.json (single-source, not in
 *  LL-23): the build never prints a cover credit for them, whatever a copy file says. */
export const PENDING_COVER_SLUGS = [...new Set(siteArtwork.credits.filter((a) => a.status !== 'publish' && !siteArtwork.credits.some((b) => b.release === a.release && b.status === 'publish' && !(b as any).edition)).map((a) => a.release))];
const coverOk = (releaseId?: string | null) => !PENDING_COVER_SLUGS.includes(slugFor(releaseId) ?? '');
/** An early player's roles with the years after the first role only ("several shows, 2004–05;
 *  guitar on Nonetheless"), so the years never read as covering a later, separate role (LL-24). */
const earlyRoles = (roles: string[], years: string, h: (s: string) => string) =>
  roles.length > 1 && years ? `${h(roles[0])}, ${esc(years)}; ${roles.slice(1).map(h).join('; ')}` : `${roles.map(h).join(', ')}${years ? `, ${esc(years)}` : ''}`;
const foreverRows = () => members().map((m) => ({ nameHtml: esc(m.name), url: m.url, roles: m.roles.join(', '), years: m.years, lineHtml: inl(m.line) }));
export function peopleView() {
  const c = json('people.json');
  const art = siteArtwork.credits.filter((a) => a.status === 'publish');
  if (c?.forever_members) {
    return {
      introHtml: md('people.md')?.html || null,
      forever: foreverRows(),
      early: live(c.early_and_guest_players).map((p: any) => ({ nameHtml: inl(p.name), rolesHtml: earlyRoles(p.roles ?? [], p.years ?? '', inl) })),
      records: live(c.on_the_records).map((p: any) => ({ nameHtml: inl(p.name), rolesHtml: inl((p.roles ?? []).join('; ')), years: p.years ?? '' })),
      artwork: (live(c.cover_art).length ? live(c.cover_art).filter((a: any) => coverOk(a.release_id)).map((a: any) => ({ releaseHtml: inl(a.title), href: releaseHref(a.release_id) ?? '/music/', creditHtml: inl(a.credit) }))
        : art.map((a) => ({ releaseHtml: esc(bySlug(a.release).title + (a.edition ? ` (${a.edition})` : '')), href: `/music/${a.release}/`, creditHtml: esc(`${a.role}: ${a.name}`) }))),
    };
  }
  const recs = new Map<string, string[]>();
  for (const r of sitePeople.records.filter((x) => x.status === 'publish')) recs.set(r.name, [...(recs.get(r.name) ?? []), `${r.role.toLowerCase()}, <a href="/music/${r.release}/">${esc(r.work)}</a>`]);
  return {
    introHtml: null,
    forever: foreverRows(),
    early: sitePeople.early.filter((p) => p.status === 'publish').map((p) => ({ nameHtml: esc(p.name), rolesHtml: earlyRoles(p.role.split(/;\s*/), p.years, esc) })),
    records: [...recs].map(([name, rs]) => ({ nameHtml: esc(name), rolesHtml: rs.join('; '), years: '' })),
    artwork: art.map((a) => ({ releaseHtml: esc(bySlug(a.release).title + (a.edition ? ` (${a.edition})` : '')), href: `/music/${a.release}/${a.edition ? '#lp-2026' : ''}`, creditHtml: esc(`${a.role}: ${a.name}`) })),
  };
}

// ---------- press ----------
export function pressView() {
  const c = json('press.json');
  if (c?.items) {
    const items = live(c.items).filter((p: any) => !PENDING_CREDITS.includes(p.writer))
      .sort((a: any, b: any) => String(a.sort_key ?? '').localeCompare(String(b.sort_key ?? '')));
    return {
      introHtml: c.intro ? `<p class="lede">${inl(c.intro)}</p>` : null,
      placements: live(c.placements).map((p: any) => ({ html: `${inl(p.title)}${p.detail ? `. ${inl(p.detail)}` : ''}${p.date_display ? ` (${esc(p.date_display)})` : ''}` })),
      items: items.map((p: any) => ({
        when: p.date_display ?? '', datetime: p.sort_key ? String(p.sort_key).replace(/(-00)+$/, '') : undefined,
        headHtml: [inl(p.publication), p.writer ? `by ${inl(p.writer)}` : '', p.kind ? inl(p.kind) : ''].filter(Boolean).join(', '),
        aboutHtml: p.about ? inl(p.about) : '', excerptHtml: p.excerpt ? inl(p.excerpt) : '', speakerHtml: p.excerpt_speaker ? inl(p.excerpt_speaker) : '',
      })),
    };
  }
  return {
    introHtml: null,
    placements: sitePress.placements.filter((p) => p.status === 'publish').map((p) => ({ html: esc(p.text) })),
    items: sitePress.items.filter((p) => p.status === 'publish').map((p: any) => ({
      when: p.date.length === 4 ? p.date : new Date(p.date + '-15').toLocaleString('en-US', { month: 'long', year: 'numeric' }), datetime: p.date,
      headHtml: [esc(p.publication), p.headline ? `“${esc(p.headline)}”` : '', p.writer ? `by ${esc(p.writer)}` : '', esc(p.type)].filter(Boolean).join(', '),
      aboutHtml: p.text ? esc(p.text) : '', excerptHtml: p.excerpt ? esc(p.excerpt) : '', speakerHtml: p.excerptBy ? esc(p.excerptBy) : '',
    })),
  };
}

// ---------- shows ----------
const photoBySrc = (src?: string | null) => (src ? PHOTOS.find((p) => p.src === src || p.id === src)?.id : undefined);
export function showsView() {
  const c = json('shows.json');
  if (c?.shows) {
    const rows = live(c.shows).slice().sort((a: any, b: any) => sortKey(String(a.sort_key).replace(/-00/g, '')).localeCompare(sortKey(String(b.sort_key).replace(/-00/g, ''))) || String(a.id).localeCompare(String(b.id)));
    return {
      introHtml: c.intro ? inl(c.intro) : null, noteHtml: c.journal_note ? inl(c.journal_note) : null,
      rows: rows.map((s: any) => ({ when: s.date_display ?? '', datetime: String(s.sort_key ?? '').replace(/(-00)+$/, ''), whereHtml: inl(where({ venue: s.venue ?? null, city: s.place ?? null })), noteHtml: inl(s.note ?? ''), href: releaseHref(s.release_id), photo: photoBySrc(s.photo) })),
    };
  }
  return {
    introHtml: 'The shows we know about. Most of the 2001–2004 dates come from the journal the band kept on its website. The list is not complete.', noteHtml: null,
    rows: sortShows(siteShows.shows as any[]).map((s: any) => ({ when: s.when, datetime: s.date, whereHtml: esc(where(s)), noteHtml: esc(s.note ?? ''), href: s.release ? `/music/${s.release}/` : undefined, photo: s.photo })),
  };
}

// ---------- covers ----------
export function coversView() {
  const c = json('covers.json');
  if (c?.covers) return { introHtml: inl(c.intro ?? siteVault.coverSongs.intro), rows: live(c.covers).map((s: any) => ({ title: s.title, artistHtml: inl(s.original_artist), whereHtml: inl(s.where ?? '') })) };
  return { introHtml: esc(siteVault.coverSongs.intro), rows: siteVault.coverSongs.songs.filter((s) => s.status === 'publish').map((s) => ({ title: s.title, artistHtml: esc(s.artist), whereHtml: s.release ? `<a href="/music/${s.release}/">${esc(s.context)}</a>` : esc(s.context) })) };
}

// ---------- EPK ----------
export function epkView() {
  const e = md('epk.md');
  if (e) {
    const s = sections(e.body);
    const bios = (e.data.bios ?? []).map((b: any) => ({ heading: b.heading, html: s[b.heading] ?? null }));
    return { introHtml: e.data.intro ? inl(e.data.intro) : null, contactHtml: e.data.contact_line ? inl(e.data.contact_line) : null, bios: bios.length ? bios : Object.entries(s).map(([heading, html]) => ({ heading, html })) };
  }
  return { introHtml: null, contactHtml: null, bios: [
    { heading: 'Bio, 50 words', html: null, slot: 'epk/bio-50' }, { heading: 'Bio, 150 words', html: null, slot: 'epk/bio-150' }, { heading: 'Bio, 300 words', html: null, slot: 'epk/bio-300' }] };
}

export { mdToHtml };
