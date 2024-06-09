import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import AutoImportComponents from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    AutoImport({
      // dirs: ['src/autoImports'],
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true
      },
      dts: 'src/auto-imports.d.ts'
    }),
    AutoImportComponents({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts'
    }),
    eslint()
  ],
  assetsInclude: ['**/*.svg'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      $: path.resolve(__dirname, './src/assets/icon')
    }
  }
})
