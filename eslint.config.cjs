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

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
        },

        "ecmaVersion": 12,
        "sourceType": "module",
        parserOptions: {},
    },

    plugins: {
//        sonarjs,
    },

    extends: compat.extends("eslint:recommended", /* "plugin:sonarjs/recommended" */),

    "rules": {
      /*
        "sonarjs/no-small-switch": "off",
        "sonarjs/cognitive-complexity": "off",
        "sonarjs/no-duplicate-string": "off",
      */
    },
}, globalIgnores(["**/.*", "**/www/*", "**/todo/*", "**/public/*", "**/docs/*"])]);
