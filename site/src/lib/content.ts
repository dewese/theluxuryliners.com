// Import layer for the copy track's files in /content/ at the repository root (content/*.md with
// YAML front matter, content/*.json, content/story/NN-*.md). When a file exists, the pages use
// it; when it does not, they fall back to site/data/*.json and to PLACEHOLDER blocks. Only the
// public fields are read: never 'source', 'confidence', 'contested', 'notes_internal', 'held',
// or any record with "publish": false (content/_about notes in each file list them).
// The owner gates that belong to the build (photo credits that are still pending, LL-13 links)
// are applied here as well, so the site cannot print them whatever a copy file says.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { CONTENT_DIR } from './copy.ts';
import { mdToHtml, mdInline } from './markdown.ts';

export const hasContent = existsSync(CONTENT_DIR);

export function json<T = any>(name: string): T | null {
  const f = join(CONTENT_DIR, name);
  if (!existsSync(f)) return null;
  try { return JSON.parse(readFileSync(f, 'utf8')) as T; } catch (e) { throw new Error(`content/${name}: not valid JSON (${(e as Error).message})`); }
}

export interface MdFile { data: Record<string, any>; body: string; html: string }
export function md(name: string): MdFile | null {
  const f = join(CONTENT_DIR, name);
  if (!existsSync(f)) return null;
  const raw = readFileSync(f, 'utf8').replace(/\r\n?/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  const data = m ? frontMatter(m[1], name) : {};
  const body = (m ? m[2] : raw).trim();
  return { data, body, html: mdToHtml(body) };
}

/** Internal front-matter blocks that pages never read; dropped before a second parse attempt. */
const INTERNAL_BLOCKS = ['sources', 'notes_internal', 'contested', 'held'];
/** Parse YAML front matter. The copy track's files are hand-written and change while this site is
 *  built; a file whose internal blocks ('sources', 'notes_internal') are not valid YAML still gives
 *  its public keys (the internal blocks are removed and the rest is parsed again; failing that,
 *  only the top-level 'key: value' lines are read). A warning names the file. */
export function frontMatter(yaml: string, name = 'front matter'): Record<string, any> {
  try { return parseYaml(yaml) ?? {}; } catch {}
  const lines = yaml.split('\n');
  const kept: string[] = [];
  let skipping = false;
  for (const l of lines) {
    const top = /^([A-Za-z_][\w-]*):/.exec(l);
    if (top) skipping = INTERNAL_BLOCKS.includes(top[1]);
    if (!skipping) kept.push(l);
  }
  try { const d = parseYaml(kept.join('\n')) ?? {}; console.warn(`content: ${name}: front matter is not valid YAML in its internal blocks; public keys read`); return d; } catch {}
  const d: Record<string, any> = {};
  for (const l of lines) { const m = /^([A-Za-z_][\w-]*):\s+(.+)$/.exec(l); if (m) d[m[1]] = m[2].replace(/^"(.*)"$/, '$1'); }
  console.warn(`content: ${name}: front matter is not valid YAML; only top-level values read`);
  return d;
}

/** Records that are public: not explicitly unpublished. */
export const live = <T extends Record<string, any>>(xs: T[] | undefined | null): T[] => (xs ?? []).filter((x) => x && x.publish !== false);

/** Inline Markdown (*italics*) to HTML, for short strings from JSON or front matter. */
export const inl = (s: string | null | undefined) => (s ? mdInline(s) : '');

/** The Story chapters from content/story/NN-*.md, in chapter order. */
export function storyChapters(): { n: number; slug: string; title: string; years: string; summary?: string; description?: string; html: string }[] {
  const dir = join(CONTENT_DIR, 'story');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort().map((f) => {
    const c = md(join('story', f))!;
    return { n: Number(c.data.chapter ?? f.slice(0, 2)), slug: String(c.data.slug ?? f.replace(/^\d{2}-|\.md$/g, '')), title: String(c.data.title ?? ''), years: String(c.data.years ?? ''), summary: c.data.summary, description: c.data.description, html: c.html };
  }).filter((c) => c.title && c.html);
}

/** "## Heading" sections of a Markdown body, as { heading -> html }. */
export function sections(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of body.split(/^## /m).slice(1)) {
    const [head, ...rest] = part.split('\n');
    out[head.trim()] = mdToHtml(rest.join('\n'));
  }
  return out;
}

/** Photographers whose credits are not yet confirmed: never printed, whatever a file says.
 *  Empty since 2026-11-06: LL-45 cleared Amy Wilstermann's credit for the 2003 photos. */
export const PENDING_CREDITS: string[] = [];
