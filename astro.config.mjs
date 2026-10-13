// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gallery.stanlincat.com',
  base: process.env.PAGES_BASE || '',
  integrations: [sitemap()],
  prefetch: { defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()] },
  // Authorizing remote images https://images.unsplash.com/
  image: { remotePatterns: [{ protocol: 'https' }] },
});
