/**
 * @file Formulaire pour l'étiquette d'un objet
 */
import ExtendedFlatStyleForm from '../StyleDialog/ExtendedFlatStyleForm.js';
import { StyleEvent } from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import ConditionContainer from './ConditionContainer.js';
import Collection from 'ol/Collection.js';
import { unByKey } from 'ol/Observable.js';

import "./ConditionsForm.scss";

/**
 * @typedef {import('mcutils/layer/VectorStyle.js').default} Layer Couche openlayers
 */

/**
 * @typedef {Object} ConditionsFormOptions Options pour le formulaire de style d'un objet
 * @property {Layer} [layer] Couche à utiliser pour déduire les attributs.
 */


class ConditionsForm extends ExtendedFlatStyleForm {
  /**
   * @param {ConditionsFormOptions} options Options du constructeur
   */
  constructor(options = {}) {
    super(options);

    this.getContent().classList.add("conditions-form");

    // Footer pour ajouter une condition
    const footer = this.footer = document.createElement("div");
    footer.className = "style-form__footer";

    const addConditionBtn = document.createElement("button");
    addConditionBtn.className = "fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left fr-btn--tertiary-no-outline";
    addConditionBtn.addEventListener("click", () => this.addConditionContainer());
    addConditionBtn.textContent = "Ajouter";

    footer.appendChild(addConditionBtn);

    this.getContent().appendChild(footer);
    this.getContent().appendChild(this._datalist);
  }

  /**
   * @param {Layer} layer Couche à utiliser 
   */
  set layer(layer) {
    this.set("layer", layer);

    // Enlève les anciens attributs
    this._datalist.replaceChildren();

    if (layer) {
      // Récupère les attributs
      const attributes = layer.getAttributes();
      Object.keys(attributes).forEach(attr => {
        const option = document.createElement("option");
        option.value = attr;
        this._datalist.appendChild(option);
      });
    }

    this.conditionContainers.forEach(container => {
      container.layer = layer;
    })
  }

  get styleObj() {
    return super.styleObj;
  }

  /**
   * @param {import("./StyleObj.js").default} styleObj Objet styleObj
   */
  set styleObj(styleObj) {
    super.styleObj = styleObj;

    // Enlève les formulaires précédents
    this.conditionContainers.clear();

    // Ajoute les conditions
    const conditions = styleObj?.conditions?.conditions;
    const normalizedConditions = conditions instanceof Collection
      ? conditions.getArray()
      : [];

    // Si aucune condition, en ajoute une de base
    if (normalizedConditions.length === 0) {
      const conditionOptions = {
        attribute: "",
        operator: "EQ",
        value: "",
      };
      const conditionContainer = new ConditionContainer({
        datalistId: this._datalist.id,
        delete: false,
        title: "Condition",
        condition: conditionOptions
      })
      this.conditionContainers.push(conditionContainer);
      return;
    }

    console.log("normalized conditions for each");
    normalizedConditions.forEach((condition, index) => {
      this.addConditionContainer(condition);
    })
  }

  /**
   * @param {ConditionsFormOptions} options Options du constructeur
   * @override
   */
  _initialize(options) {
    /** @type {Collection<ConditionContainer>} */
    this.conditionContainers = new Collection();

    options.preview = false;
    options.selectGeomType = false;

    super._initialize(options);

    // Datalist pour les attributs
    const datalist = document.createElement("datalist");
    datalist.id = `attribute-datalist-${this._uid}`;
    this._datalist = datalist;
  }

  /**
   * 
   * @returns {import('./StyleObj.js').StyleObjCondition}
   */
  getConditions() {
    const result = {
      all: this.styleObj.conditions.all,
      usecase: this.styleObj.conditions.usecase,
      conditions: new Collection(),
    }
    this.conditionContainers.forEach(container => {
      result.conditions.push(container.condition);
    })
    return result;
  }

  /**
   * Override la méthode de base pour ne jamais afficher de sélecteur
   * @override
   */
  showSelectGeomType() {
    super.showSelectGeomType(false);
  }

  /**
   * Override la méthode de base pour ne jamais afficher de preview
   * @override
   */
  showPreview() {
    super.showPreview(false);
  }

  /**
   * Override la méthode de base car pas de géométrie
   * @override
   */
  setGeom() {
    return;
  }

  /**
   * @param {ConditionsFormOptions} options Options du constructeur
   * @override
   */
  _initEvents(options) {
    // Pas de super._initEvents car pas nécessaire

    // Ajoute un écouteur d'événement sur la collection
    this.conditionContainers.on("add", (e) => {
      e.element.layer = this.layer;
      this.getElement().appendChild(e.element.getElement());
      let key = e.element.on("delete-condition", (ev) => {
        // Enlève l'élément de la collection et n'écoute plus l'événement
        this.conditionContainers.remove(ev.target);
        unByKey(key);
      });
    });

    // Enlève l'élément du DOM
    this.conditionContainers.on("remove", (e) => {
      e.element.getElement().remove();
    });
  }

  /**
   * Ajoute une condition au formulaire
   * @param {import('./Condition.js').default|import('./Condition.js').ConditionOptions} condition Condition à ajouter
   */
  addConditionContainer(condition) {
    const conditionOptions = condition
      ? {
        attribute: condition?.attribute ?? condition?.attr ?? "",
        operator: condition?.operator ?? condition?.op ?? "EQ",
        value: condition?.value ?? condition?.val ?? "",
      }
      : undefined;
    // Si c'est le premier, ne permet pas de supprimer la condition
    const length = this.conditionContainers.getLength();
    const title = !!length ? `Condition ${this.conditionContainers.getLength() + 1}` : "Condition";
    const first = !!length;
    const conditionContainer = new ConditionContainer({
      datalistId: this._datalist.id,
      condition: conditionOptions,
      delete: first,
      title: title,
    });
    this.conditionContainers.push(conditionContainer);
  }

}


export default ConditionsForm;