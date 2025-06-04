import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    setupFiles: [
      'dotenv/config',
      './src/test-config/mongodb-setup.ts',
      './src/test-config/dom-setup',
      './src/test-config/routes-setup.ts',
    ],
    globals: true,
    /**
     * Set this to one only so that MongoDB memory server can run properly
     * see: https://github.com/shelfio/jest-mongodb/issues/366
     */
    maxWorkers: process.env.CI === 'true' ? 1 : undefined,
    minWorkers: process.env.CI === 'true' ? 1 : undefined,
  },
})
