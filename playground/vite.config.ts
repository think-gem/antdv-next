import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^antdv-next/,
        replacement: path.resolve(baseUrl, '../packages/antdv-next/src'),
      },
      {
        find: /^@antdv-next\/cssinjs/,
        replacement: path.resolve(baseUrl, '../packages/cssinjs/src'),
      },
      {
        find: '@',
        replacement: '/src',
      },
    ],
  },
  server: {
    port: 5779,
  },
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: true,
    }),
    vueJsx(),
    vue(),
    inspect(),
  ],
})
