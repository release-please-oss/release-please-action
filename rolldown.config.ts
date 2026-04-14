import { defineConfig } from 'rolldown';
import { replacePlugin } from 'rolldown/plugins';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    // Shim globals in esm bundle
    banner: `
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const getFilename = () => fileURLToPath(import.meta.url)
const getDirname = () => path.dirname(getFilename())

export const __dirname = /* @__PURE__ */ getDirname()
export const __filename = /* @__PURE__ */ getFilename()
    `,
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
        "join(__dirname, 'templates/commit.hbs')": "join(__dirname, 'commit.hbs')",
        "join(__dirname, 'templates/footer.hbs')": "join(__dirname, 'footer.hbs')",
        "join(__dirname, 'templates/header.hbs')": "join(__dirname, 'header.hbs')",
        "join(__dirname, 'templates/template.hbs')": "join(__dirname, 'template.hbs')",
        //
        'resolve(__dirname, "./templates/commit.hbs")': "resolve(__dirname, 'commit1.hbs')",
        'resolve(__dirname, "./templates/footer.hbs")': "resolve(__dirname, 'footer1.hbs')",
        'resolve(__dirname, "./templates/header.hbs")': "resolve(__dirname, 'header1.hbs')",
        'resolve(__dirname, "./templates/template.hbs")': "resolve(__dirname, 'template1.hbs')",
      },
      {
        delimiters: ['', ''],
      },
    ),
  ],
  tsconfig: './tsconfig.app.json',
});
