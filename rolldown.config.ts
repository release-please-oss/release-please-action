import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    cleanDir: true,
    dir: 'dist',
  },
  platform: 'node',
  tsconfig: './tsconfig.app.json',
});
