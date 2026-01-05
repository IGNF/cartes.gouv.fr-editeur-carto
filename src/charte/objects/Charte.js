import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';

import Menu from './Menu.js';
import Footer from './Footer.js';
import Header from './Header.js';

/** DSFR charte
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

  constructor() {
    super();
    this.header = new Header();
    this.element = ol_ext_element.create('main', { parent: document.body });
    this.footer = new Footer();
    this.mode = this.setMode(Charte.modes.EDITOR);

    this._actions = {};
  }

  /** Get en element in the main (or create it)
   * @param {string} role
   * @param {Object} options
   */
  getElement(role, options) {
    options = options || {};
    options['data-role'] = role;
    options.parent = this.element;
    return this.element.querySelector('[data-role="' + role + '"]') || ol_ext_element.create('DIV', options)
  }
  /**
   * @private
   */
  _updateFooter() {
    // Move footer to the header
    this.header.footer.innerHTML = this.footer.container.innerHTML
  }
  /** Get existing or create menu 
   * @param {Objet} options 
   *  @param {string} options.type menu type description|link|option
   *  @param {string} options.label 
   *  @param {string} options.info information for type description
   *  @param {string} options.href information for type link
   *  @param {string} options.icon
   *  @param {string} options.action 
   * @returns {Menu}
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
  /** Get existing or create button 
   * 
   * @see {@link ol_ext_element} for more info on the options
   * @param {Objet} options options to create the button / link
   *  @param {string} options.type menu type button|a
   *  @param {string} options.label 
   *  @param {string} options.href information for type link
   *  @param {string} options.icon
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
   * Check if the user is connected (only through the body dataset, not
   * with the api)
   * @return {boolean} True if the user is connected, false otherwise
   */
  isConnected() {
    return document.body.dataset.disconnected === undefined;
  }

  /**
   * 
   * @param {boolean} connected True if connected, false otherwise
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
  /** Set service information
   * @param {ServiceOptions} options Options du service
   */
  setService(options) {
    this.header.setService(options)
  }
  /** Set service description
   * @param {string} desc
   */
  setDescription(desc) {
    this.footer.description.innerHTML = desc
    this._updateFooter()
  }
  /** Add partner logo
   * @param {string} title
   * @param {string} url
   * @param {string} img image src
   * @param {boolean} [main=false]
   */
  addPartner(title, url, img, main) {
    this.footer.addPartner(title, url, img, main)
    this._updateFooter()
  }
  /**
   * @param {string} href
   * @param {string} [title] default use href
   */
  addContentLink(href, title) {
    this.footer.addContentLink(href, title)
    this._updateFooter()
  }
  /** Add a bottom link
   * @param {string} title
   * @param {string} href
   */
  addFooterLink(title, href) {
    this.footer.addLink(title, href)
    this._updateFooter()
  }
  /** Add a bottom button
   * @param {string} title
   * @param {Object} options
   *  @param {string} options.icon
   */
  addFooterButton(title, options) {
    this.footer.addButton(title, options)
    this._updateFooter()
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