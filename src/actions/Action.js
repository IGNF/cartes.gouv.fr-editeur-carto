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
 * @callback BeforeOpenFunction Fonction appelée avant l'ouverture du dialog.
 * Elle n'est appelée que lors de la méthode statique `Action.open`, et pas lors de l'appel à `Dialog.open()`.
 * La gestion de l'erreur doit être gérée dans cette fonction.
 * @return {boolean} Si faux, empêche la propagation de l'événement `click` dans la méthode `Action.open`.
 */

/**
 * Action à définir pour un bouton ou un autre élément.
 * 
 * @typedef {Object} ActionOptions
 * @property {string} title - Titre d'un dialog.
 * @property {string|HTMLElement} content - Contenu d'un dialog.
 * @property {string} [icon] - Icône du titre.
 * @property {FooterButton[]} [buttons] - Boutons d'actions d'un dialog.
 * @property {BeforeOpenFunction} [beforeOpen] - Fonction à appeler avant l'ouverture d'un dialog. Si rien n'est donné, 
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
    this.beforeOpen = typeof options.beforeOpen === 'function' ? options.beforeOpen : () => true;
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
   * @param {Event|Dialog} e - Événement du clic ou dialog
   * @param {Action} actionId - Id de l'action à ouvrir
   * @param {boolean} pressed - Si l'action est un toggle, indique si le toggle est activé ou non
   * @static
   */
  static open(e, actionId, pressed = null) {
    let dialogId;
    let action;
    const isDialog = e instanceof Dialog;
    if (isDialog) {
      // Cas d'une ouverture classique
      dialogId = e.getId();
      action = Action.getAction(actionId);
    } else {
      // Pour gérer le cas du toggle
      const target = e.target || e.detail.target;
      dialogId = target.getAttribute('aria-controls');
      action = Action.getAction(target.dataset.action);
      pressed = target.ariaPressed;
    }

    const dialog = Dialog.getDialog(dialogId);
    if (!dialog || !action) return;

    // Empêche la propagation de l'événement
    if (action.beforeOpen() === false) {
      e?.preventDefault();
      e?.stopPropagation();
      e?.stopImmediatePropagation();
      return;
    }

    if (pressed === false || pressed === 'false') {
      dialog.close();
    } else {
      dialog.setAction(action, isDialog);
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