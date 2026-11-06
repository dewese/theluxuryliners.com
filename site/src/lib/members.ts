// The four forever members (LL-9): ONE source for their roles and years on every surface that
// names them (home, /people/, the MusicGroup JSON-LD, llms.txt), so the three never drift apart.
// The copy track's content/people.json wins when it exists; site/data/people.json is the fallback
// and always supplies the JSON-LD ids. LL-9: all four are the band today, so years never end.
import sitePeople from '../../data/people.json';
import { json, live } from './content.ts';

export interface Member { id: string; name: string; plainName: string; jsonldId: string; url: string | null; startDate: string; founder: boolean; roles: string[]; years: string; line: string }

const base = sitePeople.forever.filter((p) => p.status === 'publish');
const norm = (s: string) => s.replace(/[“”"]/g, '').toLowerCase();

export function members(): Member[] {
  const c = json('people.json');
  const rows = c?.forever_members ? live(c.forever_members) : null;
  return base.map((p: any) => {
    const r = rows?.find((x: any) => norm(x.name) === norm(p.name));
    const roles: string[] = r?.roles ?? p.role.replace(/^Co-founder; /, 'co-founder, ').split(/,\s*/).map((s: string) => s.trim());
    return {
      id: p.id, name: p.name, plainName: p.plainName ?? p.name, jsonldId: p.jsonldId, url: r?.link ?? p.url ?? null, startDate: p.startDate,
      founder: roles.some((x) => /^co-?founder$/i.test(x)),
      roles: roles.map((x) => x.toLowerCase() === 'co-founder' ? 'co-founder' : x),
      years: r?.years ?? p.years,
      line: r?.line ?? p.note ?? '',
    };
  });
}

/** Band roles without the founding role (founding is its own fact: JSON-LD 'founder'). */
export const bandRoles = (m: Member) => m.roles.filter((x) => !/^co-?founder$/i.test(x));
/** Years in words for plain text ("1998–" -> "1998 to today"). */
export const yearsInWords = (y: string) => y.replace(/–$/, ' to today');
