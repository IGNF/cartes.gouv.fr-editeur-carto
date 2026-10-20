import i18next from './index';
import { translationAttributes } from './htmlAttributes';

/**
 * Traduit les textes et attributs marqués avec `data-i18n` ou `data-i18n-*`.
 * Utilise la langue courante d'i18next à chaque appel.
 * @param html Modèle HTML statique, par exemple importé avec `?raw`.
 * @returns HTML traduit, à transmettre au composant chargé de l'insérer.
 * @throws Si une clé est absente ou si une traduction de texte supprimerait des éléments enfants.
 */
export function translateHtml(html: string): string {
  // Le contenu du template reste hors du document pendant la traduction.
  const template = document.createElement('template');
  template.innerHTML = html;

  for (const [marker, attribute] of Object.entries(translationAttributes)) {
    template.content.querySelectorAll(`[${marker}]`).forEach(element => {
      const key = element.getAttribute(marker);
      if (!key || !key.includes(':') || !i18next.exists(key)) {
        throw new Error(`[i18n] Invalid or missing HTML translation: ${key}`);
      }
      // textContent et setAttribute traitent la traduction comme du texte :
      // l'échapper ici provoquerait un double encodage lors de la sérialisation.
      const text = i18next.t(key, { interpolation: { escapeValue: false } });
      if (attribute) {
        element.setAttribute(attribute, text);
      } else {
        // textContent remplace tous les enfants : les icônes et indications
        // doivent rester hors de l'élément portant ce marqueur.
        if (element.children.length) {
          throw new Error(`[i18n] data-i18n must target a text-only element: ${key}`);
        }
        element.textContent = text;
      }
    });
  }

  return template.innerHTML;
}
