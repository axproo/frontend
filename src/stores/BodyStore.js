import i18n from '@/i18n'
import { defineStore } from 'pinia'

export const useBodyStore = defineStore('body', {
  state: () => ({
    classes: '',
    dataAttributes: {},
    metaTitle: i18n.global.t('loader'),
    metaDescription: '',
    metaAuthor: '',
  }),

  actions: {
    applyBody() {
      // Gestion du title
      document.title = this.metaTitle || 'Introuvable'

      // Gestion des metas
      this.updateOrCreateMeta('description', this.metaDescription)
      this.updateOrCreateMeta('author', this.metaAuthor)

      // Gestion des classes
      document.body.className = ''
      const classList = this.classes
        .split(' ')
        .map((c) => c.trim())
        .filter(Boolean)

      if (classList.length > 0) {
        document.body.classList.add(...classList)
      }

      // Gestion des Attributs
      Array.from(document.body.attributes).forEach((attr) => {
        if (attr.name.startsWith('data-')) {
          document.body.removeAttribute(attr.name)
        }
      })
      Object.entries(this.dataAttributes).forEach(([key, value]) => {
        document.body.setAttribute(`data-${key}`, value)
      })
    },

    // Chargement des meta body
    setBody({ classes = '', title, description, author, attributes = {} }) {
      
      this.classes = classes.trim().replace(/\s+g/g, ' ')
      if (title !== undefined) this.metaTitle = title
      if (description !== undefined) this.metaDescription = description
      if (author !== undefined) this.metaAuthor = author
      this.dataAttributes = attributes

      this.applyBody()
    },

    // Ajout ou modification des metas
    updateOrCreateMeta(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`)

        if (!meta) {
            meta = document.createElement('meta')
            meta.setAttribute('name', name)
            document.head.appendChild(meta)
        }
        meta.setAttribute('content', content || '')
    }
  },
})
