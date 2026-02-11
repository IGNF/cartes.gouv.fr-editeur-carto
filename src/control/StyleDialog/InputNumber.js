import "./InputNumber.scss";
import DefaultInputStyle from "./DefaultInputStyle.js";

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

class InputNumber extends DefaultInputStyle {

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

  _initContainer(options) {
    // Conteneur boutons
    this.buttons = document.createElement('div');
    this.buttons.className = 'input-style__buttons-container';

    // Bouton up
    this.up = document.createElement('button');
    this.up.className = 'input-style__button-up fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-arrow-up-s-fill';
    this.up.tabIndex = -1;
    this.up.ariaHidden = true;
    this.up.addEventListener("click", () => {
      if (this.input.value == "" || !isNaN(parseInt(this.input.value))) {
        this.input.stepUp();
        this.input.dispatchEvent(new Event('change'));
      }
    });

    // Bouton down
    this.down = document.createElement('button');
    this.down.className = 'input-style__button-down fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-arrow-down-s-fill';
    this.down.tabIndex = -1;
    this.down.ariaHidden = true;
    this.down.addEventListener("click", () => {
      if (this.input.value == "" || !isNaN(parseInt(this.input.value))) {
        this.input.stepDown();
        this.input.dispatchEvent(new Event('change'));
      }
    });

    // Évite conflit avec setDisabled
    super._initContainer(options);
    this.element.classList.add("input-style-number")
    // Input
    this.input.type = "number";
    this.input.min = 0;

    this.buttons.appendChild(this.up);
    this.buttons.appendChild(this.down);

    this.inputContainer.appendChild(this.buttons);
  }

  _initEvents(options) {
    super._initEvents(options);
    this.input.addEventListener("change", (e) => this.dispatchEvent(e));
  }

  setDisabled(bool) {
    super.setDisabled(bool);
    if (bool) {
      this.up.disabled = true;
      this.down.disabled = true;
    } else {
      delete this.up.disabled;
      delete this.down.disabled;
    }
  }
}

export default InputNumber; 