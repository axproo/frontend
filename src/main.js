import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/custom.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

async function initializeApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
}
initializeApp()
