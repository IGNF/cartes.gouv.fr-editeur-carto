import BaseObject from "ol/Object.js";
import StyleObj from "./StyleObj.js";
import StyleContainer from "./StyleContainer.js";
import BaseVector from "ol/layer/BaseVector.js";
import { unByKey } from 'ol/Observable.js';
import VectorStyle from "mcutils/layer/VectorStyle.js";
import { flatToIgnStyle, ignStyleToFlatStyle } from "../StyleDialog/styleToFlatStyle.js";
import { Collection } from "ol";
import Sortable from "sortablejs";

import "./LayerStyleContainer.scss";
import SymbolLib from "mcutils/style/SymbolLib.js";

// À voir si utilisation de @typedef {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} pour l'objet Layer

/**
 * @typedef {import('mcutils/layer/VectorStyle.js').default} Layer Couche openlayers
 */

/**
 * @typedef {Object} VectorStyleConditionStyle Condition obtenue par la méthode `VectorStyle.getConditionStyles()`
 * @property {String} title Couche OpenLayers à styliser
 * @property {import("./StyleObj.js").StyleObjCondition} condition Objet contenant les conditions pour le symbole
 * @property {import("mcutils/style/SymbolLib.js").default} symbol Symbole appliqué à ce style
 */

/**
 * @typedef {Object} LayerStyleContainerOptions
 * @property {Layer} layer Couche OpenLayers à styliser
 * @property {String} [className] Classe CSS racine du conteneur
 */

/**
 * @classdesc
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
   */
  _initialize() {
    /** @type {Collection<StyleContainer> } */
    this.styles = new Collection([], { unique: true });
    /** @type {Collection<StyleObj> } */
    this.conditionalStyles = new Collection([], { unique: true });
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

    const defaultStyleContainer = document.createElement("div");
    defaultStyleContainer.classList.add("layer-styles-container__default-styles");

    const conditionalStylesContainer = document.createElement("div");
    conditionalStylesContainer.classList.add("layer-styles-container__conditional-styles");

    container.appendChild(conditionalStylesContainer);
    container.appendChild(defaultStyleContainer);

    this.element = container;

    return container;
  }

  /**
   * Retourne le conteneur de styles par défaut
   * @returns {HTMLDivElement} Conteneur de styles par défaut
   * @private
   */
  _getDefaultStylesContainer() {
    return this.element.querySelector(".layer-styles-container__default-styles")
  }

  /**
   * Retourne le conteneur de styles conditionnels
   * @returns {HTMLDivElement} Conteneur de styles conditionnels
   * @private
   */
  _getConditionalStylesContainer() {
    return this.element.querySelector(".layer-styles-container__conditional-styles")
  }

  /**
   * Initialise les événements sur le contrôle.
   * @protected
   */
  _initEvents() {
    // À l'ajout d'un style, on écoute différents événements
    this.styles.on("add", (e) => {
      // Ouverture du style (dispatchEvent : géré au niveau de l'action)
      let key = e.element.on("open-style", (e) => this.dispatchEvent(e));
      // Enregistre la clé pour pouvoir supprimer l'événement ensuite
      this.stylesObjsKey[e.element.ol_uid] ??= {};
      this.stylesObjsKey[e.element.ol_uid]["open-style"] = key;

      // Suppression du style
      key = e.element.on("delete-style", (e) => this.onDeleteStyle(e));
      // Enregistre la clé pour pouvoir supprimer l'événement ensuite
      this.stylesObjsKey[e.element.ol_uid]["delete-style"] = key;
    });


    // Suppression d'un style
    this.styles.on("remove", (e) => {
      // Supprime tous les écouteurs d'événements
      Object.keys(this.stylesObjsKey[e.element.ol_uid]).forEach(event => {
        unByKey(this.stylesObjsKey[e.element.ol_uid][event])
      });

      // Enlève l'élément du DOM
      e.element.getElement().remove();

      // TODO : ne pas le faire si on souhaite avoir un ctrl-Z / retour arrière
      delete e.element;
    });

    // Ajout de style conditionnel
    this.conditionalStyles.on("add", (e) => {
      console.log("add conditional style", e);
      // Ajoute un écouteur d'événement générique
      // Envoyé par le bouton appliquer
      let key = e.element.on("change", (e) => this.onStyleObjChange(e));

      this.stylesObjsKey[e.element.ol_uid] ??= {};
      this.stylesObjsKey[e.element.ol_uid]["change"] = key;

      key = e.element.on("change:name", (e) => {
        this._setConditionStyle(this.conditionalStyles.getArray());
      });
      this.stylesObjsKey[e.element.ol_uid]["change:name"] = key;

      this._setConditionStyle(this.conditionalStyles.getArray());
    })

    this.conditionalStyles.on("remove", (e) => {
      console.log("remove conditional style", e);
      this._setConditionStyle(this.conditionalStyles.getArray());
    })

    this._createDraggableElement(this._getConditionalStylesContainer());
  }

  /**
   * Méthode appelée au changement de l'objet styleObj
   * @param {import("ol/events/Event.js").default} e Événement openlayer
   */
  onStyleObjChange(e) {
    /** @type {StyleObj} */
    const elem = e.target;
    console.log(this);
  }

  /**
   * Méthode appelée à la suppression d'un style conditionnel
   * @param {import("ol/events/Event.js").default} e Événement openlayer
   */
  onDeleteStyle(e) {
    const elem = e.target;
    if (elem instanceof StyleContainer) {

      const removed = this.conditionalStyles.remove(elem.getStyleObj());
      const removedStyle = this.styles.remove(elem);
      if (removed === undefined) {
        console.warn("style obj non trouvé dans conditional styles", elem, this.conditionalStyles)
      }
      if (removedStyle === undefined) {
        console.warn("style obj non trouvé", elem, this.conditionalStyles)
      }
    } else {
        console.warn("style obj est un style par défaut", elem)
    }
  }

  /**
   * Modifie le style conditionnel d'une couche
   * @param {Array<StyleObj>} conditions 
   */
  _setConditionStyle(styles) {
    // Transforme les conditions en objet exploitables par la couche
    const conditions = [];
    styles.forEach(style => {
      const condition = {
        title: style.name,
        condition: style.conditions,
        symbol: new SymbolLib({
          name: style.name,
          type: style.type,
          style: flatToIgnStyle(style.getFlatStyle())
        })
      };
      conditions.push(condition)
    })

    // Transforme les styles en objet correspondant au layer
    this.getLayer().setConditionStyle(conditions);
    this.getLayer().getSource().changed();
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
    Sortable.create(elementDraggable, {
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
   * @param {Layer} layer
   */
  setLayer(layer) {
    this.set("layer", layer);
    this.clearContent();
    if (layer instanceof BaseVector || layer instanceof VectorStyle) {
      this.addLayerStyles(layer);
    }
  }

  /**
   * @private
   * @param {Layer} layer
   */
  addLayerStyles(layer) {
    // Récupère les styles avant de vider les collections
    const result = this.getLayerStyle(layer);
    this.conditionalStyles.clear();
    this.styles.clear();
    result.defaultStyles.forEach((styleObj) => {
      const styleContainer = new StyleContainer({ layer: layer, styleObj: styleObj });
      this.styles.push(styleContainer);
      const element = styleContainer.getElement();
      this._getDefaultStylesContainer().appendChild(element);
    });

    result.conditionalStyles.forEach((styleObj) => {
      const styleContainer = new StyleContainer({ layer: layer, styleObj: styleObj });
      this.styles.push(styleContainer);
      // Ajoute aussi au styles conditionnels
      // Passe par la méthode 
      this.conditionalStyles.push(styleObj);
      const element = styleContainer.getElement();
      this._getConditionalStylesContainer().appendChild(element);
    });
  }

  /**
   * Enlève les styles par défaut / conditionnels
   */
  clearContent() {
    this._getDefaultStylesContainer().replaceChildren();
    this._getConditionalStylesContainer().replaceChildren();
  }

  /**
   * Retourne la couche en cours d'utilisation
   * @returns {Layer|null}
   */
  getLayer() {
    return this.get("layer") || null;
  }

  /**
   * Récupère les styles d'une couche.
   * 
   * @param {Layer} layer
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
   * @param {Layer} layer
   * Couche sur laquelle récupérer les styles par défauts
   * @returns {Array<StyleObj>} Tableau de styles par défaut
   * @private
   */
  _getDefaultStyles(layer) {
    // TODO : récupérer les styles par défauts
    if (!layer) {
      return [];
    }
    // Enregistre les styles par défaut
    const ptStyleObj = this._defaultPointStyle = this.#getStyleObj(layer, "Point");
    const lineStyleObj = this._defaultLineStringStyle = this.#getStyleObj(layer, "LineString");
    const polyStyleObj = this._defaultPolygonStyle = this.#getStyleObj(layer, "Polygon");

    return [ptStyleObj, lineStyleObj, polyStyleObj];
  }

  /**
   * Récupère les styles conditionnels d'une couche
   * 
   * @param {Layer} layer
   * Couche sur laquelle récupérer les styles conditionels
   * @returns {Array<StyleObj>} Tableau de styles par défaut
   * @private
  */
  _getConditionalStyles(layer) {
    // Récupère les styles conditionnels
    /** @type {Array<VectorStyleConditionStyle>} */
    const conditionsStyles = layer.getConditionStyle();
    const styles = [];
    // Les transforme en objet StyleObj
    conditionsStyles.forEach(style => {
      const title = style.title;
      const conditions = style.condition;
      const type = style.symbol?._type || "Point";
      const ignStyle = style.symbol?.getIgnStyle() || {};

      const styleObj = new StyleObj({
        name: title,
        conditions: conditions,
        type: type,
        flatStyle: ignStyleToFlatStyle(ignStyle),
      });

      styles.push(styleObj);
    })
    return styles
  }

  /**
   * Ajoute un style conditionnel.
   * Peut se baser sur un style existant, sinon se base sur le style par défaut de la couche
   * 
   * @param {StyleObj} [styleObj] Si donné, le prend en référence.
   * Sinon, se base sur le style par défaut de la couche.
   */
  addConditionalStyle(styleObj) {
    if (!(styleObj instanceof StyleObj)) {
      styleObj = this.#getStyleObj(this.getLayer());
    }
    const styleContainer = new StyleContainer({ layer: this.getLayer(), styleObj: styleObj });
    this.styles.push(styleContainer);
    const element = styleContainer.getElement();
    this._getConditionalStylesContainer().appendChild(element);

    this.conditionalStyles.push(styleObj);
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * 
   * @param {Layer} layer layer 
   * @param {'Point'|'LineString'|'Polygon'} type Type de géométrie
   * @returns {StyleObj} Objet de type StyleObj
   * @private
   */
  #getStyleObj(layer, type) {
    // Nom du style
    const names = {
      "Point": "Point (défaut)",
      "LineString": "Ligne (défaut)",
      "Polygon": "Surface (défaut)",
    };

    // Récupère le style et le transforme en flatStyle
    const style = layer.getIgnStyle(true);
    const flatStyle = ignStyleToFlatStyle(style);

    let flatStyleGeom = {};

    // Donne le styleObj de la couche selon un type
    if (type) {
      /** 
       * Regex des propriétés flat-style à garder
       * pour chaque type de géométrie.
       */
      const geomRegexProperties = {
        "Point": [/^point/, /^symbol/, /^text/],
        "LineString": [/^line/, /^stroke/, /^text/],
        "Polygon": [/^fill/, /pattern/, /^text/],
      };
      // Filtre seulement les propriétés passant les expressions régulières
      const obj = Object.entries(flatStyle).filter(([key]) => {
        const regexes = geomRegexProperties[type];
        return regexes.some((regex) => regex.test(key));
      });
      flatStyleGeom = Object.fromEntries(obj);
    }
    // Sinon, renvoie un objet pour la couche
    // (nécessaire pour l'ajout de style conditionnel)
    else {
      flatStyleGeom = flatStyle;
    }

    // Récupère le nom
    const name = names[type] ? names[type] : "Nouveau style";

    // Style par défaut seulement si un style est donné
    const isDefault = type ? true : false;
    type ??= "Point";

    const styleObj = new StyleObj({
      name: name,
      default: isDefault,
      type: type,
      flatStyle: flatStyleGeom
    });

    return styleObj;
  }
}

export default LayerStyleContainer;
