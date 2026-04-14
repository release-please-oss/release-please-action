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
        "join(__dirname, 'templates/commit.hbs')": "'./commit.hbs'",
        "join(__dirname, 'templates/footer.hbs')": "'./footer.hbs'",
        "join(__dirname, 'templates/header.hbs')": "'./header.hbs'",
        "join(__dirname, 'templates/template.hbs')": "'./template.hbs'",
        //
        'resolve(__dirname, "./templates/commit.hbs")': "'./commit1.hbs'",
        'resolve(__dirname, "./templates/footer.hbs")': "'./footer1.hbs'",
        'resolve(__dirname, "./templates/header.hbs")': "'./header1.hbs'",
        'resolve(__dirname, "./templates/template.hbs")': "'./template1.hbs'",
      },
      {
        delimiters: ['', ''],
      },
    ),
  ],
  tsconfig: './tsconfig.app.json',
});
