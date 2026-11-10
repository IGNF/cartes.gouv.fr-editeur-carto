/**
 * @typedef ServiceOptions Options du service
 * @property {string} [service] Nom du service
 * @property {string} [baseline] Baseline du site
 * @property {string} [title] Balise `title` associée
 * @property {string} [href] Lien associé
 * @property {OperatorLogo} [operator] Logo partenaire
 * @property {BadgeOptions} [badge] Badge
 * @property {boolean} [beta] Ajoute un badge beta. Faux par défaut.
 */

/**
 * @typedef BadgeOptions Options du badge
 * @property {string} text Libellé du badge. Si vide, enlève juste le badge.
 * @property {string} [colorClass] classe définissant la couleur du badge. Si donné, doit être de la forme ` fr-badge--NOM-COULEUR`. Par défaut, n'applique aucune couleur.
 * @property {string} [icon] classe définissant l'icône DSFR à utiliser. Par défaut n'ajoute aucune icône
 */

/**
 * @typedef OperatorLogo Options du logo partenaire
 * @property {string} logo Lien du logo (en mode clair si darkLogo)
 * @property {string} [darkLogo] Lien du logo en mode sombre (si différent);
 */

/**
 * @typedef FooterContentLink Options d'un lien de contenu du footer
 * @property {string} href URL du lien
 * @property {string} title Texte du lien
 * @property {string} [titleAttr] Attribut title pour l'accessibilité
 */

/**
 * @typedef FooterPartner Options d'un partenaire du footer
 * @property {string} alt Texte alternatif de l'image
 * @property {string} url URL du lien
 * @property {string} img Source de l'image
 * @property {string} [height] Hauteur du logo
 */

/**
 * @typedef FooterBottomLink Options d'un lien du bas du footer
 * @property {string} title Texte du lien
 * @property {string} href URL du lien
 */

/**
 * @typedef MenuOptions Options d'une entrée ajoutée avec Menu.addMenu
 * @property {"description"|"link"|"option"} type Type de l'entrée
 * @property {string} [label] Libellé de l'entrée. Par défaut « no label » pour les types link et option.
 * @property {string} [info] Texte complémentaire pour le type description
 * @property {string} [href] URL du lien pour les types link et option
 * @property {string} [title] Attribut title du lien pour les types link et option
 * @property {string} [icon] Classe de l'icône pour les types link et option
 * @property {string} [action] Identifiant data-action utilisé pour retrouver et modifier l'entrée
 * @property {boolean} [external] Ouvre le lien dans un nouvel onglet pour le type link. Faux par défaut.
 * @property {boolean} [beta] Ajoute une icône beta dans le lien.
 */
