import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control";
import getUid from "../../utils/getUid";
import { createDefaultStyle } from "ol/style/flat.js"
import "./styleForm.scss";
import InputNumber from "./InputNumber.js"
import DefaultInputStyle from "./DefaultInputStyle.js";
import CustomSelect from "./CustomSelect.js";

/**
 * @typedef {Object} InputConfig
 * @property {HTMLElement} input - L'élément input HTML
 * @property {string} label - Le label de l'input
 * @property {string} property - La propriété flat style correspondante
 */

/**
 * @typedef {Object} SelectConfig
 * @property {HTMLSelectElement} select - L'élément select HTML
 * @property {string} label - Le label du select
 * @property {string} property - La propriété flat style correspondante
 * @property {Object<string, string>} options - Les options du select (valeur: libellé)
 */

class StyleForm extends ControlExtended {

  /**
   * Constructeur du contrôle StyleForm
   * @param {Object} options - Options du contrôle
   */
  constructor(options = {}) {
    super(options);

    /**
     * Collection des inputs indexés par leur propriété
     * @type {Map<string, InputConfig>}
     */
    this.inputs = new Map();

    // Création de la structure du formulaire
    // Conteneur englobant qui contiendra la grille et le bouton
    this.container = document.createElement('div');
    this.container.className = 'style-form-container';

    // Div de la grille pour les inputs/selects
    this.element = document.createElement('div');
    this.element.className = 'style-form';

    if (options.hasbutton) {
      // Bouton de validation
      this.submitButton = document.createElement('button');
      this.submitButton.className = 'fr-btn fr-btn--primary';
      this.submitButton.textContent = 'Valider';
      this.submitButton.type = 'button';

      // Ajouter l'événement de soumission
      this.submitButton.addEventListener('click', () => {
        this.onSubmit();
      });
    }

    this.flatStyle = createDefaultStyle();

    // Assembler la structure
    this.container.appendChild(this.element);
    if (options.hasbutton) {
      this.container.appendChild(this.submitButton);
    }
  }

  /**
   * Gestionnaire de soumission du formulaire
   * Récupère les valeurs de tous les inputs et leurs propriétés associées
   */
  onSubmit() {
    const values = {};

    // Boucler sur chaque input/select
    this.inputs.forEach((config, property) => {
      // Récupérer l'élément (input ou select)
      const element = config.input || config.select;

      if (element) {
        // Récupérer la valeur
        values[property] = parseFloat(element.value) ? parseFloat(element.value) : element.value;
      }
    });

    const flatStyle = Object.assign({}, this.flatStyle, values);

    console.log('Valeurs du formulaire:', values);

    // Prévenir que le style a changé
    this.dispatchEvent({ type: 'style', flatStyle: flatStyle });

    return values;
  }

  /**
   * Initialise les valeurs des inputs à partir d'un style flat
   * @param {Object} flatStyle - Le style flat utilisé pour initialiser les inputs  
   */
  setFlatStyle(flatStyle) {
    this.flatStyle = flatStyle;

    this.inputs.forEach((obj, key, map) => {
      const input = obj.input || obj.select;
      const value = this.flatStyle[key];
      // console.log(key, value)
      input.value = value !== undefined ? value : input.value;
      input.dispatchEvent(new Event('change', { bubbles: true })); // Pour déclencher les éventuels écouteurs de changement
    })
  }

  /**
   * Ajoute un input au formulaire
   * @param {string} label - Le libellé de l'input
   * @param {string} property - La propriété flat style correspondante
   * @param {string|Object} type - Le type d'input (par défaut: 'text') ou objet avec une methode getInput()/getElement() pour les inputs personnalisés
   * @param {Object<string, string>} options - Les options du select (si type='select')
   * @param {string} placeholder - Le placeholder (si type='select')
   * @returns {HTMLInputElement|HTMLSelectElement} L'élément input ou select créé
   */
  addInput(label, property, type = 'text', options = {}, placeholder) {
    // Si le type est 'select', déléguer à addSelect
    if (type === 'select') {
      return this.addSelect(label, property, options, placeholder);
    }

    // Générer des IDs uniques
    const inputId = getUid('input');
    const groupId = getUid('input-group');
    const messagesId = `${inputId}-messages`;

    // Créer le conteneur principal
    const container = document.createElement('div');
    container.className = 'fr-input-group';
    container.dataset.property = property;
    container.id = groupId;

    // Créer le label
    const labelElement = document.createElement('label');
    labelElement.className = 'fr-label';
    labelElement.htmlFor = inputId;
    labelElement.textContent = label;


    // Input specifique
    let input;
    const userInput = (typeof type === 'object' && type.getInput);
    if (userInput) {
      input = type.getInput();
    } else {
      // Créer un input standard
      input = document.createElement('input');
      input.className = 'fr-input';
      input.id = inputId;
      input.type = type;
      input.setAttribute('aria-describedby', messagesId);
    }

    // Créer le conteneur de messages
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'fr-messages-group';
    messagesContainer.id = messagesId;
    messagesContainer.setAttribute('aria-live', 'polite');

    // Assembler les éléments
    container.appendChild(labelElement);
    if (userInput) {
      container.appendChild(type.getElement());
    } else {
      container.appendChild(input);
    }
    container.appendChild(messagesContainer);

    // Ajouter le conteneur au formulaire
    this.element.appendChild(container);

    // Stocker la configuration dans la Map
    this.inputs.set(property, { input, label, property });

    // Prevenir que la valeur a changée
    input.addEventListener('change', (e) => {
      this.dispatchEvent({ type: 'style', property: property, value: e.target.value });
    });

    return input;
  }

  /**
   * Ajoute une séparation visuelle (break) au formulaire
   * @param {string} property - La propriété 
   * @returns {Element}
   */
  addBreak(property) {
    const br = document.createElement('hr');
    br.className = 'style-form-break';
    br.dataset.property = property;
    this.element.appendChild(br);
    return br;
  }

  /**
   * Ajoute un select au formulaire (méthode privée)
   * @param {string} label - Le libellé du select
   * @param {string} property - La propriété flat style correspondante
   * @param {Object<string, string>} options - Les options du select (valeur: libellé)
   * @param {string} placeholder - Le texte du placeholder (par défaut: 'Sélectionnez une option')
   * @returns {HTMLSelectElement} L'élément select créé
   * @private
   */
  addSelect(label, property, options = {}, placeholder = 'Sélectionnez une option') {
    // Générer des IDs uniques
    const selectId = getUid('select');
    const messagesId = `${selectId}-messages`;

    // Créer le conteneur principal
    const container = document.createElement('div');
    container.className = 'fr-select-group';
    container.dataset.property = property;

    // Créer le label
    const labelElement = document.createElement('label');
    labelElement.className = 'fr-label';
    labelElement.htmlFor = selectId;
    labelElement.textContent = label;

    // Créer le select
    const select = document.createElement('select');
    select.className = 'fr-select';
    select.id = selectId;
    select.name = selectId;
    select.setAttribute('aria-describedby', messagesId);

    // Ajouter l'option placeholder
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.selected = true;
    placeholderOption.disabled = true;
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);

    // Ajouter les options
    Object.keys(options).forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = options[value];
      select.appendChild(option);
    });

    // Créer le conteneur de messages
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'fr-messages-group';
    messagesContainer.id = messagesId;
    messagesContainer.setAttribute('aria-live', 'polite');

    // Assembler les éléments
    container.appendChild(labelElement);
    container.appendChild(select);
    container.appendChild(messagesContainer);

    // Ajouter le conteneur au formulaire
    this.element.appendChild(container);

    // Stocker la configuration dans la Map
    this.inputs.set(property, { select, label, property, options });

    return select;
  }

  /**
   * 
   * @param {import("./InputNumber").InputStyleConfig} options Options constructeur
   */
  addCustomInput(options) {
    const inputNumber = new InputNumber(options);
    this.element.appendChild(inputNumber.getElement());

    const input = inputNumber.getInput()
    const label = options.label;
    const property = options.property;

    // Prevenir que la valeur a changée
    input.addEventListener('change', (e) => {
      this.dispatchEvent({ type: 'style', property: property, value: e.target.value });
    });

    // Stocker la configuration dans la Map
    this.inputs.set(options.property, { input, label, property });
  }
  /**
   * 
   * @param {import("./InputNumber").InputStyleConfig} options Options constructeur
   */
  addDefaultInput(options) {
    const inputNumber = new DefaultInputStyle(options);
    this.element.appendChild(inputNumber.getElement());

    const input = inputNumber.getInput()
    const label = options.label;
    const property = options.property;

    // Prevenir que la valeur a changée
    input.addEventListener('change', (e) => {
      this.dispatchEvent({ type: 'style', property: property, value: e.target.value });
    });

    // Stocker la configuration dans la Map
    this.inputs.set(options.property, { input, label, property });
  }

  /**
   * 
   * @param {import("./InputNumber").InputStyleConfig} options Options constructeur
   */
  addCustomSelect(options) {
    const inputNumber = new CustomSelect(options);
    this.element.appendChild(inputNumber.getElement());

    const input = inputNumber.getInput()
    const label = options.label;
    const property = options.property;
    const opts = options.options;

    // Prevenir que la valeur a changée
    input.addEventListener('change', (e) => {
      this.dispatchEvent({ type: 'style', property: property, value: e.target.value });
    });

    // Stocker la configuration dans la Map
    this.inputs.set(options.property, { input, label, property, opts });
  }

  /**
   * Récupère un input par sa propriété
   * @param {string} property - Le nom de la propriété
   * @returns {InputConfig|undefined} La configuration de l'input ou undefined si non trouvé
   */
  getInput(property) {
    return this.inputs.get(property);
  }

  /**
   * Récupère le contenu global du formulaire
   * @returns {HTMLElement} L'élément conteneur du formulaire (avec la grille et le bouton)
   */
  getContent() {
    return this.container;
  }
}

export default StyleForm; 