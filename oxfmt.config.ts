import { defineConfig } from 'oxfmt';

export default defineConfig({
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  ignorePatterns: ['dist/**/*', 'coverage/**/*', 'build/**/*'],
  jsxSingleQuote: false,
  printWidth: 120,
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  sortImports: {
    ignoreCase: true,
    newlinesBetween: true,
    order: 'asc',
  },
  sortPackageJson: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
});
