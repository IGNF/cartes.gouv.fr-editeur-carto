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
import { toMcutilsOperator } from "./ConditionalOperator.js";

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

    /** Id utilisé pour le drag n drop */
    this._sortableId = 0;
    /**
     * Regex des propriétés flat-style à garder
     * pour chaque type de géométrie.
     */
    this._geomRegexProperties = {
      "Point": [/^point/, /^symbol/, /^text/],
      "LineString": [/^line/, /^stroke/, /^text/],
      "Polygon": [/^fill/, /pattern/, /^text/],
    };
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

      // Demande de déplacement clavier
      key = e.element.on("move-style", (e) => this.onMoveStyle(e));
      this.stylesObjsKey[e.element.ol_uid]["move-style"] = key;
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
      // Ajoute un écouteur d'événement générique
      // Envoyé par le bouton appliquer
      let key = e.element.on("change", () => {
        this._setConditionStyle(this.conditionalStyles.getArray())
      });

      this.stylesObjsKey[e.element.ol_uid] ??= {};
      this.stylesObjsKey[e.element.ol_uid]["change"] = key;

      key = e.element.on("change:name", () => {
        this._setConditionStyle(this.conditionalStyles.getArray());
      });
      this.stylesObjsKey[e.element.ol_uid]["change:name"] = key;

      this._setConditionStyle(this.conditionalStyles.getArray());
    })

    this.conditionalStyles.on("remove", () => {
      this._setConditionStyle(this.conditionalStyles.getArray());
    })

    this._createDraggableElement(this._getConditionalStylesContainer());
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
        console.warn("style obj non trouvé dans conditional styles", elem, this.conditionalStyles);
      }
      if (removedStyle === undefined) {
        console.warn("style obj non trouvé", elem, this.conditionalStyles);
      }
    } else {
      console.warn("style obj est un style par défaut", elem);
    }
  }

  /**
   * Transforme des conditions style obj en conditions macarte
   * @param {import("./StyleObj.js").StyleObjCondition} condition Conditions de style obk
   * @returns Condition au format macarte
   */
  conditionToIgnCondition(condition) {
    const result = {
      all: condition.all,
      usecase: condition.usecase,
      conditions: []
    };

    condition.conditions.forEach(cond => {
      result.conditions.push({
        attr: cond.attribute,
        op: toMcutilsOperator(cond.operator),
        val: cond.value,
      });
    });

    return result;
  }

  /**
   * Modifie le style conditionnel d'une couche
   * @param {Array<StyleObj>} styles 
   */
  _setConditionStyle(styles) {
    // Transforme les conditions en objet exploitables par la couche
    const conditions = [];
    styles.forEach(style => {
      const condition = {
        title: style.name,
        condition: this.conditionToIgnCondition(style.conditions),
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
    this._sortable = Sortable.create(elementDraggable, {
      handle: handleClass,
      dataIdAttr: "data-sortable-id", // required to calculate the custom sort
      draggable: ".style-container",
      filter: ".not-draggable",
      animation: 200,
      // Call event function on drag and drop
      onEnd: (e) => {
        this._onEndDragElement(e);
      }
    });
  }

  /**
   * Méthode appelée suite à la modification d'ordre des couches
   * @param {import("sortablejs").SortableEvent} e Événement envoyé à la fin de l'événement
   */
  _onEndDragElement(e) {
    // Indices sont les mêmes : on ne fait rien
    if (e.oldIndex !== e.newIndex) {
      const item = this.styles.item(e.oldIndex);
      this.styles.getArray().splice(e.oldIndex, 1);
      this.styles.getArray().splice(e.newIndex, 0, item);

      const condition = this.conditionalStyles.item(e.oldIndex);
      this.conditionalStyles.getArray().splice(e.oldIndex, 1);
      this.conditionalStyles.getArray().splice(e.newIndex, 0, condition);
      this._setConditionStyle(this.conditionalStyles.getArray());
    }
  }

  /**
   * Méthode appelée à la demande de déplacement d'un style.
   * @param {import("./StyleContainer.js").StyleContainerMoveEvent} e Événement openlayers
   */
  onMoveStyle(e) {
    // Éléments sur lequel on vient de cliquer
    const oppositeDirection = e.direction === "down" ? "up" : "down";
    const moveElement = e.target.getElement()?.querySelector(`[data-direction=${e.direction}]`);
    const oppositeMoveElement = e.target.getElement()?.querySelector(`[data-direction=${oppositeDirection}]`);

    // Attribut pour réorganiser après
    const sortableId = e.target.getElement().dataset.sortableId;
    const order = this._sortable.toArray();
    const index = order.indexOf(sortableId);

    // Retrait de l'objet à déplacer
    order.splice(index, 1);

    // Déplace la couche à la bonne position
    if (e.direction === "down") {
      order.splice(index + 1, 0, sortableId);
    } else if (e.direction === "up") {
      order.splice(index - 1, 0, sortableId);
    }

    // Applique l'opéaration de tri
    this._sortable.sort(order, true);
    const newIndex = order.indexOf(sortableId)
    const oldIndex = e.direction === "down" ? newIndex - 1 : newIndex + 1;
    // Change le zindex et envoie l'événement
    this._onEndDragElement({
      newIndex: newIndex,
      oldIndex: oldIndex
    });

    // Change le focus dans le cas où c'est le premier / dernier élément
    if (window.getComputedStyle(moveElement).visibility == "hidden") {
      oppositeMoveElement.focus();
    } else {
      moveElement.focus();
    }
    // return true;
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
      this.styles.insertAt(0, styleContainer);
      const element = styleContainer.getElement();
      this._getDefaultStylesContainer().prepend(element);
    });

    result.conditionalStyles.forEach((styleObj) => {
      const styleContainer = new StyleContainer({ layer: layer, styleObj: styleObj });
      this.styles.insertAt(0, styleContainer);
      // Ajoute aussi au styles conditionnels
      this.conditionalStyles.insertAt(0, styleObj);
      styleContainer.getElement().dataset.sortableId = this._sortableId++;
      const element = styleContainer.getElement();
      this._getConditionalStylesContainer().prepend(element);
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
    const polyStyleObj = this._defaultPolygonStyle = this.#getStyleObj(layer, "Polygon");
    const lineStyleObj = this._defaultLineStringStyle = this.#getStyleObj(layer, "LineString");
    const ptStyleObj = this._defaultPointStyle = this.#getStyleObj(layer, "Point");

    return [polyStyleObj, lineStyleObj, ptStyleObj];
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

      styles.unshift(styleObj);
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
    // Ajoute le conteneur à la collection
    this.styles.insertAt(0, styleContainer);
    const element = styleContainer.getElement();

    this.conditionalStyles.insertAt(0, styleObj);
    this._getConditionalStylesContainer().prepend(element);
    styleContainer.getElement().dataset.sortableId = this._sortableId++;

    // Ouvre le conteneur de style
    styleContainer.openStyle();
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
      // Applique les valeurs par défaut pour les pointTextValue etc.
      const textRegex = ["text-value", "text-fill-color", "text-size"];

      // Valeurs différentes pour chaque type
      const flatStyleType = {
        "Point": "point",
        "LineString": "line",
        "Polygon": "fill",
      };

      textRegex.forEach(text => {
        flatStyle[`${flatStyleType[type]}-${text}`] = flatStyle[text] || '';
      });

      // Filtre seulement les propriétés passant les expressions régulières
      const obj = Object.entries(flatStyle).filter(([key]) => {
        const regexes = this._geomRegexProperties[type];
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
