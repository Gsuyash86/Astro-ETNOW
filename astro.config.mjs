import { defineConfig } from 'astro/config';
// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [],
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