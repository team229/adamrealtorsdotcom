// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.adamtherealtor.com',
  trailingSlash: 'always',
  redirects: {
    '/buy': '/buyers/',
    '/sell': '/sellers/',
    '/mortgage/calculator': '/mortgage/#calculator',
    '/mortgage/affordability': '/mortgage/#affordability',
    '/mortgage/closing-costs': '/mortgage/#closing-costs',
  },
  build: { format: 'directory' },
  integrations: [react()],
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
