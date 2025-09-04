import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: vercel(),
  async rewrites() {
    return {
      source: '/:category/(.*)-article-:id',
      destination: '/articleShow',
    },
    {
      source: '/favicon.ico',
      destination: '/favicon.svg'
    };
  }
});