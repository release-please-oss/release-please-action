import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: 'src',
    clearMocks: true,
    reporters: ['default', 'github-actions', ['junit', { classNameTemplate: '{filepath}' }]],
    outputFile: {
      junit: './build/junit',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json'],
      include: ['**/*.ts'],
      exclude: ['**/*.d.ts'],
      reportsDirectory: '../coverage',
    },
  },
});
