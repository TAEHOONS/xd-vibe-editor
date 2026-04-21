import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: false },

  build: {
    transpile: ["vuetify", "@vue/repl"],
  },

  modules: [
    "nuxt-monaco-editor",
    "@pinia/nuxt",
  ],

  routeRules: {
    '/api/**': { proxy: 'http://localhost:8000/api/**' },
  },

  vite: {
    server: {
      allowedHosts: ['sliver-mongoose-issuing.ngrok-free.dev'],
    },
    ssr: {
      noExternal: ["vuetify"],
    },
    plugins: [
      vuetify({ autoImport: true }),
    ],
    optimizeDeps: {
      include: ["@vue/repl", "shiki"],
    },
    vue: {
      template: { transformAssetUrls },
    },
    worker: {
      format: "es",
    },
  },

  compatibilityDate: "2025-07-15",
});
