import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/vue_dashboard',
  define: { 'process_env': {}},
  plugins: [
    vue(),
    vueDevTools({enabled: process.env.NODE_ENV === 'development'}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
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
