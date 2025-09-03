import Dialog from '../control/Dialog/AbstractDialog.js';

/**
 * Bouton à mettre dans le buttons d'un dialog
 *  
 * @typedef {Object} FooterButton
 * @property {string} label - Label du bouton.
 * @property {boolean} [kind=0] - Classe du bouton.
 * @property {boolean} [close=false] - Bouton de fermeture du dialog.
 * @property {Function} [callback] - Fonction au clic sur le bouton.
 */

/**
 * Action à définir pour un bouton ou un autre élément.
 * 
 * @typedef {Object} ActionOptions
 * @property {string} title - Titre d'un dialog.
 * @property {string|HTMLElement} content - Contenu d'un dialog.
 * @property {string} [icon] - Icône du titre.
 * @property {FooterButton[]} [buttons] - Boutons d'actions d'un dialog.
 * @property {Function} [onOpen] - Fonction à appeler à l'ouverture d'un dialog.
 * @property {Function} [onClose] - Fonction à appeler à la fermeture d'un dialog.
 * @property {String} [size] - Uniquement pour les panneaux. Définit la taille du panneau.
 */

/* Action list */
const actions = {};

/**
 * Classe représentant une action complète pour une modale (titre, contenu, pied de page et action à l'ouverture)
 */
class Action {
  /**
   * @param {ActionOptions} options - Options de configuration de l'action
   */
  constructor(options) {
    if (!options.id) {
      throw new Error('L\'id de l\'action est obligatoire');
    }
    if (actions[options.id]) {
      throw new Error(`L'action ${options.id} existe déjà`);
    }
    this.id = options.id || '';
    this.title = options.title || '';
    this.content = options.content || '';
    this.buttons = options.buttons;
    this.items = options.items;
    this.onOpen = typeof options.onOpen === 'function' ? options.onOpen : () => { };
    this.onClose = typeof options.onClose === 'function' ? options.onClose : () => { };
    this.icon = options.icon || '';
    this.size = options.size;
    actions[options.id] = this;
  }


  /**
   * Renvoie l'actipn correspondante à l'id donné
   * @param {string} id Id de l'action
   * @returns {Action} Action avec l'id correspondant
   * @throws {Error} Si aucune action n'existe
   * @static
   */
  static getAction(id) {
    const action = actions[id];
    if (!action) {
      throw new Error(`L'action ${id} n'existe pas`);
    }
    return action;
  }

  /** Open 
   * @package {Event} e - Événement du clic
   * @static
   */
  static open(e) {
    // Pour gérer le cas du toggle
    const target = e.target || e.detail.target;

    const dialogId = target.getAttribute('aria-controls');
    const pressed = target.ariaPressed;

    const action = Action.getAction(target.dataset.action);
    const dialog = Dialog.getDialog(dialogId);
    if (!dialog || !action) return;

    if (pressed === false || pressed === 'false') {
      dialog.close();
    } else {
      dialog.setAction(action);
    }
  }

  /** @returns {string} */
  get id() {
    return this._id;
  }

  /** @param {string} value */
  set id(value) {
    this._id = value;
  }

  /** @returns {string} */
  get title() {
    return this._title;
  }

  /** @param {string} value */
  set title(value) {
    this._title = value;
  }

  /** @returns {string|HTMLElement} */
  get content() {
    return this._content;
  }

  /** @param {string|HTMLElement} value */
  set content(value) {
    this._content = value;
  }

  /** @returns {ActionButton[]} */
  get buttons() {
    return this._buttons;
  }

  /** @param {ActionButton[]} buttons */
  set buttons(buttons) {
    if (!Array.isArray(buttons)) return;
    this._buttons = buttons;
  }

  /** @returns {ActionButton[]} */
  get items() {
    return this._items;
  }

  /** @param {ActionButton[]} items */
  set items(items) {
    if (!Array.isArray(items)) return;
    this._items = items;
  }


  /** @returns {import('../control/Dialog/AbstractDialog').default} */
  getDialog() {
    return this.dialog;
  }

  /**
   * Ajoute un bouton dans le buttons
   * @param {ActionButton} button
   */
  addButton(button) {
    this._buttons.push(button);
  }

  /**
   * Récupère le bouton à un index donné
   * @param {number} index
   * @returns {ActionButton|undefined}
   */
  getButton(index) {
    return this._buttons[index];
  }
}


export default Action