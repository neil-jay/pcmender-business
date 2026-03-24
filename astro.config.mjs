import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [react({ fastRefresh: false })],
  site: 'https://example.com',
  vite: {
    server: {
      hmr: false
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@styles': '/src/styles',
        '@data': '/src/data'
      }
    }
  },
  build: {
    inlineStylesheets: 'never'
  },
  server: {
    port: 4322
  }
})
