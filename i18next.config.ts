import { defineConfig } from 'i18next-cli';
import { htmlTranslations } from './scripts/i18next-html';

export default defineConfig({
  locales: ['fr', 'en'],
  plugins: [htmlTranslations],
  extract: {
    input: ['src/**/*.{js,jsx,ts,tsx}'],
    output: 'src/i18n/locales/{{language}}/{{namespace}}.json',
    ignore: ['src/api/**/*'],
    defaultNS: 'common',
  }
});