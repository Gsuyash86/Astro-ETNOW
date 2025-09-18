import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";

const isProd = process.env.NODE_ENV === "production";

// AMP integration - processing handled in middleware
function ampIntegration() {
  return {
    name: "amp-integration", 
    hooks: {
      "astro:config:setup": () => {
        console.log("🚀 AMP processing enabled via middleware");
      }
    }
  };
}

let config = {
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react(),
    ampIntegration()
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
        "@utils": "/src/utils",
        "@constant": "/src/constant",
        "@styles": "/src/styles",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // outputStyle: "compressed", 
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
};

if(isProd){
    config.css= {
      modules: {
        generateScopedName: "[hash:base64:6]",
      },
    }
}

export default defineConfig(config);