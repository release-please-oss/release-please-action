import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    cleanDir: true,
    dir: 'dist',
    sourcemap: true,
  },
  platform: 'node',
  tsconfig: './tsconfig.app.json',
});
