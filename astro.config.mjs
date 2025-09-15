import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import react from "@astrojs/react";

const isProd = process.env.NODE_ENV === "production";

let config = {
  output: 'server',
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react(),
  ],
  server: {
    port: 3000,
  },
  vite: {
    resolve: {
      alias: {
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@lib": "/src/lib",
        "@utils": ["src/utils"],
        "@constant": ["src/constant"],
        "@styles": ["src/styles"],
      },
    },
    build: {
      minify: isProd ? "esbuild" : false,
      target: "es2017",
      cssCodeSplit: true,
    },
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
    },
  },
}
if(isProd) {
  config.vite.css = {
    modules: {
      generateScopedName: "[hash:base64:6]",
    },
    preprocessorOptions: {
      scss: {
        outputStyle: 'compressed',
      },
    },
  }
}

export default defineConfig(config);