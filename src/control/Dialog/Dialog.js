import ol_ext_element from 'ol-ext/util/element'
import Utils from "geopf-extensions-openlayers/src/packages/Utils/Helper";


const dsfrPrefix = 'fr-icon'
const dsfrClasses = ['fr-icon', 'fr-icon--sm'];
const remixIconPrefix = 'ri-'
const remixIconClasses = ['ri-1x'];

const buttonKind = {
  0: 'fr-btn',
  1: 'fr-btn--secondary',
  2: 'fr-btn--tertiary',
  3: 'fr-btn--tertiary-no-outline',
}

/**
 * Bouton à insérer dans le dialog
 *  
 * @typedef {Object} DialogButton
 * @property {string} [label] - Label du bouton.
 * @property {string} [title] - Titre du bouton.
 * @property {string} [icon] - Icône du bouton.
 * @property {string} [kind] - Type du bouton : 0 pour primaire,
 * 3 pour tertiaire sans contour. Par défaut, tertiaire sans contour.
 * @property {string} [className] - Classe à ajouter au bouton.
 * @property {Function} [callback] - Fonction au clic sur le bouton.
 */


/**
 * Définition d'un dialog
 *  
 * @typedef {Object} DialogOptions
 * @property {string} id - Id du dialog.
 * @property {string} className - Classe à ajouter à la modale.
 * @property {string} [icon] - Icône du titre. Par défaut, aucune icône.
 * @property {Function} [onOpen] - Fonction à l'ouverture du dialog.
 * @property {Element} [parent] - Élément HTML du dialog. Par défaut, l'ajoute
 * au body.
 * @property {string|Element} [html] - Contenu html du dialog.
 */


/**
 * Événement à l'ouverture du dialog.
 *
 * @event HTMLDialogElement#dialog:open
 * @type {object}
 * @property {Dialog} target - Objet dialog.
 */


/**
 * Événement à la fermeture du dialog.
 *
 * @event HTMLDialogElement#dialog:close
 * @type {object}
 * @property {Dialog} target - Objet dialog.
 */


class Dialog {
  /**
   * 
   * @param {DialogOptions} options 
   */
  constructor(options) {
    /**
     * @private Nom générique de la classe du dialog
     */
    this.dialogClass = 'ign-dialog';

    this.initialize()

    options = options || {};

    // Attribut à garder pour la création du dialog
    let optionsToKeep = {};
    if (options.id) optionsToKeep.id = options.id
    if (options.className) optionsToKeep.className = `${this.options.className} ${options.className}`
    if (options.html) optionsToKeep.html = options.html
    if (options.parent) optionsToKeep.parent = options.parent
    for (const attr in options) {
      // Ajoute les attributs aria au dialog
      if (attr.startsWith('aria-')) {
        optionsToKeep[attr] = options[attr];
      }
    }

    const dialogOptions = Utils.assign(this.options, optionsToKeep);

    this.dialog = ol_ext_element.create('DIALOG', dialogOptions);

    let createOptions = Utils.assign(this.options, options);

    this._createDialog(createOptions);
  }


  /**
   * Initie les sélecteurs CSS utiles dans le reste
   */
  initialize() {
    this.options = {
      className: this.dialogClass,
      parent: document.body,
    }

    const btnGroup = `.${this.dialogClass}__btns-group`;

    this.selectors = {
      TITLE: `.${this.dialogClass}__title-name`,
      BUTTON_GROUP: btnGroup,
      BUTTONS: `${btnGroup} button`,
      BTN_CLOSE: `.${this.dialogClass}__close-btn`,
      ICON: `.${this.dialogClass}__title-icon`,
      CONTENT: `.${this.dialogClass}__content`,
      OPEN_EVENT: 'dialog:open',
      CLOSE_EVENT: 'dialog:close'
    };
  }


  /**
   * Créé le dialog en instanciant les éléments utiles
   * 
   * @param {Object} options Options de création du panneau
   */
  _createDialog(options) {
    let dialog = this.dialog;
    let self = this;

    this.closeBtn = this.selectElement(this.selectors.BTN_CLOSE);
    this.closeBtn.setAttribute('aria-controls', this.getId());

    // Permet de laisser les sous-classes override la fonction
    // de fermeture du dialog
    let closeFn = this.close;
    this.closeBtn.addEventListener('click', () => {
      closeFn(self);
    });

    // Titre et contenu du dialog
    this.dialogTitle = this.selectElement(this.selectors.TITLE);
    this.dialogIcon = this.selectElement(this.selectors.ICON);
    this.dialogContent = this.selectElement(this.selectors.CONTENT);

    if (options.title) {
      this.dialogTitle.innerHTML = options.title;
    }
    if (options.icon) {
      this.setIcon(options.icon, this.dialogIcon);
    }
    this.onOpen = typeof options.onOpen === 'function' ? options.onOpen : (e) => { };

    this.dialog.addEventListener(this.selectors.OPEN_EVENT, this.onOpen);
    this.dialog.addEventListener(this.selectors.CLOSE_EVENT, () => {
      this.dialog.removeEventListener(this.selectors.OPEN_EVENT, this.onOpen);
    }, { once: true });
  }

  /**
   * Retourne l'élement dialog de l'objet.
   * @returns {HTMLDialogElement} Élément dialog
   */
  getDialog() {
    return this.dialog;
  }

  /**
   * Retourne l'id du dialog.
   * @returns {string} id du dialog
   */
  getId() {
    return this.dialog.id;
  }

  /**
   * Sélectionne le premier élément du dialog correspondant
   * au sélecteur CSS.
   * 
   * @param {string} selector Sélecteur CSS.
   * @returns {Element} Premier élément correspondant au sélecteur.
   */
  selectElement(selector) {
    return this.dialog.querySelector(selector);
  }

  /**
   * Sélectionne tous les éléments du dialog correspondant
   * au selecteur CSS.
   * 
   * @param {string} selector Sélecteur CSS
   * @returns {NodeList} Liste des élements correspondant au sélecteur
   */
  selectAllElements(selector) {
    return this.dialog.querySelectorAll(selector);
  }

  /**
   * Ajoute une icône à un élément.
   * Par défaut, l'ajoute à l'icône du dialog.
   * Si aucune icône n'est fournie, cache l'élément si celui-ci
   * est l'icône du dialog.
   * 
   * @param {string} icon Icône à ajouter
   * @param {Element} element Élément auquel ajouter l'icône.
   * Par défaut, l'ajoute à l'icône du dialog.
   */
  setIcon(icon, element = this.dialogIcon) {
    let classes;
    if (!icon && element === this.dialogIcon) {
      element.classList.add('fr-hidden');
    }

    // Retrait des classes
    this._removeClasses(element, remixIconPrefix);
    this._removeClasses(element, dsfrPrefix);

    switch (true) {
      // Icône DSFR
      case icon.startsWith(dsfrPrefix):
        classes = dsfrClasses.concat([icon]);
        element.classList.add(...classes);
        break;

      // Icône RemixIcon
      case icon.startsWith(remixIconPrefix):
        classes = remixIconClasses.concat([icon]);
        element.classList.add(...classes);
        break;
      default:
        element.className = icon;
    }
  }

  /**
   * Enlève les classes d'un élément commençant par un préfix.
   * 
   * @param {Element} element Élément sur lequel enlever les classes
   * @param {string} prefix Préfix de la classe à enlever
   */
  _removeClasses(element, prefix) {
    if (!element instanceof Element) return;
    for (let i = element.classList.length - 1; i > 0; i--) {
      const c = element.classList[i];
      if (c.startsWith(prefix)) {
        element.classList.remove(c);
      }
    }
  }

  /**
   * Fonction utilitaire pour paramétrer facilement le dialog.
   * Les sous-fonctions sont à développer.
   * 
   * @param {Object} options Élements du dialog
   * @param {string} options.title Titre
   * @param {string} options.icon Icône
   * @param {string|Element} options.content Contenu du dialog.
   * Les interactions ne sont pas implémentées dans cette classe.
   * @param {DialogButton[]} options.buttons Boutons à ajouter.
   */
  setContent(options) {
    this.setDialogTitle(options.title);
    this.setIcon(options.icon);
    this.setDialogContent(options.content);
    this.setButtons(options.buttons);
  }

  /**
   * Retourne le titre du dialog (contenu).
   * @returns {string} Contenu du titre
   */
  getModalTitle() {
    return this.dialogTitle ? this.dialogTitle.textContent : '';
  }

  /**
   * Ajoute un titre au dialog.
   * @param {string} title Titre à remplacer
   */
  setDialogTitle(title) {
    if (this.dialogTitle && typeof title === 'string') {
      this.dialogTitle.textContent = title;
    }
  }

  /**
   * Retourne le contenu du dialog.
   * 
   * @returns {Element}
   */
  getModalContent() {
    return this.dialogContent;
  }

  /**
   * Ajoute un contenu au dialog.
   * 
   * @param {Element|string|null} content Contenu du dialog
   */
  setDialogContent(content) {
    if (!this.dialogContent) return;

    this.dialogContent.innerHTML = '';

    if (typeof content === 'string') {
      this.dialogContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.dialogContent.appendChild(content);
    }
  }

  /**
   * Ajoute un bouton au dialog.
   * 
   * @param {DialogButton} button bouton à ajouter au dialog.
   */
  addButton(button) {
    let buttonGroup = this.selectElement(this.selectors.BUTTON_GROUP);

    if (!button) {
      buttonGroup.replaceChildren();
    } else {
      const btn = document.createElement('button');
      btn.type = button.type ? button.type : 'button';
      btn.classList.add('fr-btn');

      for (const attr in button) {
        const value = button[attr];

        switch (attr) {
          case 'className':
            btn.classList.add(value);
            break;

          case 'label':
            btn.textContent = value || '';
            break;

          case 'title':
            btn.setAttribute('title', value);
            btn.setAttribute('aria-label', value);
            break;

          case 'kind':
            if (Object.keys(buttonKind).includes(value.toString())) {
              btn.classList.add(buttonKind[button.kind]);
            }
            break;

          case 'icon':
            this.setIcon(button.icon, btn);
            break;

          case 'callback':
          case 'click':
            if (typeof value === 'function') {
              btn.addEventListener('click', value);
            }
            break;

          case 'close':
            if (value) {
              btn.setAttribute('aria-controls', this.getId());
              btn.setAttribute('data-fr-opened', 'false');
            }
            break;

          default:
            // Ajout d'autres attributs
            btn.setAttribute(attr, value);
            break;
        }
      }

      buttonGroup.appendChild(btn, this.selectElement(this.selectors.BUTTONS))
    }
  }

  /**
   * Ajoute des boutons au dialog.
   * 
   * @param {DialogButton[]} buttons Array de boutons à ajoute
   */
  setButtons(buttons) {
    if (Array.isArray(buttons)) {
      let buttonGroup = this.selectElement(this.selectors.BUTTON_GROUP);
      buttonGroup.replaceChildren();
      buttons.forEach(button => {
        this.addButton(button);
      })
    } else {
      this.addButton(buttons);
    }
  }

  getButton(index) {

  }


  /**
   * Retourne les boutons du groupe de bouton.
   * 
   * @returns {NodeList} Liste des boutons.
   */
  getButtons() {
    return this.selectAllElements(this.selectors.BUTTONS);
  }

  /**
   * Retourne le bouton du groupe de bouton à un indice donné.
   * 
   * @param {number} index Indice du bouton.
   * @returns {HTMLButtonElement} Bouton à l'indice donnée.
   */
  getButton(index) {
    let buttons = this.getButtons();
    return buttons.item(index);
  }

  /**
   * Méthode utilitaire pour récupérer le bouton de fermeture du
   * dialog
   * 
   * @returns {HTMLButtonElement} Bouton de fermeture du dialog
   */
  getCloseButton() {
    return this.selectElement(this.selectors.BTN_CLOSE);
  }

  /**
   * Fonction de fermeture du dialog.
   * Peut-être override dans les sous-classes.
   * 
   * @param {Dialog} dialog 
   */
  _close(dialog) {
    dialog.getDialog().close();
  }

  /**
   * Ferme le dialog en simulant un click sur le bouton de fermeture.
   * Envoie un événement sur le dialog.
   * 
   * @param {Dialog} self 
   * 
   * @fires HTMLDialogElement#dialog:close
   */
  close(self = this) {
    self._close(self);
    self.dialog.dispatchEvent(new Event(self.selectors.CLOSE_EVENT, self));
  }

  /**
   * Fonction d'ouverture du dialog.
   * Peut-être override dans les sous-classes.
   */
  _open() {
    this.dialog.show();
  }

  /**
   * Ouvre le dialog et envoie un événement sur le dialog.
   * 
   * @fires HTMLDialogElement#dialog:open
   */
  open() {
    this._open();
    this.dialog.dispatchEvent(new Event(this.selectors.OPEN_EVENT, this));
  }

  /**
   * Ajoute ou remplace la fonction lancée à l'ouverture
   * du dialog.
   * 
   * @param {Fonction} onOpen Fonction à l'ouverture du dialog.
   */
  setOnOpen(onOpen) {
    this.dialog.removeEventListener(this.selectors.OPEN_EVENT, this.onOpen);
    if (typeof onOpen === 'function') {
      this.onOpen = onOpen;
      this.dialog.addEventListener(this.selectors.OPEN_EVENT, this.onOpen);
    }
  }

  on(type, callback, once = true) {
    let dialog = this.dialog;

    dialog.addEventListener(type, callback, { once: !!once })
  }

  onOpen(callback, once) {
    this.on(this.selectors.OPEN_EVENT, callback, once)
  }

  onClose(callback, once) {
    this.on(this.selectors.CLOSE_EVENT, callback, once)
  }
}

export default Dialog;
