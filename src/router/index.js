import { createRouter, createWebHistory } from 'vue-router'

let routerInstance = null
let dynamicRoutes = []

/**
 * Création des routes statiques
 */
const staticRoutes = [
  {
    path: '/',
    redirect: (to) => {
        return '/login'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { auth_require: false, headline: 'Login' },
  }
]

/**
 * Appel des routes dynamiques
 */
async function createDynamicRouter() {
  // Création des routes (statiques et dynamiques)
  routerInstance = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
    routes: [...staticRoutes, ...dynamicRoutes],
  })

  // Initialisation des routes avant chargement
  routerInstance.beforeEach(async (to, from, next) => {
    next()
  })

  // Initialisation des routes après chargement
  routerInstance.afterEach(async (to) => {})
  return routerInstance
}
export default createDynamicRouter
