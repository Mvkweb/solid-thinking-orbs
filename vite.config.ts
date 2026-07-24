import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    solid(),
    dts({
      insertTypesEntry: true,
      include: ['src/ThinkingOrb.tsx', 'src/engine', 'src/presets.ts', 'src/theme.ts', 'src/types.ts', 'src/index.ts']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SolidThinkingOrbs',
      formats: ['es', 'umd'],
      fileName: 'solid-thinking-orbs'
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store'],
      output: {
        globals: {
          'solid-js': 'SolidJS'
        }
      }
    }
  }
})
