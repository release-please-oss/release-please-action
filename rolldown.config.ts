import { defineConfig } from 'rolldown';
import { replacePlugin } from 'rolldown/plugins';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    cleanDir: false,
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  platform: 'node',
  plugins: [
    // Hack to handle conventional-changelog-writer reading files at runtime
    // Can be resolved by updating to v8.4.0 or higher in release-please itself
    replacePlugin(
      {
        "join(__dirname, 'templates/commit.hbs')": "join(path$2.dirname(fileURLToPath(import.meta.url)), 'commit.hbs')",
        "join(__dirname, 'templates/footer.hbs')": "join(path$2.dirname(fileURLToPath(import.meta.url)), 'footer.hbs')",
        "join(__dirname, 'templates/header.hbs')": "join(path$2.dirname(fileURLToPath(import.meta.url)), 'header.hbs')",
        "join(__dirname, 'templates/template.hbs')": "join(path$2.dirname(fileURLToPath(import.meta.url)), 'template.hbs')",
        //
        'resolve(__dirname, "./templates/commit.hbs")': "resolve(path$2.dirname(fileURLToPath(import.meta.url)), 'commit1.hbs')",
        'resolve(__dirname, "./templates/footer.hbs")': "resolve(path$2.dirname(fileURLToPath(import.meta.url)), 'footer1.hbs')",
        'resolve(__dirname, "./templates/header.hbs")': "resolve(path$2.dirname(fileURLToPath(import.meta.url)), 'header1.hbs')",
        'resolve(__dirname, "./templates/template.hbs")': "resolve(path$2.dirname(fileURLToPath(import.meta.url)), 'template1.hbs')",
      },
      {
        delimiters: ['', ''],
      },
    ),
  ],
  tsconfig: './tsconfig.app.json',
});
