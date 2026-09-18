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
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },

        "rules": {
            // Extension des fichiers lors des imports
            "import/extensions": ["error", "ignorePackages", {
                js: "always",
                jsx: "always",
                ts: "never",
                tsx: "never",
            }],

            // Vérifie que l'import existe"
            "import/no-unresolved": ["error", {
                ignore: ["\\?raw$", "\\?url$"],
            }],

            // Vérifie que les symboles importés existent réellement
            "import/named": "error",
            "import/default": "error",
            "import/namespace": "error",

            // Variables / imports manquants ou inutilisés
            "no-undef": "error",
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
    globalIgnores([
        "**/.*",
        "**/www/*",
        "**/todo/*",
        "**/public/*",
        "**/docs/*",
        // Code TypeScript généré par Orval (non analysable par le parseur JS)
        "src/api/**",
        "**/*.d.ts"
    ])
]);
