import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  define: { 'process_env': {}},
  plugins: [
    vue(),
    vueDevTools({enabled: process.env.NODE_ENV === 'development'}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: 'index.html',
        login: 'src/pages/auth/LoginPage.vue',
        password: 'src/pages/auth/PasswordPage.vue',
        token: 'src/pages/auth/verifyTokenPage.vue',
        email: 'src/pages/auth/EmailVerifyPage.vue',
        otp: 'src/pages/auth/OauthVerify.vue',
        erreur: 'src/pages/ErrorPage.vue',
        logout: 'src/pages/auth/LogoutPage.vue',
      },
      output: {
        entryFileNames: `assets/pages/[name].js`,
        chunkFileNames: 'assets/chunks/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
    esbuild: {
      external: ['toastr'],
    },
  },
  optimizeDeps: {
    include: ['quill'],
  },
})
