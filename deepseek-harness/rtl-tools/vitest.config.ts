import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { standardDecoratorPlugin, vitestExecArgv } from '../vitest.shared.ts'

export default defineConfig({
  plugins: [standardDecoratorPlugin(), tsconfigPaths({ projects: ['./tsconfig.base.json'] })],
  test: { include: ['rtl-tools/tests/**/*.spec.ts'], execArgv: vitestExecArgv, testTimeout: 30_000 },
})
