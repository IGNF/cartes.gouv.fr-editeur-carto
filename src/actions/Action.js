import Dialog from '../control/Dialog/Dialog'

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
 */

/**
 * Classe représentant une action complète pour une modale (titre, contenu, pied de page et action à l'ouverture)
 */
class Action {
  /**
   * @param {ActionOptions} options - Options de configuration de l'action
   */
  constructor(options) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.buttons = options.buttons;
    this.items = options.items;
    this.onOpen = typeof options.onOpen === 'function' ? options.onOpen : () => { };
    this.icon = options.icon || '';
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


  /** @returns {Dialog} */
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


  /**
   * Lie les éléments d'une action à une modale.
   * @param {Dialog} dialog Modale auquelle l'action est liée
   */
  setAction(dialog) {
    this.dialog = dialog;
    dialog.setContent({ title: this.title, icon: this.icon, content: this.content, buttons: this.buttons, items: this.items });
    dialog.setOnOpen(this.onOpen);
  }
}


export default Action