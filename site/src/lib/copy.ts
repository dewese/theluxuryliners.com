// Copy slots. Long-form copy (Story narratives, bios, the Vault intro) is written by the copy
// track in /content/ at the repository root. When a slot's file exists it is used; when it does
// not, the page shows a PLACEHOLDER block, which `RELEASE=1 node scripts/check-dist.mjs` refuses.
// Slot names and their files are listed in docs/HANDBOOK.md ("Editing copy") and BUILD-LOG.md.
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mdToHtml } from './markdown.ts';

const here = dirname(fileURLToPath(import.meta.url));
// site/src/lib -> repository root; in a built chunk the path differs, so fall back to cwd (site/)
export const CONTENT_DIR = [join(here, '..', '..', '..', 'content'), join(process.cwd(), '..', 'content')].find((p) => existsSync(p)) ?? join(process.cwd(), '..', 'content');

/** The HTML for a copy slot (e.g. "story/01-two-texans"), or null if the copy track has not written it. */
export function copy(slot: string): string | null {
  for (const ext of ['.md', '.markdown', '.txt']) {
    const f = join(CONTENT_DIR, slot + ext);
    if (existsSync(f)) {
      const raw = readFileSync(f, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
      return mdToHtml(raw);
    }
  }
  return null;
}

export const SLOTS = [
  'home/intro',
  'story/intro',
  'story/01-two-texans', 'story/02-powder-blue-suits', 'story/03-sound-as-ever', 'story/04-believe',
  'story/05-journal-years', 'story/06-overbored', 'story/07-nonetheless', 'story/08-quiet-years', 'story/09-great-day',
  'epk/bio-50', 'epk/bio-150', 'epk/bio-300',
  'vault/intro',
] as const;
