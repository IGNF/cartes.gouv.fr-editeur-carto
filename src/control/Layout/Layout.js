
import Dialog from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js';
import TabNav from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNav.js';
import StoryMap from 'mcutils/StoryMap.js';
import legendTabNavItem from './legend.js';
import titleTabNavItem from './title.js';
import styleTabNavItem from './style.js';
import './layout.scss';
import TabNavItem from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js';

/**
 * @typedef {Object} LayoutTabNavItemOptions
 * @property {String} label - Label du bouton.
 * @property {String|HTMLElement} [content] - Contenu affiché dans l'onglet.
 * @property {String} [title] - Attribut title du bouton.
 * @property {String} [icon] - Classe d'icône DSFR/Remix.
 * @property {Function} [onOpen] - Callback à l'ouverture de l'onglet.
 * @property {Function} [onClose] - Callback à la fermeture de l'onglet.
 */

/**
 * @typedef {Object} LayoutOptions
 * @property {String} [id] - Identifiant unique du dialog.
 * @property {String} [title] - Titre du panneau.
 * @property {String} [icon] - Classe CSS de l'icône.
 * @property {String|HTMLElement} [content] - Contenu principal du panneau.
 * @property {String} [position="right"] - Position du panneau (left ou right).
 * @property {String} [size="md"] - Taille du panneau (sm ou md).
 * @property {String} [className] - Classe CSS additionnelle.
 * @property {Array<LayoutTabNavItemOptions|TabNavItem>} [items] - Liste des onglets à créer.
 * @property {String} [labelTabNav] - Label ARIA de la navigation.
 * @property {Function} [onOpen] - Callback à l'ouverture du panneau.
 * @property {Function} [onClose] - Callback à la fermeture du panneau.
 */

/**
 * Panneau latéral basé sur Dialog, avec navigation par onglets.
 */
class Layout extends Dialog {

  /**
   * @param {StoryMap} storymap Instance storymap utilisée par les onglets.
   * @param {LayoutOptions} [options] Options de construction.
   */
  constructor(storymap, options) {
    super(options);

    this.storymap = storymap;
    this.labelTabNav = options.labelTabNav;

    if (storymap) {
      this.setMap(storymap.getCarte().getMap());
    }
  }

  /**
   * @param {LayoutOptions} [options] Options de construction.
   */
  _initialize(options = {}) {
    if (!Array.isArray(options.items) || options.items.length === 0) {
      options.items = [legendTabNavItem, titleTabNavItem, styleTabNavItem];
    }

    super._initialize(options);
  }
  
  /**
   * @param {LayoutOptions} [options] Options de construction.
   */
  _initContainer(options) {
    super._initContainer(options);
    this.element.classList.add('layout-dialog');
  }

  /**
   * Retourne l'instance storymap liée au layout.
   * @returns {StoryMap}
   */
  getStorymap() {
    return this.storymap;
  }

  /**
   * Met à jour la storymap utilisée par le layout.
   * @param {StoryMap} storymap Instance storymap.
   */
  setStorymap(storymap) {
    this.storymap && this.storymap.getCarte()?.getMap()?.removeControl(this);
    this.storymap = storymap;
    this.storymap && this.setMap(storymap.getCarte().getMap());
  }

  /**
   * Remplace tous les onglets de la navigation.
   * @param {Array<LayoutTabNavItemOptions>} items Liste des onglets.
   * @param {String} [label] Label ARIA de la navigation.
   */
  setItems(items = [], label) {
    const nextItems = Array.isArray(items) ? items : [items];
    this.setTabNav(nextItems, label ?? this.labelTabNav);
  }

  /**
   * Ajoute un onglet dans la navigation.
   * @param {LayoutTabNavItemOptions} item Onglet à ajouter.
   */
  addItem(item) {
    if (!item) {
      return;
    }

    this.addTabNavItem(item);
  }

  /**
   * Ajoute plusieurs onglets sans effacer les existants.
   * @param {Array<LayoutTabNavItemOptions>} items Onglets à ajouter.
   */
  addItems(items = []) {
    if (!Array.isArray(items)) {
      this.addItem(items);
      return;
    }

    items.forEach(item => this.addItem(item));
  }

  /**
   * Retourne la navigation tertiaire typée si disponible.
   * @returns {TabNav|null}
   */
  getNavigation() {
    const tabNav = this.getTabNav();
    return tabNav instanceof TabNav ? tabNav : null;
  }
}

export default Layout;