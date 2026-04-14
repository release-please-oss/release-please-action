import { defineConfig } from 'rolldown';
import { esmExternalRequirePlugin } from 'rolldown/plugins';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    cleanDir: true,
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  platform: 'node',
  plugins: [
    esmExternalRequirePlugin({
      external: ['conventional-changelog-writer'],
    }),
  ],
  tsconfig: './tsconfig.app.json',
});
