import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    fr,
    en
  }
})

export default i18n
