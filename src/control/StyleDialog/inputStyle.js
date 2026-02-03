import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control";
import getUid from "../../utils/getUid";
// import { createDefaultStyle } from "ol/style/flat.js"
import "./inputStyle.scss";

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
 * @property {Object<string, string>} options Les options du select (valeur: libellé)
 */

class InputStyleDefault extends ControlExtended {

  /**
   * Constructeur du contrôle StyleForm
   * @param {InputStyleConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);

    // Création de la structure du formulaire
    // Conteneur englobant qui contiendra la grille et le bouton
    this.container = document.createElement('div');
    this.container.className = 'input-style';
    this.container.classList.add(options.property);

    // Label
    this.label = document.createElement('label');
    this.label.className = 'input-style--label fr-label';
    this.label.textContent = options.label;

    // Label
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-style--container';

    // Input
    this.element = document.createElement('input');
    this.element.className = 'input-style--input';
    this.element.type = "number";

    const separator = document.createElement("hr");
    separator.className = 'input-style--separator';

    // Bouton pour sélectionner les options
    this.button = document.createElement('button');
    this.button.className = 'input-style--button fr-btn fr-btn--tertiary-no-outline fr-icon-arrow-up-s-line';
    this.button.setAttribute
    this.button.ariaExpanded = false;
    this.button.addEventListener("click", (e) => {
      console.log(e.target)
      e.target.setAttribute("aria-expanded", (e.target.ariaExpanded === "false"));
    })

    // Assembler la structure
    this.container.appendChild(this.label);
    this.container.appendChild(inputContainer);

    inputContainer.appendChild(this.element);
    inputContainer.appendChild(separator);
    inputContainer.appendChild(this.button);
  }

  getContainer() {
    return this.container;
  }
}

export default InputStyleDefault; 