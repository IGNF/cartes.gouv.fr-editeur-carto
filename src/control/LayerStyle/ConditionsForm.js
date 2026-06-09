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

    // Datalist pour les attributs
    const datalist = document.createElement("datalist");
    datalist.id = `attribute-datalist-${this._uid}`;
    this._datalist = datalist;

    // Footer pour ajouter une condition
    const footer = this.footer = document.createElement("div");
    footer.className = "style-form__footer";

    const addConditionBtn = document.createElement("button");
    addConditionBtn.className = "fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left fr-btn--tertiary-no-outline";
    addConditionBtn.addEventListener("click", () => this.addConditionContainer());
    addConditionBtn.textContent = "Ajouter";

    footer.appendChild(addConditionBtn);

    console.log(this.getContent());
    console.log(footer);

    this.getContent().appendChild(footer);
    this.getContent().appendChild(datalist);
  }

  /**
   * @param {Layer} layer Couche à utiliser 
   */
  set layer(layer) {
    this.set("layer", layer);

    // Enlève les anciens attributs
    this._datalist.replaceChildren();

    console.log("set layer condition form")
    console.log(layer)

    if (layer) {
      // Récupère les attributs
      const attributes = layer.getAttributes();
      console.log(attributes)
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

    // Enlève les précédents formulaires
    this.conditionContainers.forEach((container, index) => {
      if (index > 0) {
        this.conditionContainers.removeAt(index);
      }
    })

    // Ajoute les conditions
    styleObj?.conditions?.conditions?.forEach((condition, index) => {
      console.log(condition, index)
      if (index === 0) {
        // Mets à jour la première condition
        this.conditionContainers.item(0).condition = condition;
      } else {
        const container = new ConditionContainer({
          datalistId: this._datalist.id,
          condition: condition,
          title: `Condition ${this.conditionContainers.getLength() + 1}`,
        });
        this.conditionContainers.push(container);
      }
    })
  }
    
  /**
   * @param {ConditionsFormOptions} options Options du constructeur
   * @override
   */
  _initialize(options) {
    super._initialize(options);

    options.preview = false;
    options.selectGeomType = false;

    /** @type {Collection<ConditionContainer>} */
    this.conditionContainers = new Collection();
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
        e.target.remove(ev.target);
        unByKey(key);
      });
    });

    // Enlève l'élément du DOM
    this.conditionContainers.on("remove", (e) => {
      e.element.getElement().remove();
    });
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @param {ConditionsFormOptions} options Options du constructeur
   * @abstract
   * @protected
   */
  _addCustomInputs(options) {
    // On n'utilise pas this.datalist puisque l'attribut n'existe pas encore
    const conditionContainer = new ConditionContainer({
      datalistId: `attribute-datalist-${this._uid}`,
      delete: false,
      title: "Condition",
    })
    this.conditionContainers.push(conditionContainer);

    // On l'ajoute ici, cette méthode étant appelée avant _initEvents
    this.getElement().appendChild(conditionContainer.getElement());
  }

  /**
   * Ajoute une condition au formulaire
   * @param {import('./Condition.js').default|import('./Condition.js').ConditionOptions} condition Condition à ajouter
   */
  addConditionContainer(condition) {
    const conditionContainer = new ConditionContainer({
      datalistId: this._datalist.id,
      condition: condition,
      title: `Condition ${this.conditionContainers.getLength() + 1}`,
    });
    this.conditionContainers.push(conditionContainer);
  }

}


export default ConditionsForm;