import { defineConfig } from "vite";
import path from "path";
import { oidcSpa } from "oidc-spa/vite-plugin";

export default defineConfig(({ command }) => ({
  base: "./",

  build: {
    outDir: "./docs",
    emptyOutDir: true,
  },

  envPrefix: ["VITE_", "API_URL", "APP_ENV", "IAM_"],

  plugins: [
    oidcSpa(),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup/setup.js"],
    include: ["./tests/test/**/*.{test,spec}.{ts,js}"],
    server: {
      deps: {
        inline: ["mcutils"], // Permet à vitest d'importer mcutils sans avoir à modifier les imports
      },
    },
  },
}));
