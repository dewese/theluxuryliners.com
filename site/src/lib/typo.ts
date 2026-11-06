// Typography: curly quotes and apostrophes everywhere in the site's own text (critiques
// build-skeleton round 2, item 4), with ONE exception: the LL-6 one-liner is printed byte for
// byte as the owner approved it, straight quotes included ('Luxury Liner'), wherever it appears.
import { ONE_LINER } from './site.ts';

function curl(s: string): string {
  return s
    .replace(/(^|[\s(\[—–-])"(?=\S)/g, '$1“') // opening double quote
    .replace(/"/g, '”') // any other double quote closes
    .replace(/(^|[\s(\[—–-])'(?=\d\d\b)/g, '$1’') // ’97
    .replace(/(^|[\s(\[“—–-])'(?=\S)/g, '$1‘') // opening single quote
    .replace(/'/g, '’'); // apostrophes and closing single quotes
}

/** Curly quotes, leaving the LL-6 one-liner exactly as approved. Safe on HTML that has no quotes
 *  in its markup (use it on text before it is escaped or wrapped in tags). */
export const smart = (s: string | null | undefined): string => (s ? s.split(ONE_LINER).map(curl).join(ONE_LINER) : '');
