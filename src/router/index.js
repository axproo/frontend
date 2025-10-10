import { useAuthStore } from '@/stores/AuthStore'
import { useMenuStore } from '@/stores/MenuStore'
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
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/pages/auth/LogoutPage.vue'),
    meta: { auth_require: false, headline: 'Logout'}
  },
  {
    path: '/password',
    name: 'Password',
    component: () => import('@/pages/auth/PasswordPage.vue'),
    meta: { auth_require: false, headline: 'Password' },
  },
  {
    path: '/account-verify',
    name: 'Verify',
    component: () => import('@/pages/auth/EmailVerifyPage.vue'),
    meta: { auth_require: false, headline: 'Account verify'}
  },
  {
    path: '/verify/2FA',
    name: '2FA',
    component: () => import('@/pages/auth/OauthVerify.vue'),
    meta: { auth_require: false, headline: 'OTP verify'}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DynamicPage.vue'),
    meta: { auth_require: true, headline: 'Vue d\'ensemble'}
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: () => import('@/pages/ErrorPage.vue'),
    meta: { requiresAuth: false, headline: 'Page not found' },
  },
]

/**
 * Rafraichir les routes dynamiques
 */
async function refreshDynamicRoutes() {
  const menus = useMenuStore();
  // await menus.re
}

/**
 * Appel des routes dynamiques
 */
async function createDynamicRouter() {
  const auth = useAuthStore();
  const menus = useMenuStore();

  // Vérfier la session user
  await auth.init();

  // Création des routes (statiques et dynamiques)
  routerInstance = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
    routes: [...staticRoutes, ...dynamicRoutes],
  })

  // Initialisation des routes avant chargement
  routerInstance.beforeEach(async (to, from, next) => {
    const isLoggedin = auth.isAuthenticated;
    
    // Cas 1: Si l'utilisateur n'est pas connecté et que la route n'existe pas, redirigé vers le login page
    const routeExists = routerInstance.getRoutes().some(r => r.path === to.path);
    
    if (!isLoggedin) {
      // Si la route n'existe pas -> redirection vers "/login"
      if (!routeExists || to.meta.auth_require) {
        return next({path: '/login'})
      }
      return next();
    }

    // Cas 2: Si l'utilisateur est connecté et essai d'accéder à une route publique (ex: login) -> redirection vers "/dashboard"
    if (['/login', '/password'].includes(to.path)) {
      next({path: '/dashboard'});
    }

    // Cas 3: Accès autorisé, on continue la navigation
    next()
  })

  // Initialisation des routes après chargement
  routerInstance.afterEach(async (to) => {
    if (to.meta.auth_require) {
      sessionStorage.setItem('lastVisiteUrl', to.fullPath || '/')
      // await refreshDynamicRoutes();
    }
  })
  return routerInstance
}
export default createDynamicRouter
