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

  vite: {
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
