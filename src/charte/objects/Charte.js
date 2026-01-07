import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';

import Menu from './Menu.js';
import Footer from './Footer.js';
import Header from './Header.js';

/** Classe représentant la charte DSFR
 * 
 */
class Charte extends BaseObject {
  /**
   * Modes de l'application
   */
  static modes = Object.freeze({
    EDITOR: 'editor',
    STORYMAP: 'storymap',
    PREVIEW: 'preview',
  })

  /**
   * Constructeur de la classe Charte
   * Initialise le header, le main et le footer de la page
   */
  constructor() {
    super();
    this.header = new Header();
    this.element = ol_ext_element.create('main', { parent: document.body });
    this.footer = new Footer();
    this.mode = this.setMode(Charte.modes.EDITOR);

    this._actions = {};
  }

  /** Récupère un élément dans le main (ou le crée s'il n'existe pas)
   * @param {string} role Le rôle de l'élément à récupérer
   * @param {Object} options Options de création de l'élément
   * @returns {HTMLElement} L'élément trouvé ou créé
   */
  getElement(role, options) {
    options = options || {};
    options['data-role'] = role;
    options.parent = this.element;
    return this.element.querySelector('[data-role="' + role + '"]') || ol_ext_element.create('DIV', options)
  }
  /**
   * Met à jour le footer dans le header
   * @private
   */
  _updateFooter() {
    // Déplace le footer vers le header
    this.header.footer.innerHTML = this.footer.element.innerHTML
  }
  /** Récupère un menu existant ou en crée un nouveau
   * @param {Object} options Options du menu
   *  @param {string} options.type Type de menu : description|link|option
   *  @param {string} options.label Label du menu
   *  @param {string} options.info Information pour le type description
   *  @param {string} options.href Lien pour le type link
   *  @param {string} options.icon Icône du menu
   *  @param {string} options.action Action associée au menu
   * @returns {Menu} Le menu trouvé ou créé
   */
  getHeaderMenu(options) {
    options = options || {}
    // Existing menu
    if (options.action) {
      // const menu = this.header.element.querySelector('[data-action="' + options.action + '"]')
      const menu = this._actions[options.action];
      if (menu) return menu;
    }
    // Create new one
    options.parent = this.header.tools;
    let menu = new Menu(options);
    this._actions[options.action] = menu;
    return menu;
  }
  /** Récupère un bouton existant ou en crée un nouveau
   * 
   * @see {@link ol_ext_element} pour plus d'informations sur les options
   * @param {Object} options Options pour créer le bouton / lien
   *  @param {string} options.type Type du menu : button|a
   *  @param {string} options.label Label du bouton
   *  @param {string} options.href Lien pour le type a
   *  @param {string} options.icon Icône du bouton
   *  @param {string} options.action Action associée au bouton
   * @returns {HTMLElement} Le bouton créé ou trouvé
   */
  getHeaderButton(options) {
    options = options || {};
    options.parent = this.header.tools;

    // Existing menu
    if (options.action) {
      const button = this.header.element.querySelector('button[data-action="' + options.action + '"]')
      if (button) return button
    }
    let btnOptions = {
      className: 'fr-btn ' + (options.icon ? options.icon : ''),
      text: options.label,
      parent: options.parent,
    }
    // Ajoute les attributs supplémentaires au bouton
    for (const attr in options) {
      if (!['icon', 'label', 'type'].includes(attr)) {
        btnOptions[attr] = options[attr];
      }
    }
    return ol_ext_element.create(options.type, btnOptions);
  }

  /**
   * Vérifie si l'utilisateur est connecté (uniquement via le dataset du body,
   * pas via l'API)
   * @returns {boolean} Vrai si l'utilisateur est connecté, faux sinon
   */
  isConnected() {
    return document.body.dataset.disconnected === undefined;
  }

  /**
   * Définit l'état de connexion de l'utilisateur et met à jour l'interface
   * @param {boolean} connected Vrai si connecté, faux sinon
   */
  setConnected(connected) {
    let btnsConnect = this.header.element.querySelectorAll("[data-action='login']");
    let connectAccesses = this.header.element.querySelectorAll("[data-action='connect']");
    for (let index = 0; index < connectAccesses.length; index++) {
      const connectAccess = connectAccesses[index];
      const btnConnect = btnsConnect[index];
      let navConnect = connectAccess.parentElement;
      let navItem = navConnect.querySelector('.fr-nav__item');
      if (connected) {
        delete document.body.dataset.disconnected;
        btnConnect.classList.add('fr-hidden');
        navConnect.classList.remove('fr-hidden');
        // TODO : mieux gérer le problème ?
        navItem.classList.add('fr-nav__item--align-right')
      } else {
        document.body.dataset.disconnected = '';
        btnConnect.classList.remove('fr-hidden');
        navConnect.classList.add('fr-hidden');
      }
    }
  }
  /** Définit les informations du service
   * @param {ServiceOptions} options Options du service
   */
  setService(options) {
    this.header.setService(options)
  }
  /** Définit la description du service
   * @param {string} desc Description du service
   */
  setDescription(desc) {
    this.footer.description.innerHTML = desc
    this._updateFooter()
  }
  /** Ajoute un logo de partenaire
   * @param {FooterPartner} options Options d'un partenaire
   */
  addPartner(options) {
    this.footer.addPartner(options)
    this._updateFooter()
  }
  /**
   * Ajoute un lien de contenu au footer
   * @param {FooterContentLink} options Contenu d'un lien pour le footer
   */
  addContentLink(options) {
    this.footer.addContentLink(options)
    this._updateFooter()
  }
  /** Ajoute un lien en bas de page
   * @param {FooterBottomLink} options Option d'un lien de bas de page
   */
  addFooterLink(options) {
    this.footer.addLink(options)
    this._updateFooter()
  }
  /** Ajoute un bouton en bas de page
   * @param {string} title Titre du bouton
   * @param {Object} options Options du bouton
   *  @param {string} options.icon Icône du bouton
   */
  addFooterButton(title, options) {
    this.footer.addButton(title, options)
    this._updateFooter()
  }


  /**
   * Passe le header en mode compact
   * 
   * @param {boolean} compact Si vrai, passe en mode compact 
   */
  setCompact(compact) {
    this.header.setCompact(compact);
    this.footer.setCompact(compact);
  }

  /**
   * Récupère le mode actuel de l'application
   * @returns {"storymap"|"editor"|"preview"}
   */
  getMode() {
    return this.get('mode')
  }

  /**
   * Définit le mode de l'application.
   *
   * @param {"storymap"|"editor"|"preview"} mode
   * Un des modes définis dans {@link Charte.modes}
   *
   * @example
   * const charte = new Charte();
   * // Passage en mode mise en page
   * charte.setMode(Charte.modes.STORYMAP);
   */
  setMode(mode) {
    // Vérifie si le mode est valide
    if (!Object.values(Charte.modes).includes(mode)) {
      throw new Error(`Mode invalide (utilisez Charte.modes): ${mode}`);
    }

    // Envoie un événement de cette manière
    if (this.getMode() !== mode) {
      this.set('mode', mode, false);
      document.body.dataset.mode = mode;
    }
  }
}

export default Charte;