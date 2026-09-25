import { defineConfig } from "vite";
import { oidcSpa } from "oidc-spa/vite-plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  base: process.env.BASE_URL || "/creer-une-carte/",
  build: {
    outDir: "./docs",
    emptyOutDir: true,
  },

  envPrefix: ["VITE_", "API_URL", "VIEWER_URL", "REDIRECT_URI", "APP_ENV", "IAM_"],

  plugins: [oidcSpa()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

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
