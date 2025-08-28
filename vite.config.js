import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'dev' ? '/' : '/cartes.gouv.fr-editeur-carto/',

  build: {
    outDir: './docs',
    emptyOutDir: true,
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/setup.js'],
    include: ["./tests/test/**/*.{test,spec}.{ts,js}"],
    server: {
      deps: {
        inline: ['mcutils'], // Permet à vitest d'importer mcutils sans avoir à modifier les imports
      },
    }
  },
}));


