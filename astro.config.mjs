import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone", // or "middleware"
  }),
  server: {
    port: 3000,
  },
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