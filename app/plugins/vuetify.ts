import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: { defaultTheme: 'dark' },
  })
  app.vueApp.use(vuetify)
})
