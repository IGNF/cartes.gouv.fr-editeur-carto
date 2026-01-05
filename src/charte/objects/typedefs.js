
/**
 * @typedef ServiceOptions Options du service
 * @property {string} [service] Nom du service
 * @property {string} [baseline] Baseline du site
 * @property {string} [title] Balise `title` associée
 * @property {string} [href] Lien associé
 * @property {OperatorLogo} [operator] Logo partenaire
 * @property {BadgeOptions} [badge] Badge
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