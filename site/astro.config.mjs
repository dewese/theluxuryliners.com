// @ts-check
// Static output, apex canonical host, lowercase paths with a trailing slash, one folder per page
// (the daviddewese.com setup). The master release data lives at ../data/releases.json.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://theluxuryliners.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  prefetch: false,
  vite: {
    server: { fs: { allow: ['..'] } },
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    sitemap({
      // never list the error pages or the thank-you page
      filter: (page) => !/\/(404|410)\/?$|\/contact\/sent\/$/.test(new URL(page).pathname),
    }),
  ],
});
