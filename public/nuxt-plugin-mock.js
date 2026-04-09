// defineNuxtPlugin을 흉내냅니다.
export function defineNuxtPlugin(fn) {
  const nuxtApp = useNuxtApp()
  fn(nuxtApp)
}

// Nuxt의 주입 시스템을 흉내냅니다.
if (!window.__mock_nuxtApp) {
  window.__mock_nuxtApp = {
    provides: {},
    provide(key, value) {
      this.provides[key] = value
    },
    get(key) {
      return this.provides[key]
    }
  }
}

export function useNuxtApp() {
  return window.__mock_nuxtApp
}
