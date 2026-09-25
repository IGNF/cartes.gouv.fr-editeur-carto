import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
// import sonarjs from "eslint-plugin-sonarjs";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {},
        },

        extends: compat.extends("eslint:recommended", /* "plugin:sonarjs/recommended" */),

        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },

        rules: {
            // Extension des fichiers lors des imports
            // "import/extensions": ["error", "ignorePackages", {
            //     js: "always",
            //     jsx: "always",
            //     ts: "never",
            //     tsx: "never",
            // }],

            // // Vérifie que les symboles importés existent réellement
            // "import/named": "error",
            // "import/default": "error",
            // "import/namespace": "error",

            // Variables / imports manquants ou inutilisés
            "no-undef": "off",
            "no-unused-vars": ["warn", {
                args: "none",
                ignoreRestSiblings: true,
            }],

            /*
              "sonarjs/no-small-switch": "off",
              "sonarjs/cognitive-complexity": "off",
              "sonarjs/no-duplicate-string": "off",
            */
        },
    },
    {
        // Fichiers TypeScript écrits à la main (hors code généré par Orval, ignoré
        // plus bas) : utilise le vrai parser TS pour comprendre `as`, les génériques,
        // les interfaces, etc. (le parser par défaut d'ESLint ne parse que du JS).
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tseslint.parser,
        },
        rules: {
            // Les imports de type (`import type { Foo }`) ne sont pas des valeurs
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", {
                args: "none",
                ignoreRestSiblings: true,
            }],
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
    },
    globalIgnores([
        "**/.*",
        "**/www/*",
        "**/todo/*",
        "**/public/*",
        "**/node_modules/*",
        "**/docs/*",
        // Code TypeScript généré par Orval (non analysable par le parseur JS)
        "src/api/**",
        "**/*.d.ts",
    ]),
]);
