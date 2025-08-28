const viteConfig = require("./vite.config.js");

const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
// const sonarjs = require("eslint-plugin-sonarjs");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            "ecmaVersion": 'latest',
            "sourceType": "module",
            parserOptions: {},
        },

        plugins: {
            // sonarjs,
            import: require("eslint-plugin-import"), // Check extension in imports / exports
        },

        extends: compat.extends("eslint:recommended", /* "plugin:sonarjs/recommended" */),

        settings: {
            "import/resolver": {
                vite: {
                    viteConfig,
                },
            },
        },

        "rules": {
            // Extension des fichiers lors des imports
            "import/extensions": ["error", "always", {
                js: "always",
                jsx: "always",
            }],

            // Vérifie que l'import existe"
            "import/no-unresolved": ["error", {
                ignore: ["\\?raw$", "\\?url$"],
            }],

            /*
              "sonarjs/no-small-switch": "off",
              "sonarjs/cognitive-complexity": "off",
              "sonarjs/no-duplicate-string": "off",
            */
        },
    },
    globalIgnores([
        "**/.*",
        "**/www/*",
        "**/todo/*",
        "**/public/*",
        "**/docs/*"
    ])
]);
