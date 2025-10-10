import axios from 'axios'
import { ref } from 'vue'

const errors = ref(null)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const errorMessages = {
  // 400: "Requête invalide",
  // 401: "Accès non autorisé. Merci de contacter l'administrateur.",
  402: 'Paiement requis',
  // 403: 'Accès interdit',
  // 404: 'Ressource non trouvée',
  405: 'Méthode non autorisée',
  406: 'Contenu non acceptable',
  408: "Délai d'attente dépassé",
  409: 'Conflit détecté',
  410: 'Ressource supprimée',
  413: 'Données envoyées trop volumineuses',
  415: 'Type de média non supporté',
  422: 'Requête non traitable (données invalides)',
  // 429: 'Trop de requêtes. Veuillez réessayer plus tard.',
  // 500: 'Erreur interne du serveur',
  501: 'Fonctionnalité non implémentée <b>(Function)</b>',
  502: 'Mauvaise passerelle',
  503: 'Service indisponible',
  504: "Délai d'attente de la passerelle expiré",
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const lang = localStorage.getItem('lang') || 'fr'
  config.headers['Accept-Language'] = lang
  return config
})

const decodeUtf8 = (str) => {
  try {
    return decodeURIComponent(escape(str))
  } catch (error) {
    return str
  }
}

const getErrorMessage = (error) => {
  if (error.code === 'ERR_NETWORK') {
    return error.message
  }

  if (!error.response) {
    return 'Erreur réseau : impossible de contacter le serveur.'
  }

  const status = error.response.status
  const data = error.response.data

  let serverMessage = data?.message || error.response.statusText

  if (typeof serverMessage === 'object' && serverMessage !== null) {
    return serverMessage
    // serverMessage = Object.values(serverMessage).join(', ')
  }

  if (typeof serverMessage === 'string') {
    serverMessage = decodeUtf8(serverMessage)
  }
  return errorMessages[status] || serverMessage || "Une erreur inconnue s'est produite"
}

export const useApi = () => {
  const isSubmitting = ref(false)
  const error = ref(null)

  const handleRequest = async (method, url, data = null, isMultipart = false) => {
    isSubmitting.value = true
    error.value = null

    try {
      const config = {
        method,
        url,
        data,
        headers: {
          ...(isMultipart
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' }),
        },
      }

      return await axiosInstance(config)
    } catch (err) {
      const message = getErrorMessage(err)
      errors.value = message
      error.value = typeof message === 'string' ? message : 'Erreur de validation'

      throw message
    } finally {
      isSubmitting.value = false
    }
  }

  const get_data = (url) => handleRequest('get', url)
  const post_data = (url, data, isMultipart = false) =>
    handleRequest('post', url, data, isMultipart)
  const put_data = (url, data, isMultipart = false) => handleRequest('put', url, data, isMultipart)
  const del_data = (url) => handleRequest('delete', url)

  return {
    get_data,
    post_data,
    put_data,
    del_data,
    isSubmitting,
    error,
  }
}