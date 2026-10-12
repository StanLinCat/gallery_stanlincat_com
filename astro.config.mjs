// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gallery.stanlincat.com',
  base: process.env.PAGES_BASE || '',
  prefetch: { defaultStrategy: 'viewport' },
  vite: { plugins: [tailwindcss()] },
  // Authorizing remote images https://images.unsplash.com/
  image: { remotePatterns: [{ protocol: 'https' }] },
});
