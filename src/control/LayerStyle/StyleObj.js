import Condition from "./Condition";
import { flatToIgnStyle } from "../StyleDialog/styleToFlatStyle.js";
import BaseObject from "ol/Object.js";
import { toContext } from "ol/render.js";
import Feature from "ol/Feature.js";
import { LineString, Point, Polygon } from "ol/geom";
import { getStyleFn } from "mcutils/style/ignStyleFn";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";

/**
 * @typedef {Object} StyleObjOptions
 * @property {String} name
 * @property {String} type
 * @property {Boolean} [default=false]
 * @property {Array<Condition|Object>} [conditions=[]]
 * @property {Object} [flatStyle={}]
 */

/**
 * @typedef {Object} StyleObjImageOptions
 * @property {Array<Number>} [size=[48,48]] Taille [largeur, hauteur] du canvas
 * @property {Number} [margin=0] Marge de dessin autour de la géométrie
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
    this._imageOptions = null;
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
    this.set("type", value);
  }

  get isDefault() {
    return this.get("default") === true;
  }

  set isDefault (value) {
    this.set("default", Boolean(value));
  }

  get conditions() {
    return [...(this.get("conditions") || [])];
  }

  set conditions(value) {
    this.setConditions(value);
  }

  /**
   * @param {String} [flatStyleProperty]
   * @returns {Object}
   */
  getFlatStyle(flatStyleProperty) {
    const flatStyle = this.get("flatStyle") || {};
    if (flatStyleProperty === undefined) {
      return { ...flatStyle };
    }
    return flatStyle[flatStyleProperty];
  }

  /**
   * @param {String} prop
   * @param {*} value
   */
  setFlatStyleProperty(prop, value) {
    this.setFlatStyle({ [prop]: value });
  }

  /**
   * @param {Object} flatStyle Objet flatStyle
   * @param {Boolean} [reset=false]
   */
  setFlatStyle(flatStyle, reset = false) {
    if (!flatStyle || typeof flatStyle !== "object" || Array.isArray(flatStyle)) {
      throw new TypeError("flatStyle doit être un objet");
    }
    const currentFlatStyle = this.get("flatStyle") || {};
    this.set("flatStyle", reset ? { ...flatStyle } : { ...currentFlatStyle, ...flatStyle });
    this.drawImage();
  }

  /**
   * @param {Array<Condition|Object>} conditions
   */
  setConditions(conditions = []) {
    if (!Array.isArray(conditions)) {
      throw new TypeError("conditions doit être un tableau");
    }
    this.set("conditions", conditions.map((condition) => this._toCondition(condition)));
  }

  /**
   * @param {Condition|Object} condition
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
        feature = new Feature(new Point([cx, canvas.height - 4]));
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
   * @param {StyleObjImageOptions} [options]
   * @param {Boolean} [clone=false] Si vrai, clone le canvas
   * @returns {HTMLCanvasElement|null}
   */
  getImage(options = {}, clone = false) {
    const imageOptions = normalizeImageOptions(options);
    let image = this.get("image");
    if (!image || !isSameImageOptions(this._imageOptions, imageOptions)) {
      image = this.drawImage(imageOptions);
    }
    // clone l'image
    if (clone) {
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
  _invalidateImage() {
    // this.set("image", null);
    this._imageOptions = null;
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
}

export default StyleObj;