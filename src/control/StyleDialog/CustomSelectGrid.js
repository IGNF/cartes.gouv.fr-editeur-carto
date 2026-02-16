import getUid from "../../utils/getUid.js";
import "./CustomSelectGrid.scss";
import { isElementInView, isScrollable, maintainScrollVisibility } from "../../utils/utils.js";
import CustomSelect from "./CustomSelect.js";

/**
 * @typedef {Object} InputConfig
 * @property {HTMLElement} input L'élément input HTML
 * @property {string} label Le label de l'input
 * @property {string} property La propriété flat style correspondante
 */

/**
 * @typedef {Object} SelectConfig
 * @property {HTMLSelectElement} select L'élément select HTML
 * @property {string} label Le label du select
 * @property {string} property La propriété flat style correspondante
 * @property {Object<string, string>} options Les options du select (valeur: libellé)
 */

/**
 * @typedef {Object} InputStyleConfig
 * @property {string} label Le label de l'input
 * @property {string} property La propriété flat style correspondante
 * @property {Object<string, string>} options Les options de la sélection (valeur: libellé)
 */

/**
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/} Pour voir l'inspiration
 */
class CustomSelectGrid extends CustomSelect {

  /**
   * Constructeur du contrôle StyleForm
   * @param {InputStyleConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);
  }

  _initialize(options) {
    super._initialize(options);
    /**
     * Définit le nombre de colonne dans la grille (utilisé pour màj l'index)
     * @type {Number}
     */
    this.columnNb = 6;
    this.pageSize = 5;
  }

  _initContainer(options) {
    super._initContainer(options);
    this.element.classList.add("input-style-select-grid");
  }

  _initEvents(options) {
    super._initEvents(options);
  }

  /**
   * 
   * @param {Number} currentIndex Indice courrant
   * @param {Number} maxIndex Indice max
   * @param {Number} action Type d'action
   * @returns 
   */
  getUpdatedIndex(currentIndex, maxIndex, action) {
    // Pour mettre l'indice à la fin / au début de la ligne
    const modulo = currentIndex % this.columnNb;
    switch (action) {
      case this.selectActions.Left:
        return Math.max(0, currentIndex - 1);
      case this.selectActions.Right:
        return Math.min(maxIndex, currentIndex + 1);
      case this.selectActions.Down:
        return Math.min(maxIndex, currentIndex + this.columnNb);
      case this.selectActions.Up:
        return Math.max(0, currentIndex - this.columnNb);
      case this.selectActions.First:
        return 0;
      case this.selectActions.Last:
        return maxIndex;
      case this.selectActions.BeginRow:
        return Math.max(0, currentIndex - modulo)
      case this.selectActions.EndRow:
        return Math.min(maxIndex, currentIndex + ((this.columnNb - 1) - modulo))
      case this.selectActions.PageUp:
        return Math.max(0, currentIndex - (this.pageSize * this.columnNb));
      case this.selectActions.PageDown:
        return Math.min(maxIndex, currentIndex + (this.pageSize * this.columnNb));
      default:
        return currentIndex;
    }
  }

  /**
   * Créé une option avec une valeur et un label
   * @param {String} value Valeur du choix (dépend de la propriété)
   * @param {String} label Libellé à afficher
   * @param {Number} index Indice de l'élément (utile pour les raccourcis claviers)
   */
  addChoice(value, label, index) {
    const option = super.addChoice(value, label, index);

    // Retire le label
    option.removeAttribute("aria-labelled-by");
    option.ariaLabel = label;
    option.lastChild.remove();
    return option;
  }
}

export default CustomSelectGrid;