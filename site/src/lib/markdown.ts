// A deliberately small Markdown subset for the copy files: paragraphs, ## and ### headings,
// - lists, > quotations (rendered as <blockquote>), *em*, **strong** and [links](/path/).
// Anything else is shown as text. Raw HTML is escaped.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]*)\)/g, '<a href="$2">$1</a>');
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
