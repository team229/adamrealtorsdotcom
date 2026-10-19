// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://adamtherealtor.com',
  integrations: [react()],
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
