import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import createDynamicRouter from './router'
import i18n from './i18n'

async function initializeApp() {
  const app = createApp(App)

  app.config.errorHandler = (err, vm, info) => {
    console.error('Erreur capturée globalement:', err)
    console.log('Composant:', vm)
    console.log('Information: ', info)
  }

  app.use(createPinia())

  const router = await createDynamicRouter()
  app.use(router)
  app.use(i18n)
  app.provide('app_name', import.meta.env.VITE_APP_NAME)

  app.mount('#app')
}
initializeApp()
