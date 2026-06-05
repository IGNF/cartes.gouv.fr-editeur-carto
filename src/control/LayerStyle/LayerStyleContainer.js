import BaseObject from "ol/Object.js";
import StyleObj from "./StyleObj.js";
import StyleContainer from "./StyleContainer.js";
import BaseVector from "ol/layer/BaseVector.js";
import Feature from 'ol/Feature.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { unByKey } from 'ol/Observable';
import VectorStyle from "mcutils/layer/VectorStyle.js";
import { defaultIgnStyle } from "mcutils/style/ignStyleFn.js";
import { ignStyleToFlatStyle } from "../StyleDialog/styleToFlatStyle.js";
import { Collection } from "ol";

import "./LayerStyleContainer.scss";

/**
 * @typedef {Object} LayerStyleContainerOptions
 * @property {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers à styliser
 * @property {String} [className] Classe CSS racine du conteneur
 */

/**
 * Représente le conteneur de styles d'une couche.
 */
class LayerStyleContainer extends BaseObject {

  /**
   * @param {LayerStyleContainerOptions} options
   */
  constructor(options = {}) {
    super(options);

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);

    this.setLayer(options.layer || null);
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param {LayerStyleContainerOptions} options Options du constructeur
   */
  _initialize(options = {}) {
    /** @type {Collection<StyleContainer> } */
    this.styles = new Collection([], { unique: true });
    this.stylesObjsKey = {};
  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param {LayerStyleContainerOptions} options Options du constructeur
   */
  _initContainer(options = {}) {
    const container = document.createElement("div");
    container.className = options.className ?? "";
    container.classList.add("layer-styles-container");

    this.element = container;

    return container;
  }

  /**
   * Initialise les événements sur le contrôle.
   * @protected
   * @param {LayerStyleContainerOptions} options Options du constructeur
   */
  _initEvents(options = {}) {
    // Aucun événement DOM spécifique pour l'instant.

    // À l'ajout d'un style, on écoute différents événements
    this.styles.on("add", (e) => {
      // Ouverture du style
      let key = e.element.on("open-style", (e) => this.dispatchEvent(e));
      // Enregistre la clé pour pouvoir supprimer l'événement ensuite
      this.stylesObjsKey[e.element.ol_uid] ??= {};
      this.stylesObjsKey[e.element.ol_uid]["open-style"] = key;

      // Suppression du style
      key = e.element.on("delete-style", (e) => this.dispatchEvent(e));
      // Enregistre la clé pour pouvoir supprimer l'événement ensuite
      this.stylesObjsKey[e.element.ol_uid]["delete-style"] = key;
    });


    // Suppression d'un style
    this.styles.on("remove", (e) => {
      // Supprime tous les écouteurs d'événements
      Object.keys(this.stylesObjsKey[e.element.ol_uid]).forEach(event => {
        unByKey(this.stylesObjsKey[e.element.ol_uid][event])
      })
    });
  }


  /**
   * Creation du drag and drop
   *
   * @param {HTMLElement} elementDraggable - Element HTML (DOM) Container
   * @private 
   */
  _createDraggableElement(elementDraggable) {
    if (!elementDraggable) {
      return;
    }

    const handleClass = ".style__drag-btn";

    // Voir lien suivant pour dragndrop avec tab
    // https://robbymacdonell.medium.com/refactoring-a-sortable-list-for-keyboard-accessibility-2176b34a07f4
    sortable = Sortable.create(elementDraggable, {
      handle: handleClass,
      dataIdAttr: "data-sortable-id", // required to calculate the custom sort
      draggable: ".style-container",
      filter: ".not-draggable",
      animation: 200,
      // Call event function on drag and drop
      // onEnd: function (e) {
      //   this._onEndDragAndDropLayerClick(e);
      // }
    });
  }

  /**
   * Fonction permettant de bouger une couche au clavier
   * @param {HTMLElement} element Élément à bouger
   * @param {up|down} direction Direction dans laquelle déplacer la couche
   * @returns {Boolean} Vrai si l'opération a fonctionnée.
   */
  _moveElement(element, direction) {
    const sortable_list = this._sortables[0];
    if (["up", "down"].includes(direction) == false) {
      return false;
    }
    if (typeof element.dataset.sortableId == "undefined") {
      return false;
    }

    // Attribut pour réorganiser après
    let sortableId = element.dataset.sortableId;
    let order = sortable_list.toArray();
    let index = order.indexOf(sortableId);

    // Retrait de l'objet à déplacer
    order.splice(index, 1);

    // Déplace la couche à la bonne position
    if (direction == "down") {
      order.splice(index + 1, 0, sortableId);
    } else if (direction == "up") {
      order.splice(index - 1, 0, sortableId);
    }

    // Applique l'opéaration de tri
    sortable_list.sort(order, true);
    // Change le zindex et envoie l'événement
    this._onEndDragAndDropLayerClick({
      newIndex: order.indexOf(sortableId),
    });
    return true;
  }

  /**
   * Écouteur d'événement pour modifier le z-index
   * @param {Boolean} up Vrai si c'est up. Faux si down.
   * @param {KeyboardEvent} event Événement du clavier
   */
  _onMoveElement(up, event) {
    if (["Enter", "Space"].includes(event.code)) {
      // Choisit la bonne direction
      const direction = up ? "up" : "down";
      const oppositeDirection = up ? "down" : "up";

      event.stopPropagation();
      event.preventDefault();

      // Déplace l'élément dans la bonne direction
      this._moveElement(event.currentTarget.closest(".draggable-layer"), direction);

      // Change le focus dans le cas où c'est le premier / dernier élément
      if (window.getComputedStyle(event.currentTarget).visibility == "hidden") {
        event.currentTarget.parentNode.querySelector(`[data-direction=${oppositeDirection}]`).focus();
      } else {
        event.currentTarget.focus();
      }
    }
  }

  /**
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   */
  setLayer(layer) {
    if (layer instanceof BaseVector || layer instanceof VectorStyle) {
      this.set("layer", layer);
    }
    this.clearContent();
    this.addLayerStyles(layer);
  }

  /**
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   */
  addLayerStyles(layer) {
    const result = this.getLayerStyle(layer);
    this.defaultStyles = result.defaultStyles;
    this.conditionalStyles = result.conditionalStyles;
    this.defaultStyles.forEach((styleObj) => {
      const styleContainer = new StyleContainer({ layer: layer, styleObj: styleObj });
      this.styles.push(styleContainer);
      const element = styleContainer.getElement();
      this.element.appendChild(element);
    });

    this.conditionalStyles.forEach((styleObj) => {
      const styleContainer = new StyleContainer({ layer: layer, styleObj: styleObj });
      const element = styleContainer.getElement();
      this.element.appendChild(element);
      this.styles.push(styleContainer);
    });
  }

  /**
   * Enlève les styles par défaut / conditionnels
   */
  clearContent() {
    this.element.replaceChildren();
  }

  /**
   * @returns {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default|null}
   */
  getLayer() {
    return this.get("layer") || null;
  }

  /**
   * Récupère les styles par défaut d'une couche.
   * 
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   * Couche sur laquelle récupérer les styles par défaut et conditionnel
   * @returns {{defaultStyles: Array<StyleObj>, conditionalStyles:Array<StyleObj>}} Objet avec les styles par défaut et conditionnels
   * @private
   */
  getLayerStyle(layer) {
    const defaults = this._getDefaultStyles(layer);
    const conditional = this._getConditionalStyles(layer);
    return {
      defaultStyles: defaults,
      conditionalStyles: conditional,
    };
  }

  /**
   * Récupère les styles par défaut d'une couche.
   * 
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   * Couche sur laquelle récupérer les styles par défauts
   * @returns {Array<StyleObj>} Tableau de styles par défaut
   * @private
   */
  _getDefaultStyles(layer) {
    // TODO : récupérer les styles par défauts
    if (!layer) {
      return [];
    }
    const ptStyleObj = this.#getStyleObj(layer, "Point");
    const lineStyleObj = this.#getStyleObj(layer, "LineString");
    const polyStyleObj = this.#getStyleObj(layer, "Polygon");

    return [ptStyleObj, lineStyleObj, polyStyleObj];
  }

  /**
   * Récupère les styles conditionnels d'une couche
   * 
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   * Couche sur laquelle récupérer les styles conditionels
   * @returns {Array<StyleObj>} Tableau de styles par défaut
   * @private
  */
  _getConditionalStyles(layer) {
    // TODO : récupérer les styles conditionnels
    return []
  }


  /**
   * @param {Array<StyleObj>} styleObjs
   */
  setDefaultStyles(styleObjs = []) {
    this.defaultStyles = styleObjs
  }

  /**
   * @param {Array<StyleObj>} styleObjs
   */
  setConditionalStyles(styleObjs = []) {
    this.conditionalStyles = styleObjs;
  }

  /**
   * @param {StyleObj} styleObj
   */
  addConditionalStyle(styleObj) {
    if (!(styleObj instanceof StyleObj)) {
      throw new TypeError("LayerStyleContainer.addConditionalStyle attend une instance de StyleObj");
    }
    this._conditionalStyleContainers.push(new StyleContainer({ styleObj }));
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * 
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer layer 
   * @param {'Point'|'LineString'|'Polygon'} type Type de géométrie
   * @returns {StyleObj} Objet de type StyleObj
   * @private
   */
  #getStyleObj(layer, type) {
    const names = {
      "Point": "Point (défaut)",
      "LineString": "Ligne (défaut)",
      "Polygon": "Surface (défaut)",
    };

    /** 
     * Regex des propriétés flat-style à garder
     * pour chaque type de géométrie.
     */
    const geomRegexProperties = {
      "Point": [/^point/, /^symbol/, /^text/],
      "LineString": [/^line/, /^stroke/, /^text/],
      "Polygon": [/^fill/, /pattern/, /^text/],
    };

    const style = layer.getIgnStyle(true);
    const flatStyle = ignStyleToFlatStyle(style);

    // Filtre seulement les propriétés passant les expressions régulières
    const obj = Object.entries(flatStyle).filter(([key]) => {
      const regexes = geomRegexProperties[type];
      return regexes.some((regex) => regex.test(key));
    });

    // Recréé le flatStyle correspondant
    const flatStyleGeom = Object.fromEntries(obj);

    const styleObj = new StyleObj({
      name: names[type],
      default: true,
      type: type,
      flatStyle: flatStyleGeom
    });

    return styleObj;
  }
}

export default LayerStyleContainer;
