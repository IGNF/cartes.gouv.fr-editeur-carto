import Condition from "./Condition.js";
import { flatToIgnStyle } from "../StyleDialog/styleToFlatStyle.js";
import BaseObject from "ol/Object.js";
import { toContext } from "ol/render.js";
import Feature from "ol/Feature.js";
import { LineString, Point, Polygon } from "ol/geom.js";

import { extend } from 'ol/extent.js'
import { getStyleFn } from "mcutils/style/ignStyleFn.js";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";
import Collection from "ol/Collection.js";

/**
 * @typedef {Object} StyleObjOptions
 * @property {String} name Nom du style.
 * @property {"Point"|"LineString"|"Polygon"} type Type d'objet sur lequel le style s'applique.
 * @property {Boolean} [small=true] Si vrai, utilise une visualisation compacte
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
 * @property {Array<Number>} [size] Taille [largeur, hauteur] du canvas.
 * Si absente, la taille par défaut dépend du mode `small`.
 * @property {Number} [margin=0] Marge de dessin autour de la géométrie
 * @property {Boolean} [small=true] Si vrai, utilise une visualisation compacte
 * @property {Boolean} [displayText=false] Si faux, masque le texte/label de la prévisualisation
 * 
 * @property {Boolean} [clone = false] Si vrai, clone le canvas
 * @property {Boolean} [force = false] Si vrai, force l'image à se mettre à jour
 */

/**
 * Fonction permettant de normaliser les options pour dessiner
 * sur un canvas
 * @param {StyleObjImageOptions} [options] Options à normaliser
 * @param {Boolean} [defaultSmall=true] Valeur small par défaut
 * @returns {{ size: Array<Number>, margin: Number, small: Boolean, displayText: Boolean }} Options normalisées
 */
function normalizeImageOptions(options = {}, defaultSmall = true) {
  // Les valeurs par défaut dépendent du mode d'affichage (small / large).
  const defaultSize = options.small === true ? [48, 48] : [80, 80];
  const defaultMargin = options.small === true ? 8 : 4;
  const normalizedSize = Array.isArray(options.size) && options.size.length === 2
    ? options.size
    : defaultSize;
  const normalizedMargin = Number.isFinite(options.margin) ? options.margin : defaultMargin;
  const normalizedSmall = options.small === undefined
    ? Boolean(defaultSmall)
    : options.small !== false;
  const normalizedDisplayText = options.displayText === true ? true : false;
  return {
    size: normalizedSize,
    margin: normalizedMargin,
    small: normalizedSmall,
    displayText: normalizedDisplayText,
  };
}

/**
 * @param {{ size: Array<Number>, margin: Number, small: Boolean, displayText: Boolean }|null} previous
 * @param {{ size: Array<Number>, margin: Number, small: Boolean, displayText: Boolean }} next
 * @returns {Boolean}
 */
function isSameImageOptions(previous, next) {
  if (!previous) {
    return false;
  }
  return previous.margin === next.margin
    && previous.small === next.small
    && previous.displayText === next.displayText
    && previous.size[0] === next.size[0]
    && previous.size[1] === next.size[1];
}

/**
 * Calcule le centre ajusté pour un point en tenant compte de l'ancre de l'image de style,
 * de sorte que le symbole soit centré visuellement dans le canvas.
 * @param {Array<import("ol/style/Style.js").default>} styles
 * @param {Number} cx Centre X de base
 * @param {Number} cy Centre Y de base
 * @returns {{ cx: Number, cy: Number }}
 */
function computeCenteredPoint(styles, cx, cy) {
  let extent = null;
  styles.forEach(s => {
    const img = s.getImage?.();
    if (img?.getAnchor) {
      const anchor = img.getAnchor();
      if (anchor) {
        const si = img.getSize();
        if (si) {
          const dx = anchor[0] - si[0];
          const dy = anchor[1] - si[1];
          if (!extent) {
            extent = [dx, dy, dx + si[0], dy + si[1]];
          } else {
            extend(extent, [dx, dy, dx + si[0], dy + si[1]]);
          }
        }
      }
    }
  });
  if (extent) {
    return {
      cx: cx + (extent[2] + extent[0]) / 2,
      cy: cy + (extent[3] + extent[1]) / 2,
    };
  }
  return { cx, cy };
}

/**
 * Dessine une croix de repère centrée, similaire à un repère de grille.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} width
 * @param {Number} height
 */
function drawGridCross(ctx, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const gap = 3; // demi-espace au centre (carré vide de 6px de côté)
  const margin = 12; // distance aux bords

  ctx.save();
  ctx.strokeStyle = "#DDDDDD";
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  ctx.beginPath();
  // Trait horizontal gauche
  ctx.moveTo(margin, cy);
  ctx.lineTo(cx - gap, cy);
  // Trait horizontal droit
  ctx.moveTo(cx + gap, cy);
  ctx.lineTo(width - margin, cy);
  // Trait vertical haut
  ctx.moveTo(cx, margin);
  ctx.lineTo(cx, cy - gap);
  // Trait vertical bas
  ctx.moveTo(cx, cy + gap);
  ctx.lineTo(cx, height - margin);
  ctx.stroke();

  ctx.restore();
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
      small = true,
      default: isDefault = false,
      conditions = [],
      flatStyle = {},
    } = options;

    this.set("default", Boolean(isDefault));
    const canvas = document.createElement("canvas");
    canvas.id = SelectorID.generate();
    this.set("image", canvas);
    /** @private @type {{ size?: Array<Number>, margin?: Number, small?: Boolean }} */
    this._imageOptions = {};
    this.small = small;
    this.name = name;
    this.type = type;
    this.conditions = conditions;
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
      const options = Object.assign(this._imageOptions, { force: true, small: this.small });
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

  get small() {
    return this.get("small") !== false;
  }

  /**
   * @param {Boolean} value Vrai si la visualisation doit être compacte
   */
  set small(value) {
    const normalized = Boolean(value);
    const previous = this.get("small");
    this.set("small", normalized);

    if (previous !== undefined && previous !== normalized) {
      this.getImage({ ...this._imageOptions, force: true, small: normalized });
    }
  }

  /**
   * Canvas interne de prévisualisation mis en cache.
   * @returns {HTMLCanvasElement}
   */
  get image() {
    return this.get("image");
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
    const result = reset ? { ...flatStyle } : { ...currentFlatStyle, ...flatStyle }
    this.set("flatStyle", result);

    const options = Object.assign(this._imageOptions, { force: true, small: this.small });
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
    const sourceConditions = cond instanceof Collection ? cond.getArray() : cond;

    /** @type {Collection<Condition>} */
    const conditionsObject = new Collection();

    sourceConditions.forEach(element => {
      let condition;
      if (element instanceof Condition) {
        // Clone la condition pour éviter les références partagées.
        condition = new Condition({
          attribute: element.attribute,
          operator: element.operator,
          value: element.value,
        });
      } else {
        // Transforme les conditions en objet Condition si nécessaire
        condition = new Condition({
          attribute: element.attribute ?? element.attr,
          operator: element.operator ?? element.op,
          value: element.value ?? element.val,
        });
      }
      conditionsObject.push(condition);
    });

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
    this.conditions = [...this.conditions, this._toCondition(condition)];
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
    this.conditions = currentConditions;
  }

  /**
   * @param {Object} feature
   * @returns {Boolean}
   */
  isValidForFeature(feature) {
    return this.conditions.every((condition) => condition.isValid(feature));
  }

  /**
   * Effectue le rendu du style sur un canvas donné, sans modifier l'état de l'instance.
   * @param {HTMLCanvasElement} canvas Canvas cible
   * @param {{ size: Array<Number>, margin: Number, small: Boolean }} imageOptions Options normalisées
   * @returns {HTMLCanvasElement}
   * @private
   */
  _renderToCanvas(canvas, imageOptions) {
    const [width, height] = imageOptions.size;
    const margin = Math.max(0, imageOptions.margin);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const vectorContext = toContext(ctx, { size: [width, height] });

    const cx = width / 2;
    const cy = height / 2;
    const isSmall = imageOptions.small;
    const sizeFactor = isSmall ? 0.65 : 1;
    const sx = Math.max(1, (cx - margin) * sizeFactor);
    const sy = Math.max(1, (cy - margin) * sizeFactor);

    if (!isSmall) {
      drawGridCross(ctx, width, height);
    }

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
        return canvas;
    }

    // Applique le flatStyle puis laisse ignStyleFn fabriquer les styles OL.
    feature.setStyle(getStyleFn());

    const flatStyle = Object.assign({}, this.getFlatStyle());
    if (isSmall) {
      flatStyle["point-radius"] = 15;
    }

    // Masque le texte si displayText est false (ne modifie pas le flatStyle permanent)
    let styleToApply = flatStyle;
    if (!imageOptions.displayText) {
      styleToApply = Object.keys(flatStyle).reduce((acc, key) => {
        if (!key.startsWith("text-")) {
          acc[key] = flatStyle[key];
        }
        return acc;
      }, {});
    }

    // En preview, la feature n'a pas de layer: les alias altProperties ne s'appliquent pas.
    // On applique localement les propriétés de bordure de surface vers les propriétés des lignes.
    let previewFlatStyle = styleToApply;
    if (this.type === "Polygon") {
      previewFlatStyle = { ...styleToApply };
      if (previewFlatStyle["fill-stroke-color"] !== undefined) {
        previewFlatStyle["stroke-color"] = previewFlatStyle["fill-stroke-color"];
      }
      if (previewFlatStyle["fill-stroke-width"] !== undefined) {
        previewFlatStyle["stroke-width"] = previewFlatStyle["fill-stroke-width"];
      }
      if (previewFlatStyle["fill-stroke-line-dash"] !== undefined) {
        previewFlatStyle["stroke-line-dash"] = previewFlatStyle["fill-stroke-line-dash"];
      }
    }

    feature.setIgnStyle(flatToIgnStyle(previewFlatStyle));

    let style = feature.getStyle();
    if (typeof style === "function") {
      style = style(feature);
    }
    if (!Array.isArray(style)) {
      style = [style];
    }

    // En mode compact, recentre visuellement l'icône en tenant compte de son ancre.
    if (isSmall && this.type === "Point") {
      const centered = computeCenteredPoint(style, cx, cy);
      feature.setGeometry(new Point([centered.cx, centered.cy]));
    }

    // Dessine sur le canvas
    ctx.save();
    style.forEach(s => {
      ctx.save();
      vectorContext.setStyle(s);
      vectorContext.drawGeometry(feature.getGeometry());
      ctx.restore();
    });
    ctx.restore();

    return canvas;
  }

  /**
   * Dessine (ou redessine) une représentation canvas du style courant
   * et met à jour l'état interne (cache).
   * @param {StyleObjImageOptions} [options]
   * @returns {HTMLCanvasElement}
   */
  drawImage(options = {}) {
    const imageOptions = normalizeImageOptions(options, this.small);
    const canvas = this.get("image");
    this._renderToCanvas(canvas, imageOptions);
    this._imageOptions = imageOptions;
    this.set("image", canvas);
    return canvas;
  }

  /**
   * Retourne une représentation canvas du style courant.
   * - Sans `clone` : retourne le canvas interne (mis en cache).
   * - Avec `clone` : dessine dans un canvas temporaire sans modifier l'état de l'instance.
   * @param {StyleObjImageOptions} [options] Options pour l'image
   * @returns {HTMLCanvasElement}
   */
  getImage(options = {}) {
    const imageOptions = normalizeImageOptions(options, this.small);

    if (options.clone) {
      // Rendu isolé dans un canvas temporaire : aucune mutation de l'état interne
      const tmp = document.createElement('canvas');
      this._renderToCanvas(tmp, imageOptions);
      return tmp;
    }

    let image = this.get("image");
    if (!image || !isSameImageOptions(this._imageOptions, imageOptions) || options.force === true) {
      image = this.drawImage(imageOptions);
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
    const clonedConditions = {
      all: this.conditions?.all,
      usecase: this.conditions?.usecase,
      conditions: this.conditions?.conditions instanceof Collection
        ? this.conditions.conditions.getArray().map((condition) => ({
            attribute: condition.attribute,
            operator: condition.operator,
            value: condition.value,
          }))
        : [],
    };

    return new StyleObj({
      name: this.name,
      type: this.type,
      default: this.isDefault,
      conditions: clonedConditions,
      flatStyle: this.getFlatStyle(),
    })
  }
}

export default StyleObj;