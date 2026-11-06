// Routing helpers for the Worker (pure; tested in tests/unit/worker.test.mjs).
import { GONE, QUERY_REDIRECTS } from './gone.ts';

export const STAGING_ROBOTS = 'User-agent: *\nDisallow: /\n';
const goneSet = new Set(GONE);

/** True when the request is not for the production hostname (staging, previews). */
export const isStagingHost = (hostname: string, env: { SITE_HOSTNAME?: string }): boolean =>
  !!env.SITE_HOSTNAME && hostname !== env.SITE_HOSTNAME && hostname !== `www.${env.SITE_HOSTNAME}`;

/** An old file of the band's earlier websites: answered 410 Gone. */
export const isGone = (path: string): boolean => goneSet.has(path) || goneSet.has(decodeURIComponent(path));

/** The 2007–09 site's query-string addresses (/?content=bio, /index.php?&content=mailinglist, …). */
export function queryRedirect(url: URL): string | null {
  if (url.pathname !== '/' && url.pathname !== '/index.php' && url.pathname !== '/index.html') return null;
  const q = url.searchParams;
  const content = q.get('content');
  if (content && QUERY_REDIRECTS[`content=${content}`]) return QUERY_REDIRECTS[`content=${content}`];
  if (q.has('em1884') && QUERY_REDIRECTS.em1884) return QUERY_REDIRECTS.em1884;
  if (q.has('em1886') && QUERY_REDIRECTS.em1886) return QUERY_REDIRECTS.em1886;
  return null;
}
