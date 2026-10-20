import { globSync, readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import type { Plugin } from 'i18next-cli';
import { translationAttributes } from '../src/i18n/htmlAttributes';

export const htmlTranslations: Plugin = {
  name: 'html-translations',
  onEnd(keys) {
    for (const file of globSync('src/**/*.html', { exclude: ['src/api/**'] })) {
      const fragment = JSDOM.fragment(readFileSync(file, 'utf8'));
      for (const marker of Object.keys(translationAttributes)) {
        fragment.querySelectorAll(`[${marker}]`).forEach(element => {
          const value = element.getAttribute(marker);
          const separator = value?.indexOf(':') ?? -1;
          if (!value || separator <= 0 || separator === value.length - 1) {
            throw new Error(`[i18n] Invalid HTML translation key in ${file}: ${value}`);
          }
          const ns = value.slice(0, separator);
          const key = value.slice(separator + 1);
          if (!keys.has(value)) {
            keys.set(value, { ns, key, locations: [{ file }] });
          }
        });
      }
    }
  },
};
