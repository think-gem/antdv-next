import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'tsdown'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue(),
  ],
  dts: true,
  format: 'esm',
  unbundle: true,
  clean: true,
  skipNodeModulesBundle: true,
  external: [
    'vue',
    'antdv-next',
  ],
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
})
