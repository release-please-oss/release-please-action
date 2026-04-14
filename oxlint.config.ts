import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
  },
  ignorePatterns: ['dist/**/*', 'coverage/**/*', 'build/**/*'],
  plugins: ['import', 'typescript', 'oxc', 'import', 'node', 'promise', 'jest', 'unicorn'],
});
