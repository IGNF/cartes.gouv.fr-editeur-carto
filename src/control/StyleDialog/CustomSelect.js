import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control";
import getUid from "../../utils/getUid";
// import { createDefaultStyle } from "ol/style/flat.js"
import "./CustomSelect.scss";
import DefaultInputStyle from "./DefaultInputStyle";

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

class CustomSelect extends DefaultInputStyle {

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
    super._initContainer(options);
    this.element.classList.add("input-style-select")
    // Input
    const select = document.createElement("select");
    this.inputContainer.replaceChild(select, this.input);
    this.input = select;

    this.setOptions(options.options)
  }

  _initEvents(options) {
    super._initEvents(options);
    this.input.addEventListener("change", (e) => this.dispatchEvent(e));
  }

  setOptions(options) {
    for (const value in options) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.label = options[value]
      this.input.append(opt);
    }
  }
}

export default CustomSelect; 