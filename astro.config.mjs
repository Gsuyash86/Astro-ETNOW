import { defineConfig } from "astro/config";
import node from "@astrojs/node";
// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone", // or "middleware"
  }),
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
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "src/styles/_mixins-new.scss" as *;`,
        },
      },
    },
  },
});
