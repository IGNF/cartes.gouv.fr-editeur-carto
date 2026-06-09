import { unByKey } from "ol/Observable.js";
import BaseObject from "ol/Object.js";
import StyleObj from "./StyleObj.js";
import Helper from "geopf-extensions-openlayers/src/packages/Utils/Helper.js";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";
import BaseEvent from "ol/events/Event.js";

import "./ConditionContainer.scss";
import Condition from "./Condition.js";
import Collection from "ol/Collection.js";
import { getConditionalOperatorOptions } from "./ConditionalOperator.js";


/**
 * @typedef {import('mcutils/layer/VectorStyle.js').default} Layer Couche openlayers
 */

/**
 * @enum {string}
 */
const ConditionContainerEventType = {
  /**
   * Envoyé lors d''une modification d'un des éléments de la condition.
   * @event ConditionContainerEvent#change-condition
   * @api
   */
  CHANGE: 'change-condition',
  /**
   * Envoyé lors d'un clic sur le bouton de suppression de la condition.
   * @event ConditionContainerEvent#delete-condition
   * @api
   */
  DELETE: 'delete-condition',
};

/**
 * @typedef {Object} ConditionContainerEventOptions
 * @property {Condition} [condition] Condition enlevée
 * @property {Layer} [layer] Couche concernée
 */

/**
 * @classdesc
 * Événement de base du conteneur de condition.
 */
export class ConditionContainerEvent extends BaseEvent {
  /**
   * @param {string} type Type d'événement
   * @param {ConditionContainerEventOptions} [options] Options de l'événement
   */
  constructor(type, options = {}) {
    super(type);
    this.condition = options.styleObj;
    this.layer = options.layer;
  }
}

/**
 * @classdesc
 * Événement émis lors d'une modification de condition.
 */
export class ConditionContainerChangeEvent extends ConditionContainerEvent {
  /**
   * @param {ConditionContainerEventOptions} [options] Options de l'événement
   */
  constructor(options = {}) {
    super(ConditionContainerEventType.CHANGE, options);
  }
}

/**
 * @classdesc
 * Événement émis lors d'une suppression de condition.
 */
export class ConditionContainerDeleteEvent extends ConditionContainerEvent {
  /**
   * @param {ConditionContainerEventOptions} [options] Options de l'événement
   */
  constructor(options = {}) {
    super(ConditionContainerEventType.DELETE, options);
  }
}

/**
 * @template Return
 * @typedef {import("ol/Observable.js").OnSignature<import("ol/Observable.js").EventTypes, import("ol/events/Event.js").default, Return> &
 *   import("ol/Observable.js").OnSignature<import("ol/ObjectEventType.js").Types, import("ol/Object.js").ObjectEvent, Return> &
 *   import("ol/Observable.js").OnSignature<'change-condition', ConditionContainerChangeEvent, Return> &
 *   import("ol/Observable.js").OnSignature<'delete-condition', ConditionContainerDeleteEvent, Return> &
 *   import("ol/Observable.js").CombinedOnSignature<import("ol/Observable.js").EventTypes|import("ol/ObjectEventType.js").Types|'change-condition'|'delete-condition', Return>} ConditionContainerOnSignature
 */


/**
 * @typedef {Object} ConditionContainerOptions
 * @property {Layer} layer Couche OpenLayers à styliser
 * @property {Condition|import("./Condition.js").ConditionOptions} condition Condition ou options de la condition à créer / modifier
 * @property {Boolean} [delete = true] Si vrai, permet d'ajouter un bouton 
 * @property {String} [datalistId] Id de la datalist à utiliser pour l'input "Attribut".
 * Si non donné, aucune datalist ne sera utilisée.
 * @property {String} [title = "Condition"] Titre de la condition
 */

/**
 * @classdesc
 * Représente le conteneur HTML lié à un StyleObj.
 * @fires ConditionContainer#change-condition
 * @fires ConditionContainer#delete-condition
 */
class ConditionContainer extends BaseObject {

  /**
   * @param {ConditionContainerOptions} options
   */
  constructor(options = {}) {
    super(options);

    // Pour la documentation des événements personnalisés
    /** @type {ConditionContainerOnSignature<import("ol/events.js").EventsKey>} */
    this.on;
    /** @type {ConditionContainerOnSignature<import("ol/events.js").EventsKey>} */
    this.once;
    /** @type {ConditionContainerOnSignature<void>} */
    this.un;

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);

    this.layer = options.layer;
    this.condition = options.condition;
    console.log(this.condition)
  }

  /**
   * Retourne la couche utilisée
   * 
   * @returns {Layer} Couche OpenLayers
   */
  get layer() {
    return this.get("layer");
  }

  /**
   * Modifie la couche utilisée
   * 
   * @param {Layer} layer Couche OpenLayers
   */
  set layer(layer) {
    this.set("layer", layer);
  }

  /**
   * Modifie la couche utilisée
   * 
   * @param {Layer} layer Couche OpenLayers
   */
  get condition () {
    return this.get("condition");
  }

  /**
   * Modifie la couche utilisée
   * 
   * @param {Condition|import("./Condition.js").ConditionOptions} condition condition
   */
  set condition(condition) {
    if (!(condition instanceof Condition)) {
      if (Condition.isValid(condition)) {
        const cond = new Condition(condition);
        this.set("condition", cond);
      } else {
        throw new TypeError(`condition doit être un objet Condition ou un objet valide pour créer un objet Condition : ${condition}`);
      }
    }

    // Mets à jour les champs
    this.attributeInput.value = condition.attribute;
    this.operatorSelect.value = condition.operator;
    this.valueInput.value = condition.value;
  }

  /**
   * Modifie le nom de la condition
   * @param {String} title Titre de la condition
   */
  setTitle(title) {
    if (typeof title === "string" && title !== '') {
      this.title.textContent = title;
    }
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param {ConditionContainerOptions} options Options du constructeur
   */
  _initialize(options = {}) {
    this._styleObjChangeKey = null;

    /** @type {Array<String>} Liste des attributs de la couche */
    this.attributes = new Array();

    this._uid = SelectorID.generate();

    options.delete ??= true;
    options.title ??= "Condition";
    options.condition ??= {
      attribute: "",
      operator: "EQ",
      value: ""
    }
  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param {ConditionContainerOptions} options Options du constructeur
   */
  _initContainer(options = {}) {
    const container = document.createElement("div");
    container.className = "condition-container";

    // Header (bouton)
    const header = document.createElement("div");
    header.className = "condition-container__header";

    const conditionTitle = document.createElement("span");
    conditionTitle.className = "condition--title fr-text--xs";
    conditionTitle.id = `condition-title-${this._uid}`;
    conditionTitle.textContent = options.title;
    header.appendChild(conditionTitle);
    container.appendChild(header);

    if (options.delete) {
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-condition-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-delete-line";
      deleteBtn.addEventListener("click", () => this._deleteCondition());
      deleteBtn.textContent = deleteBtn.title = "Supprimer la condition";

      this.deleteBtn = deleteBtn;

      header.appendChild(deleteBtn);
    }

    // Fieldset des inputs
    const inputsContainer = this._createInputs(options);

    container.appendChild(inputsContainer);
    this.fieldset = inputsContainer;
    this.title = conditionTitle;
    this.element = container;
    return container;
  }

  /**
   * Initialise les événements sur le contrôle.
   * @protected
   */
  _initEvents() {
    this.attributeInput.addEventListener("change", (e) => {
      console.log(this)
      console.log(this.condition)
      this.condition.attribute = e.target.value;
    })
    this.operatorSelect.addEventListener("change", (e) => {
      console.log(this)
      console.log(this.condition)
      this.condition.operator = e.target.value;
    })
    this.valueInput.addEventListener("change", (e) => {
      console.log(this)
      console.log(this.condition)
      this.condition.value = e.target.value;
    })
  }

  /**
   * Créé le conteneur avec inputs correspondants
   * @param {ConditionContainerOptions} options Options du constructeur
   * @returns {HTMLFieldSetElement} Fieldset contenant les champs Attribut, Opérateur et Valeur.
   */
  _createInputs(options) {
    const fieldsetId = `condition-fieldset-${this._uid}`;
    const messagesId = `condition-fieldset-messages-${this._uid}`;

    const fieldset = document.createElement("fieldset");
    fieldset.className = "fr-fieldset";
    fieldset.id = fieldsetId;
    fieldset.setAttribute("role", "group");
    fieldset.setAttribute("aria-labelledby", `condition-title-${this._uid} ${messagesId}`);

    // Liste des opérateurs
    const operatorOptions = getConditionalOperatorOptions();

    // Input attribut
    const attributeId = `condition-attribute-${this._uid}`;
    const attributeInput = document.createElement("input");
    attributeInput.className = "fr-input";
    attributeInput.type = "text";
    attributeInput.id = attributeId;

    // Lie une datalist à l'input
    options.datalistId && attributeInput.setAttribute("list", options.datalistId);

    attributeInput.name = "attribute";

    // Sélecteur d'opérateur
    const operatorId = `condition-operator-${this._uid}`;
    const operatorSelect = document.createElement("select");
    operatorSelect.className = "fr-select";
    operatorSelect.id = operatorId;
    operatorSelect.name = "operator";

    // Les options du select utilisent la clé interne (ex: EQ) et le label affiché (ex: =)
    operatorOptions.forEach(({ key, label }) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = label;
      operatorSelect.appendChild(option);
    });

    if (operatorSelect.options.length > 0) {
      operatorSelect.options[0].selected = true;
    }

    // Input pour la valeur
    const valueId = `condition-value-${this._uid}`;
    const valueInput = document.createElement("input");
    valueInput.className = "fr-input";
    valueInput.type = "text";
    valueInput.id = valueId;
    valueInput.name = "value";

    // Création des fieldset__element
    fieldset.appendChild(this._createInputFieldsetElement("Attribut", attributeId, attributeInput, true, true));

    // Conteneur dédié pour les champs Opérateur et Valeur (style géré en CSS)
    const secondaryFields = document.createElement("div");
    secondaryFields.className = "condition-container__secondary-fields";
    secondaryFields.appendChild(this._createSelectFieldsetElement("Opérateur", operatorId, operatorSelect));
    secondaryFields.appendChild(this._createInputFieldsetElement("Valeur", valueId, valueInput));
    fieldset.appendChild(secondaryFields);

    // Message global du fieldset
    const messages = document.createElement("div");
    messages.className = "fr-messages-group";
    messages.id = messagesId;
    messages.setAttribute("aria-live", "assertive");
    fieldset.appendChild(messages);
    this.messagesEl = messages;

    // Mise en mémoire
    this.attributeInput = attributeInput;
    this.operatorSelect = operatorSelect;
    this.valueInput = valueInput;

    return fieldset;
  }

  /**
   * Crée un bloc DSFR `fr-fieldset__element` avec son label et son champ input.
   * @private
   * @param {String} labelText Libellé du champ.
   * @param {String} inputId Identifiant du champ (raccordé au `for` du label).
   * @param {HTMLInputElement} inputNode Champ à injecter.
   * @param {Boolean} [inline=true] Ajoute la classe inline si vrai.
   * @param {Boolean} [inlineGrow=false] Ajoute la classe inline-grow si vrai.
   * @returns {HTMLDivElement} Élément de fieldset prêt à être ajouté dans le conteneur.
   */
  _createInputFieldsetElement(labelText, inputId, inputNode, inline = true, inlineGrow = false) {
    const fieldsetElement = document.createElement("div");
    fieldsetElement.className = "fr-fieldset__element";
    if (inline) {
      fieldsetElement.classList.add("fr-fieldset__element--inline");
      if (inlineGrow) {
        fieldsetElement.classList.add("fr-fieldset__element--inline-grow");
      }
    }

    const inputGroup = document.createElement("div");
    inputGroup.className = "fr-input-group";

    const label = document.createElement("label");
    label.className = "fr-label";
    label.setAttribute("for", inputId);
    label.textContent = labelText;

    inputGroup.appendChild(label);
    inputGroup.appendChild(inputNode);
    fieldsetElement.appendChild(inputGroup);

    return fieldsetElement;
  }

  /**
   * Crée un bloc DSFR pour une liste déroulante (`fr-select-group`) avec zone de messages.
   * @private
   * @param {String} labelText Libellé du champ.
   * @param {String} selectId Identifiant de la liste.
   * @param {HTMLSelectElement} selectNode Liste déroulante à injecter.
   * @returns {HTMLDivElement} Élément de fieldset prêt à être ajouté dans le conteneur.
   */
  _createSelectFieldsetElement(labelText, selectId, selectNode) {
    const fieldsetElement = document.createElement("div");
    fieldsetElement.className = "fr-fieldset__element fr-fieldset__element--inline";

    const selectGroup = document.createElement("div");
    selectGroup.className = "fr-select-group";

    const label = document.createElement("label");
    label.className = "fr-label";
    label.setAttribute("for", selectId);
    label.textContent = labelText;

    selectGroup.appendChild(label);
    selectGroup.appendChild(selectNode);
    fieldsetElement.appendChild(selectGroup);

    return fieldsetElement;
  }

  /**
   * Fonction gérant la suppression d'un style
   * @private
   */
  _deleteCondition() {
    this.dispatchEvent(new ConditionContainerEvent(ConditionContainerEventType.DELETE, this.condition, this.layer));
  }
}

export default ConditionContainer;
