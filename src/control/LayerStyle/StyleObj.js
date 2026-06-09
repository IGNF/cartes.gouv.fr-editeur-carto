import Condition from "./Condition.js";
import { flatToIgnStyle } from "../StyleDialog/styleToFlatStyle.js";
import BaseObject from "ol/Object.js";
import { toContext } from "ol/render.js";
import Feature from "ol/Feature.js";
import { LineString, Point, Polygon } from "ol/geom.js";
import { getStyleFn } from "mcutils/style/ignStyleFn.js";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";
import Collection from "ol/Collection.js";

/**
 * @typedef {Object} StyleObjOptions
 * @property {String} name Nom du style.
 * @property {"Point"|"LineString"|"Polygon"} type Type d'objet sur lequel le style s'applique.
 * @property {Boolean} [default=false] Si vrai, considère que c'est un style par défaut. Sinon, permet la modification.
 * @property {StyleObjConditionOptions} [conditions] Objet contenant les conditions.
 * @property {Object} [flatStyle={}] FlatStyle correspondant à l'objet
 */

/**
 * @typedef {Object} StyleObjCondition Conditions contenu dans le styleObj
 * @property {Boolean} [all=true] Si vrai, la condition s'applique sur l'ensemble des mots.
 * @property {Collection<Condition>} conditions Ensemble des conditions s'appliquant au style.
 * Les conditions peuvent être des objets {@link ./Condition.js | Condition}
 * ou un objet js la décrivant.
 * Elles sont liées par la clause `AND`.
 * @property {Boolean} [usecase=false] Si vrai, la condition est sensible à la casse.
 */


/**
 * @typedef {Object} StyleObjConditionOptions Objet utilisé à la construction de l'objet StyleObj
 * @property {Boolean} [all=true] Si vrai, la condition s'applique sur l'ensemble des mots.
 * @property {Array<Condition|SingleCondition>} conditions Ensemble des conditions s'appliquant au style.
 * Les conditions peuvent être des objets {@link ./Condition.js | Condition} ou un objet js
 * la décrivant.
 * Elles sont liées par la clause `AND`.
 * @property {Boolean} [usecase=false] Si vrai, la condition est sensible à la casse.
 */

/**
 * @typedef {Object} SingleCondition Objet décrivant une condition
 * @property {String} attr Attribut sur lequel la condition s'applique
 * @property {String} op Opérateur 
 * @property {String} val Valeur avec laquelle comparer
 */

/**
 * @typedef {Object} StyleObjImageOptions
 * @property {Array<Number>} [size=[48,48]] Taille [largeur, hauteur] du canvas
 * @property {Number} [margin=0] Marge de dessin autour de la géométrie
 * 
 * @property {Boolean} [clone = false] Si vrai, clone le canvas
 * @property {Boolean} [force = false] Si vrai, force l'image à se mettre à jour
 */

/**
 * Fonction permettant de normaliser les options pour dessiner
 * sur un canvas
 * @param {StyleObjImageOptions} [options] Options à normaliser
 * @returns {{ size: Array<Number>, margin: Number }} Options normalisées
 */
function normalizeImageOptions(options = {}) {
  const normalizedSize = Array.isArray(options.size) && options.size.length === 2
    ? options.size
    : [48, 48];
  const normalizedMargin = Number.isFinite(options.margin) ? options.margin : 0;
  return {
    size: normalizedSize,
    margin: normalizedMargin,
  };
}

/**
 * @param {{ size: Array<Number>, margin: Number }|null} previous
 * @param {{ size: Array<Number>, margin: Number }} next
 * @returns {Boolean}
 */
function isSameImageOptions(previous, next) {
  if (!previous) {
    return false;
  }
  return previous.margin === next.margin
    && previous.size[0] === next.size[0]
    && previous.size[1] === next.size[1];
}

/**
 * Objet permettant d'enregistrer un style avec zéro à plusieurs conditions.
 */
class StyleObj extends BaseObject {

  /**
  * @param {StyleObjOptions} options
   */
  constructor(options = {}) {
    super();
    const {
      name,
      type,
      default: isDefault = false,
      conditions = [],
      flatStyle = {},
    } = options;

    this.set("default", Boolean(isDefault));
    const canvas = document.createElement("canvas");
    canvas.id = SelectorID.generate();
    this.set("image", canvas);
    this._imageOptions = {};
    this.name = name;
    this.type = type;
    this.setConditions(conditions);
    this.setFlatStyle(flatStyle, true);
  }

  get name() {
    return this.get("name");
  }

  set name(value) {
    if (this.isDefault && this.get("name") !== undefined && this.get("name") !== value) {
      throw new Error("Le nom d'un style par défaut ne peut pas être modifié");
    }
    this.set("name", value);
  }

  get type() {
    return this.get("type");
  }

  set type(value) {
    const type = this.type;
    this.set("type", value);
    if (type !== value) {
      const options = Object.assign(this._imageOptions, { force: true });
      this.getImage(options);
    }
  }

  get isDefault() {
    return this.get("default") === true;
  }

  /**
   * @param {Boolean} value Vrai si l'objet est un style par défaut
   */
  set isDefault(value) {
    this.set("default", Boolean(value));
  }

  /**
   * @returns {StyleObjCondition}
   */
  get conditions() {
    return this.get("conditions");
  }

  /**
   * @param {StyleObjConditionOptions} condition Objet avec les conditions de l'objet
   */
  set conditions(condition) {
    this.setConditions(condition);
  }

  /**
   * Renvoie une copie du flatStyle ou une propriété.
   * @param {String} [flatStyleProperty] Si donné, renvoie la valeur correspondante.
   * @returns {Object|any} Valeur d'une propriété flatStyle ou copie de l'objet flatStyle.
   */
  getFlatStyle(flatStyleProperty) {
    const flatStyle = this.get("flatStyle") || {};
    if (flatStyleProperty === undefined) {
      return { ...flatStyle };
    }
    return flatStyle[flatStyleProperty];
  }

  /**
   * Modifie une propriété du flatStyle.
   * 
   * @param {String} prop Propriété flatStyle
   * @param {any} value Valeur correspondante
   */
  setFlatStyleProperty(prop, value) {
    this.setFlatStyle({ [prop]: value });
  }

  /**
   * Modifie le flatStyle.
   * 
   * @param {Object} flatStyle Objet flatStyle
   * @param {Boolean} [reset=false] Si vrai, modifie l'entièreté du flatStyle.
   * Sinon, ajoute les propriétés au flatStyle actuel
   */
  setFlatStyle(flatStyle, reset = false) {
    if (!flatStyle || typeof flatStyle !== "object" || Array.isArray(flatStyle)) {
      throw new TypeError("flatStyle doit être un objet");
    }
    const currentFlatStyle = this.get("flatStyle") || {};
    this.set("flatStyle", reset ? { ...flatStyle } : { ...currentFlatStyle, ...flatStyle });

    const options = Object.assign(this._imageOptions, { force: true });
    this.getImage(options);
  }

  /**
   * @param {StyleObjConditionOptions} conditions
   */
  setConditions(conditions) {
    // Récupère les informations
    const all = conditions.all !== undefined ? !!conditions.all : true;
    const usecase = conditions.usecase !== undefined ? !!conditions.usecase : false;
    const cond = conditions.conditions || [];
    let conditionsObject = cond;
    if (!(cond instanceof Collection)) {
      /** @type {Collection<Condition>} */
      conditionsObject = new Collection();

      cond.forEach(element => {
        let condition = element;
        if (!(element instanceof Condition)) {
          // Transforme les conditions en objet Condition si nécessaire
          condition = new Condition({
            attribute: element.attr,
            operator: element.op,
            value: element.val,
          });
        }
        conditionsObject.push(condition);
      });
    }
    const obj = {
      all: all,
      conditions: conditionsObject,
      usecase: usecase
    }
    this.set("conditions", obj);
  }

  /**
   * Ajoute une condition 
   * @param {Condition|import("./Condition.js").ConditionOptions} condition
   * Condition à ajouter
   */
  addCondition(condition) {
    this.setConditions([...this.conditions, this._toCondition(condition)]);
  }

  /**
   * @param {Number} index
   */
  removeCondition(index) {
    const currentConditions = this.conditions;
    if (!Number.isInteger(index) || index < 0 || index >= currentConditions.length) {
      return;
    }
    currentConditions.splice(index, 1);
    this.setConditions(currentConditions);
  }

  /**
   * @param {Object} feature
   * @returns {Boolean}
   */
  isValidForFeature(feature) {
    return this.conditions.every((condition) => condition.isValid(feature));
  }

  /**
   * Dessine (ou redessine) une représentation canvas du style courant.
   * @param {StyleObjImageOptions} [options]
   * @returns {HTMLCanvasElement|null}
   */
  drawImage(options = {}) {
    // Récupère les options de dessin pour l'image
    const imageOptions = normalizeImageOptions(options);
    const [width, height] = imageOptions.size;
    const margin = Math.max(0, imageOptions.margin);
    const canvas = this.get("image");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const vectorContext = toContext(ctx, { size: [width, height] });

    const cx = width / 2;
    const cy = height / 2;
    const sx = Math.max(1, cx - margin);
    const sy = Math.max(1, cy - margin);

    // Créé la feature
    let feature;
    switch (this.type) {
      case 'Point':
        feature = new Feature(new Point([cx, cy]));
        break;
      case 'LineString':
        feature = new Feature(new LineString([[cx - sx, cy], [cx + sx, cy]]));
        break;
      case 'Polygon':
        feature = new Feature(new Polygon([[[cx - sx, cy - sy], [cx + sx, cy - sy], [cx + sx, cy + sy], [cx - sx, cy + sy], [cx - sx, cy - sy]]]));
        break;
      default:
        this._imageOptions = imageOptions;
        this.set("image", canvas);
        return canvas;
    }

    // Applique le flatStyle et récupère le style openlayers
    feature.setStyle(getStyleFn());
    const flatStyle = flatToIgnStyle(this.getFlatStyle());
    feature.setIgnStyle(flatToIgnStyle(this.getFlatStyle()));

    let style = feature.getStyle();
    if (typeof style === "function") {
      style = style(feature);
    }
    if (!Array.isArray(style)) {
      style = [style];
    }

    // Dessine sur le canvas
    ctx.save();
    style.forEach(s => {
      ctx.save();
      vectorContext.setStyle(s);
      vectorContext.drawGeometry(feature.getGeometry());
      ctx.restore();
    })

    ctx.restore();

    this._imageOptions = imageOptions;
    this.set("image", canvas);
    return canvas;
  }

  /**
   * Retourne une représentation canvas du style courant.
   * @param {StyleObjImageOptions} [options] Options pour l'image
   * @returns {HTMLCanvasElement|null}
   */
  getImage(options = {}) {
    const imageOptions = normalizeImageOptions(options);
    let image = this.get("image");
    if (!image || !isSameImageOptions(this._imageOptions, imageOptions) || options.force === true) {
      image = this.drawImage(imageOptions);
    }
    // clone l'image
    if (options.clone) {
      const img = document.createElement('canvas');
      img.width = image.width;
      img.height = image.height;
      img.getContext('2d').drawImage(image, 0, 0);
      return img;
    }
    return image;
  }

  /**
   * @private
   */
  _toCondition(condition) {
    if (condition instanceof Condition) {
      return condition;
    }
    return new Condition(condition);
  }

  /**
   * Clone un objet styleObj
   * @returns {StyleObj} Nouvel objet styleObj copié
   */
  clone() {
    return new StyleObj({
      name: this.name,
      type: this.type,
      default: this.isDefault,
      conditions: this.conditions,
      flatStyle: this.getFlatStyle(),
    })
  }
}

export default StyleObj;