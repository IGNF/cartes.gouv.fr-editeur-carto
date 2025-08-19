import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'dev' ? '/' : '/cartes.gouv.fr-editeur-carto/',

  build: {
    outDir: './docs',
    emptyOutDir: true,
  },
}));


