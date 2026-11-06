// /llms.txt (plan §8.6; LL-41): the canonical facts in plain text for AI answer engines.
import type { APIRoute } from 'astro';
import { SITE, ONE_LINER, NEVER_BROKE_UP, DISAMBIGUATION, SAME_AS, SPREAD } from '../lib/site.ts';
import { RELEASES } from '../lib/releases.ts';
import { members, yearsInWords } from '../lib/members.ts';
import press from '../../data/press.json';

export const GET: APIRoute = () => {
  const forever = members();
  const lines = [
    '# The Luxury Liners',
    '',
    `> ${ONE_LINER}`,
    '',
    `${NEVER_BROKE_UP} The band was founded in Texas in 1997 and moved to Nashville in May 1997. ${SPREAD}`,
    '',
    '## Members (the four forever members)',
    ...forever.map((p) => `- ${p.name} (${yearsInWords(p.years)}): ${p.roles.join(', ')}.${p.line ? ` ${p.line.replace(/\*/g, '')}` : ''}`),
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
    `- [Facts](${SITE}/facts/): short answers about the band`,
    `- [Story](${SITE}/story/): the band's history, 1997 to today`,
    `- [People](${SITE}/people/): members, players and credits`,
    `- [Music](${SITE}/music/): every release`,
    `- [Press](${SITE}/press/)`,
    `- [Shows](${SITE}/shows/)`,
    `- [Press kit](${SITE}/epk/)`,
    '',
    '## Elsewhere',
    ...SAME_AS.map((u) => `- ${u}`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
