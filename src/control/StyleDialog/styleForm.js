import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control";
import getUid from "../../utils/getUid";
import { styleToFlatStyle } from "./styleToFlatStyle";
import { createDefaultStyle } from "ol/style/flat.js"
import "./styleForm.scss";
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";

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

    /**
     * Array des features à styliser
     * @type {Map<Number, Feature>}
     */
    this.features = new Map();

    // Création de la structure du formulaire
    // Conteneur englobant qui contiendra la grille et le bouton
    this.container = document.createElement('div');
    this.container.className = 'style-form-container';

    // Div de la grille pour les inputs/selects
    this.element = document.createElement('div');
    this.element.className = 'style-form';

    // Bouton de validation
    this.submitButton = document.createElement('button');
    this.submitButton.className = 'fr-btn fr-btn--primary';
    this.submitButton.textContent = 'Valider';
    this.submitButton.type = 'button';

    // Ajouter l'événement de soumission
    this.submitButton.addEventListener('click', () => {
      this.onSubmit();
    });

    this.flatStyle = createDefaultStyle();

    // Assembler la structure
    this.container.appendChild(this.element);
    this.container.appendChild(this.submitButton);
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

    Object.assign(this.flatStyle, values);

    console.log('Valeurs du formulaire:', values);
    console.log('Features à styliser:', this.features);

    this.features.forEach(f => {
      Object.keys(this.flatStyle).forEach(key => {
        f.setIgnStyle(key, this.flatStyle[key]);
        f.changed();
      // updateCurrentStyle(item);
      })
      console.log(f.getStyle());
      console.log(f.getStyleFunction());
      // const styles = new VectorLayer({style : this.flatStyle}).getStyleFunction()(f);
      // f.setStyle(styles)
    })


    // TODO: Appliquer les styles aux features

    return values;
  }

  /**
   * Définit les features à styliser
   * @param {Array<Feature>} selected - Array des features sélectionnées
   * @param {Array<Feature>} deselected - Array des features désélectionnées
   */
  setFeatures(selected, deselected) {

    deselected.forEach(f => {
      this.features.delete(f.ol_uid);
    });

    selected.forEach(f => {
      this.features.set(f.ol_uid, f);
    });
    // Si au moins une feature, initialiser les inputs avec le style de la première
    if (this.features.size > 0) {
      this.initInputs(this.features.entries().next().value[1]);
    }
  }

  /**
   * Initialise les valeurs des inputs à partir d'une feature
   * @param {ol.Feature} feature - La feature dont on récupère le flat style
   */
  initInputs(feature) {
    console.log('Initialisation des inputs avec la feature:', feature);

    this.flatStyle = styleToFlatStyle(feature);
    console.log('Flat style extrait:', this.flatStyle);
    console.log(feature?.getIgnStyle?.(true))

    this.inputs.forEach((obj, key, map) => {
      const input = obj.input;
      const value = this.flatStyle[key];
      input.value = value || input.value;
      // console.log(input, key, map);
      // console.log(flatStyle[key])
    })


    // TODO: Remplir les inputs avec les valeurs du flatStyle
  }

  /**
   * Ajoute un input au formulaire
   * @param {string} label - Le libellé de l'input
   * @param {string} property - La propriété flat style correspondante
   * @param {string|Object} type - Le type d'input (par défaut: 'text') ou objet d'options si type='select'
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
    container.id = groupId;

    // Créer le label
    const labelElement = document.createElement('label');
    labelElement.className = 'fr-label';
    labelElement.htmlFor = inputId;
    labelElement.textContent = label;

    // Créer l'input
    const input = document.createElement('input');
    input.className = 'fr-input';
    input.id = inputId;
    input.type = type;
    input.setAttribute('aria-describedby', messagesId);

    // Créer le conteneur de messages
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'fr-messages-group';
    messagesContainer.id = messagesId;
    messagesContainer.setAttribute('aria-live', 'polite');

    // Assembler les éléments
    container.appendChild(labelElement);
    container.appendChild(input);
    container.appendChild(messagesContainer);

    // Ajouter le conteneur au formulaire
    this.element.appendChild(container);

    // Stocker la configuration dans la Map
    this.inputs.set(property, { input, label, property });

    return input;
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
    Object.entries(options).forEach(([value, text]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
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