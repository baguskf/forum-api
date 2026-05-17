import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fileParallelism: false,
    globals: true,
    threads: false,
    singleThread: true,
    setupFiles: ['dotenv/config'],
  },
});