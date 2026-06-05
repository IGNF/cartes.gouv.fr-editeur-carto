import { unByKey } from "ol/Observable.js";
import BaseObject from "ol/Object.js";
import StyleObj from "./StyleObj.js";
import Helper from "geopf-extensions-openlayers/src/packages/Utils/Helper.js";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";
import BaseEvent from "ol/events/Event.js";

import "./StyleContainer.scss";


/**
 * @enum {string}
 */
const StyleContainerEventType = {
  /**
   * Envoyé lors d'un clic sur le bouton d'ouverture du style.
   * @event StyleContainerEvent#open-style
   * @api
   */
  OPEN: 'open-style',
  /**
   * Envoyé lors d'un clic sur le bouton de suppression du style.
   * @event StyleContainerEvent#delete-style
   * @api
   */
  DELETE: 'delete-style',
};

/**
 * @classdesc
 * Les événements envoyés par des instances de {@link StyleContainer} 
 * sont des instances de ce type.
 */
export class StyleContainerEvent extends BaseEvent {

  /**
   * @param {StyleContainerEventType} type The event type.
   * @param {StyleObj} styleObj Style géré par ce conteneur
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers à styliser
   */
  constructor(type, styleObj, layer) {
    super(type);

    /**
     * Style géré par ce conteneur.
     * @type {StyleObj>}
     * @api
     */
    this.styleObj = styleObj;

    /**
     * Couche OpenLayers à styliser.
     * @type {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default>}
     * @api
     */
    this.layer = layer;
  }
}


/**
 * @typedef {Object} StyleContainerOptions
 * @property {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers à styliser
 * @property {StyleObj} styleObj Style géré par ce conteneur
 * @property {String} [className] Classe CSS racine du conteneur
 */


/**
 * @classdesc
 * Représente le conteneur HTML lié à un StyleObj.
 */
class StyleContainer extends BaseObject {

  /**
   * @param {StyleContainerOptions} options
   */
  constructor(options = {}) {
    super(options);

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param {StyleContainerOptions} options Options du constructeur
   */
  _initialize(options = {}) {
    this._styleObjChangeKey = null;
    this.setStyleObj(options.styleObj);
    this.setLayer(options.layer);
    this._uid = SelectorID.generate();
  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param {StyleContainerOptions} options Options du constructeur
   */
  _initContainer(options = {}) {
    const container = document.createElement("div");
    container.className = "style-container";
    if (this.getStyleObj().isDefault) {
      container.classList.add("not-draggable")
    }

    const dragElement = this._createDragElement(options);

    const preview = document.createElement("div");
    preview.className = `style-container__preview`;
    const canvas = this.preview = this._createSymbol(this.getStyleObj());
    preview.appendChild(canvas);

    const title = document.createElement("span");
    title.className = `style-container__title`;
    title.textContent = this.getStyleObj()?.name;

    const actions = this.createActionsButton();

    container.appendChild(dragElement);
    container.appendChild(preview);
    container.appendChild(title);
    container.appendChild(actions)

    this.titleElement = title;
    this.element = container;
    return container;
  }

  /**
   * Initialise les événements sur le contrôle.
   * @protected
   */
  _initEvents() {
    // Modifie le conteneur au changement de nom
    this.getStyleObj().on("change:name", (e) => {
      this.titleElement.textContent = e.target.get(e.key);
    });
  }

  /**
   * Créé l'élément de drag.
   * 
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API | Drag and drop API}
   * 
   * @protected
   */
  _createDragElement() {
    const dragBtn = document.createElement("div");
    dragBtn.id = Helper.addUID("style__drag-btn", this._uid);
    dragBtn.className = "style__drag-btn fr-icon-draggable-fill fr-icon--sm";

    // Désactive le drag pour les valeurs par défaut
    if (this.getStyleObj().isDefault) {
      dragBtn.classList.add("not-draggable");
      dragBtn.setAttribute("disabled", true);
    } else {
      dragBtn.title = "Deplacer le style";
      // Ajoute la navigation au clavier
      const buttonUp = document.createElement("button");
      buttonUp.dataset.direction = "up";
      buttonUp.id = Helper.addUID("style__drag-btn-up", this._uid);
      buttonUp.title = buttonUp.ariaLabel = "Déplacer le style vers le haut";
      buttonUp.className = "fr-icon-arrow-up-line fr-icon--sm";
      // buttonUp.onkeydown = this._onMoveElement.bind(this, true);

      const buttonDown = document.createElement("button");
      buttonDown.dataset.direction = "down";
      buttonDown.id = Helper.addUID("style__drag-btn-down", this._uid);
      buttonDown.title = buttonDown.ariaLabel = "Déplacer le style vers le bas";
      buttonDown.className = "fr-icon-arrow-down-line fr-icon--sm";
      // buttonDown.onkeydown = this._onMoveElement.bind(this, false);
      const divKeyboard = document.createElement("div");
      divKeyboard.className = "style__drag-keyboard";

      divKeyboard.appendChild(buttonDown);
      divKeyboard.appendChild(buttonUp);
      dragBtn.appendChild(divKeyboard);
    }

    return dragBtn;
  }

  createActionsButton() {
    // Conteneur
    const actions = document.createElement("div");
    actions.className = `style-container__actions`;

    const isDefault = this.getStyleObj().isDefault;

    // Couche par défaut : non supprimable et nom non modifiable
    if (!isDefault) {
      const editStyleNameBtn = document.createElement("button");
      editStyleNameBtn.className = "edit-style-name-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-edit-line";
      editStyleNameBtn.addEventListener("click", () => this.editStyleName());
      editStyleNameBtn.textContent = editStyleNameBtn.title = "Modifier le nom du style";
      actions.appendChild(editStyleNameBtn);

      const deleteStyleBtn = document.createElement("button");
      deleteStyleBtn.className = "delete-style-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-delete-line";
      deleteStyleBtn.addEventListener("click", () => this.deleteStyle());
      deleteStyleBtn.textContent = deleteStyleBtn.title = "Supprimer le style";
      actions.appendChild(deleteStyleBtn);
    }

    // Ajoute l'action de modification du style dans tous les cas
    const openStyleBtn = document.createElement("button");
    openStyleBtn.className = "open-style-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-arrow-right-s-line";
    openStyleBtn.addEventListener("click", () => this.openStyle());
    openStyleBtn.textContent = openStyleBtn.title = "Modifier le style";
    actions.appendChild(openStyleBtn);

    return actions;
  }

  /**
   * Fonction gérant le renommage d'un style
   */
  openStyle() {
    this.dispatchEvent(new StyleContainerEvent(StyleContainerEventType.OPEN, this.getStyleObj(), this.getLayer()));
  }

  /**
   * Fonction gérant le renommage d'un style
   */
  editStyleName() {
    // Prend tout l'espace du conteneur
    const mask = document.createElement("div");
    mask.className = "style-container__mask";

    // Input
    const input = document.createElement("input");
    input.className = "fr-input";
    input.type = "text";
    input.id = `input-edit-layer-name-${this._uid}`;
    input.ariaLabel = input.title = `Nom du style`;
    input.value = this.getStyleObj()?.name;
    input.id = `input-edit-layer-name-${this._uid}`;
    mask.appendChild(input)

    // Annuler
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "cancel-edit-style-name-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-close-line";
    cancelBtn.textContent = cancelBtn.title = "Annuler la modification";
    cancelBtn.addEventListener("click", () => {
      mask.remove();
    });
    mask.appendChild(cancelBtn);

    // Valider
    const validateBtn = document.createElement("button");
    validateBtn.className = "validate-style-name-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-check-line";
    validateBtn.textContent = validateBtn.title = "Modifier le nom du style";
    validateBtn.addEventListener("click", () => {
      this.getStyleObj().name = input.value;
      mask.remove();
    });
    mask.appendChild(validateBtn);

    this.element.after(mask);
  }

  /**
   * Fonction gérant la suppression d'un style
   */
  deleteStyle() {
    this.dispatchEvent(new StyleContainerEvent(StyleContainerEventType.DELETE, this.getStyleObj(), this.getLayer()));
  }

  /**
   * @returns {StyleObj}
   */
  getStyleObj() {
    return this.get("styleObj");
  }

  /**
   * @param {StyleObj} styleObj
   */
  setStyleObj(styleObj) {
    if (!(styleObj instanceof StyleObj)) {
      throw new TypeError("StyleContainer.styleObj doit être une instance de StyleObj");
    }

    if (this._styleObjChangeKey) {
      unByKey(this._styleObjChangeKey);
      this._styleObjChangeKey = null;
    }

    this.set("styleObj", styleObj);
  }

  /**
   * Retourne la couche utilisée
   * 
   * @returns {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} Couche OpenLayers
   */
  getLayer() {
    return this.get("layer");
  }

  /**
   * Modifie la couche utilisée
   * 
   * @property {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers
   */
  setLayer(layer) {
    this.set("layer", layer);
  }

  /**
   * 
   * @param {StyleObj} styleObj Objet de style
   */
  _createSymbol(styleObj) {
    if (!(styleObj instanceof StyleObj)) {
      return document.createElement("canvas");
    }
    return styleObj.getImage({ size: [48, 48], margin: 8 });
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }
}

export default StyleContainer;
