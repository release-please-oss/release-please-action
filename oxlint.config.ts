import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import jest from 'ultracite/oxlint/jest';
import vitest from 'ultracite/oxlint/vitest';

export default defineConfig({
  extends: [
    core,
    // vitest,
    jest,
  ],
  ignorePatterns: ['dist/**/*', 'coverage/**/*', 'build/**/*'],
});
