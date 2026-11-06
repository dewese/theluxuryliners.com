// A deliberately small Markdown subset for the copy files: paragraphs, ## and ### headings,
// - lists, > quotations (rendered as <blockquote>), *em*, **strong** and [links](/path/).
// Anything else is shown as text. Raw HTML is escaped. Quotes and apostrophes are curled (typo.ts),
// except inside the LL-6 one-liner.
import { smart } from './typo.ts';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function mdInline(s: string): string { return inline(s); }

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LINK = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]*)\)/g;

function inline(s: string): string {
  // Link targets are taken out before smart() and escaping (security audit round 3, S2): smart()
  // curls quotes in the link text only, and the raw target is attribute-escaped. The brackets
  // stay in place so smart() sees the same context as before; U+E001 n U+E002 marks target n.
  const targets: string[] = [];
  const marked = s.replace(LINK, (_m, text: string, href: string) => `[${text}]\uE001${targets.push(href) - 1}\uE002`);
  return esc(smart(marked))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\uE001(\d+)\uE002/g, (_m, text: string, i: string) => `<a href="${attr(targets[Number(i)])}">${text}</a>`);
}

export function mdToHtml(md: string): string {
  const out: string[] = [];
  for (const block of md.replace(/\r\n?/g, '\n').trim().split(/\n{2,}/)) {
    const b = block.trim();
    if (!b) continue;
    const h = /^(#{2,3})\s+(.*)$/.exec(b);
    if (h) { out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); continue; }
    if (/^[-*]\s/.test(b)) { out.push(`<ul>${b.split('\n').map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`); continue; }
    if (/^>\s?/.test(b)) { out.push(`<blockquote><p>${inline(b.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' '))}</p></blockquote>`); continue; }
    if (/^#\s/.test(b)) continue; // a top-level title in the file is the page's own <h1>
    out.push(`<p>${inline(b.replace(/\n/g, ' '))}</p>`);
  }
  return out.join('\n');
}
