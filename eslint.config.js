import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
    globalIgnores([
        // Dossiers générés / externes ignorés par le lint
        "public/build",
        "public/bundles",
        "public/env.js",
        "assets/data",
        "vendor",
        "var",
        "src/api/*", // Car généré automatiquement par orval
    ]),
    // Config de base pour tous les fichiers (plugins, globals, règles génériques)
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        ...jsxA11y.flatConfigs.recommended,
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            ...jsxA11y.flatConfigs.recommended.languageOptions,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Cohérence logique
            "array-callback-return": "error",
            // Placeholders autorisés via underscore
        },
    },
    // // Surcharge de règles spécifique aux fichiers de traduction i18n (fichiers *.locale.ts/tsx)
    // // Permet les identifiants i18n utilisés uniquement pour le typage et les arguments préfixés par un underscore
    // {
    //     files: ["**/*.locale.ts", "**/*.locale.tsx"],
    //     rules: {
    //         "@typescript-eslint/no-unused-vars": [
    //             "warn",
    //             {
    //                 varsIgnorePattern: "^i18n$",
    //                 argsIgnorePattern: "^_",
    //                 caughtErrorsIgnorePattern: "^_",
    //             },
    //         ],
    //     },
    // },

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
    jsxA11y.flatConfigs.strict,
    prettier,
]);
