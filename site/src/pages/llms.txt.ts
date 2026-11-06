// /llms.txt (plan §8.6; LL-41): the canonical facts in plain text for AI answer engines.
import type { APIRoute } from 'astro';
import { SITE, ONE_LINER, NEVER_BROKE_UP, DISAMBIGUATION, SAME_AS, SPREAD } from '../lib/site.ts';
import { RELEASES } from '../lib/releases.ts';
import { members, yearsInWords, rolesSentence } from '../lib/members.ts';
import press from '../../data/press.json';
import { storyView, factsView } from '../lib/views.ts';
import { smart } from '../lib/typo.ts';

export const GET: APIRoute = () => {
  const forever = members();
  const chapters = storyView().chapters;
  const facts = factsView().rows;
  const plain = (t: string) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  const lines = [
    '# The Luxury Liners',
    '',
    `> ${ONE_LINER}`,
    '',
    `Last updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    `${NEVER_BROKE_UP} The band was founded in Texas in 1997 and moved to Nashville in May 1997. ${SPREAD}`,
    '',
    '## Members (the four forever members)',
    ...forever.map((p) => `- ${p.name} (${yearsInWords(p.years)}): ${rolesSentence(p)}.${p.line ? ` ${p.line.replace(/\*/g, '')}` : ''}`),
    '',
    '## Releases',
    ...RELEASES.slice().reverse().map((r) => `- [${r.title}](${SITE}/music/${r.slug}/): ${r.kind}, ${r.dateLabel}, ${r.label}`),
    `- Sound As Ever on vinyl (2026): ${SITE}/music/sound-as-ever/#lp-2026`,
    '',
    '## On TV',
    ...press.placements.filter((p) => p.status === 'publish').map((p) => `- ${p.text}`),
    '',
    '## Not to be confused with',
    DISAMBIGUATION,
    '',
    '## Pages',
    `- [Facts](${SITE}/facts/): short answers about the band (each question has its own link, e.g. ${SITE}/facts/#founders)`,
    `- [Story](${SITE}/story/): the band's history, 1997 to today, in ${chapters.length} chapters`,
    `- [People](${SITE}/people/): members, early and guest players, the people on the records, cover art and photographers`,
    `- [Music](${SITE}/music/): every release, with tracklists, writers and where to listen`,
    `- [Compilations](${SITE}/music/appearances/): compilations and promo discs with Luxury Liners songs`,
    `- [Listen](${SITE}/listen/): where to stream or buy the music`,
    `- [Press](${SITE}/press/): reviews, features and TV placements, in date order`,
    `- [Shows](${SITE}/shows/): dated shows, 1997 to 2008`,
    `- [Photos](${SITE}/photos/): band-era photos by era, with captions and credits`,
    `- [Vault](${SITE}/vault/): the old free MP3 list, cover songs and the old websites, as history`,
    `- [Press kit](${SITE}/epk/): bios, photos and logos for press`,
    `- [Contact](${SITE}/contact/): booking, press, licensing and fan mail (a form; no address is published)`,
    '',
    '## The story, chapter by chapter',
    ...chapters.map((c) => `- [${plain(c.titleText)} (${c.years})](${SITE}${c.href})${c.description ? `: ${plain(c.description)}` : ''}`),
    '',
    '## Facts',
    ...facts.flatMap((f) => [`### ${plain(smart(f.q))}`, plain(f.aText), '']),
    '## Elsewhere',
    ...SAME_AS.map((u) => `- ${u}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
