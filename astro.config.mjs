import { defineConfig } from "astro/config";
import node from "@astrojs/node";

const isProd = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
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
      modules: {
        generateScopedName: isProd
          ? "[hash:base64:6]"
          : "[name]__[local]___[hash:base64:6]",
      },
      preprocessorOptions: {
        scss: {
          outputStyle: "compressed",
          additionalData: `@use "src/styles/_mixins-new.scss" as *;`,
        },
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
});
