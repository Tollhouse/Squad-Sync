import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ['**/coverage/**'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/',
                'test/',
                '*.config.js',
                './src/main.jsx',
                './src/App.jsx',
                './src/Components/Crews/HandleDelete.jsx',
                './src/Components/Crews/HandleEdit.jsx',
                './src/Components/Crews/RotationAction.jsx',
              ],
      reportsDirectory: './coverage'
    },
  },
  plugins: [react()],

})
