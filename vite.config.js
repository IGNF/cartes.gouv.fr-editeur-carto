import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'dev' ? '/' : '/editeur-carto/',

  build: {
    outDir: './docs',
    emptyOutDir: true, // also necessary
  },
}));


