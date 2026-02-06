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

  _initialize(options) {
    super._initialize(options);
  }


  _initContainer(options) {
    super._initContainer(options);
    this.element.classList.add("input-style-select");

    const optionsContainerId = getUid("option-container");

    this.inputContainer.remove();
    this.inputContainer = document.createElement('button');
    this.inputContainer.className = 'input-style--container';
    this.inputContainer.ariaExpanded = false;
    this.inputContainer.role = "combobox";
    this.inputContainer.ariaHasPopup = "listbox";
    this.inputContainer.setAttribute("aria-controls", optionsContainerId)
    this.element.appendChild(this.inputContainer);

    const firstColor = Object.keys(options.options)[0];


    this.choice = document.createElement('span');
    this.choice.className = 'input-style--option-value';
    this.choice.dataset.type = "color";
    this.choice.style.backgroundColor = firstColor;
    this.choice.ariaSelected = true;
    this.inputContainer.appendChild(this.choice);

    this.optionsContainer = document.createElement("div");
    this.optionsContainer.id = optionsContainerId;
    this.optionsContainer.className = "input-style--options-container";
    this.element.appendChild(this.optionsContainer);

    for (const value in options.options) {
      const option = this.addChoice(value, options.options[value]);
      this.optionsContainer.appendChild(option);
    }
  }

  _initEvents(options) {
    super._initEvents(options);

    this.inputContainer.addEventListener("click", (e) => {
      this.inputContainer.ariaExpanded = (this.inputContainer.ariaExpanded === "false")
    })
  }

  setValue(value, label, options) {
    this.choice.style.backgroundColor = value;
    this.choice.dataset.value = value;
    this.choice.ariaLabel = label;
    this.input.value = value;
    this.input.dispatchEvent(new Event("change"));
  }

  /**
   * Créé une option avec une valeur et un label
   * @param {String} value Valeur du choix (dépend de la propriété)
   * @param {String} label Libellé à afficher
   * @param {Object} options Options en plus à mettre sur l'élément
   */
  addChoice(value, label, options) {
    const option = document.createElement("button");
    option.role = "option";
    option.ariaCurrent = false;

    const choice = document.createElement('span');
    choice.className = 'input-style--option-value';
    choice.dataset.type = "color";
    choice.dataset.value = value;
    choice.style.backgroundColor = value;

    const lab = document.createElement('label');
    lab.className = 'input-style--option-label';
    lab.innerText = label;

    option.addEventListener("click", (e) => {
      this.setValue(value, label, options);
    })

    option.appendChild(choice);
    option.appendChild(lab);
    return option;
  }
}

export default CustomSelect; 