import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control";
import getUid from "../../utils/getUid";
// import { createDefaultStyle } from "ol/style/flat.js"
import "./DefaultInputStyle.scss";

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
 * @fires change Changement de valeur pour le 
 */
class DefaultInputStyle extends ControlExtended {

  /**
   * Constructeur du contrôle StyleForm
   * @param {InputStyleConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);
  }

  _initialize(options) {
    super._initialize(options);
    this.inputTag = "input";
  }

  _initContainer(options) {
    super._initContainer(options);
    // Création de la structure du formulaire
    // Conteneur englobant qui contiendra la grille et le bouton
    this.element = document.createElement('div');
    this.element.className = 'input-style';
    this.element.id = getUid("input-style");
    this.element.dataset.property = options.property;

    const inputId = getUid("input-style--input");

    // Label
    this.label = document.createElement('label');
    this.label.className = 'input-style--label fr-label';
    this.label.textContent = options.label;
    this.label.htmlFor = inputId;

    // Conteneur de l'input
    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'input-style--container';

    // Input
    this.input = document.createElement(this.inputTag);
    this.input.id = inputId;
    this.input.className = 'input-style--input';

    // Assembler la structure
    this.element.appendChild(this.label);
    this.element.appendChild(this.inputContainer);

    this.inputContainer.appendChild(this.input);
  }

  _initEvents(options) {
    super._initEvents(options);
    this.input.addEventListener("change", (e) => this.dispatchEvent(e));
  }

  getElement() {
    return this.element;
  }

  getInput() {
    return this.input;
  }
}

export default DefaultInputStyle; 