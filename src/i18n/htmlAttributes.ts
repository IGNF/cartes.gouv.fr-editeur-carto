/** Attributs HTML dont la valeur peut être remplacée par une traduction. */
export type TranslatedHtmlAttribute = "placeholder" | "title" | "aria-label" | "alt";

/**
 * Associe chaque marqueur de traduction à sa cible dans le HTML.
 *
 * La valeur du marqueur contient une clé i18next, par exemple :
 * `<input data-i18n-placeholder="common:search">`.
 * Le helper `translateHtml` écrit alors la traduction dans `placeholder`.
 * La cible `null` de `data-i18n` désigne le texte de l'élément (`textContent`),
 * et non un attribut.
 *
 * Cette liste est partagée avec le plugin d'extraction pour qu'il détecte
 * les mêmes marqueurs que le helper. Pour prendre en charge un nouvel attribut,
 * compléter le type ci-dessus et ajouter sa correspondance ici.
 */
export const translationAttributes = {
    "data-i18n": null,
    "data-i18n-placeholder": "placeholder",
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-alt": "alt",
} as const satisfies Readonly<Record<`data-i18n${string}`, TranslatedHtmlAttribute | null>>;
