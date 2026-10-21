import { createInstance } from 'i18next';
import actionsFr from './locales/fr/actions.json';
import charteFr from './locales/fr/charte.json';
import commonFr from './locales/fr/common.json';
import actionsEn from './locales/en/actions.json';
import charteEn from './locales/en/charte.json';
import commonEn from './locales/en/common.json';
import pagesFr from './locales/fr/pages.json';
import pagesEn from './locales/en/pages.json';
import controlsFr from './locales/fr/controls.json';
import controlsEn from './locales/en/controls.json';
import notificationsFr from './locales/fr/notifications.json';
import notificationsEn from './locales/en/notifications.json';

const i18next = createInstance();
// const language = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'fr';

i18next.init({
  // lng: language,
  fallbackLng: 'fr',
  supportedLngs: ['fr'],
  ns: ['actions', 'charte', 'common', 'controls', 'notifications', 'editor', 'pages'],
  defaultNS: 'editor',
  resources: {
    fr: {
      actions: actionsFr,
      charte: charteFr,
      common: commonFr,
      controls: controlsFr,
      notifications: notificationsFr,
      pages: pagesFr,
    },
    en: {
      actions: actionsEn,
      charte: charteEn,
      common: commonEn,
      controls: controlsEn,
      notifications: notificationsEn,
      pages: pagesEn,
    },
  },
  initAsync: false,
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (__, namespace, key) => {
    console.error(`[i18n] Missing translation: ${namespace}:${key}`);
  },
});

// document.documentElement.lang = language;

export default i18next;
