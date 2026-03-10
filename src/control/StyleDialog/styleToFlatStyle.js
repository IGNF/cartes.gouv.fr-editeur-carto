import { createDefaultStyle } from "ol/style/flat.js";
import { getCurrentStyle } from "../../mcutils/currentStyle.js";

/**
 * Objet propriété / valeur pour une propriété dans le style IGN (mcutils).
 * @typedef {Object} IGNKeyValue
 * @property {String} key Propriété dans le style IGN
 * @property {any} value Valeur correspondante
 */

/**
 * @type {Object} Objet de correspondance flat style / IGN style
 */
const styleLut = {
  'point-color': 'pointColor',
  'point-form': 'pointForm',
  'point-radius': 'pointRadius',
  'point-glyph': 'pointGlyph',
  'point-stroke-color': 'pointStrokeColor',
  'point-stroke-width': 'pointStrokeWidth',
  'point-symbol-color': 'symbolColor',
  'stroke-color': 'strokeColor',
  'stroke-width': 'strokeWidth',
  'stroke-line-dash': 'strokeDash',
  'line-arrow-start': 'strokeArrowStart',
  'line-arrow-end': 'strokeArrow',
  'fill-color': 'fillColor',
  'fill-pattern-config': 'fillPatternConfig',
  'fill-pattern-color': 'fillColorPattern',
  'fill-pattern-scale': 'scalePattern',
  'text-value': 'labelAttribute',
  'text-fill-color': 'textColor',
  'text-size': 'textSize',
}

/**
 * Transforme un objet flatStyle openlayer en style IGN (mcutils)
 * @param {Object} flatStyle Objet de flat style
 * @returns {Object} style IGN (mcutils)
 */
function flatToIgnStyle(flatStyle) {
  flatStyle = flatStyle || {};
  const ignStyle = {};
  Object.keys(flatStyle).forEach(key => {
    ignStyle[styleLut[key] || key] = flatStyle[key];
  });
  return ignStyle;
}

/**
 * Transforme une propriété flat style openlayer en propriété IGN (mcutils)
 * @param {String} key Propriété flat style (openlayer)
 * @returns {String} Propriété correspondante IGN (mcutils)
 */
function flatToIgnKey(key) {
  return styleLut[key] || key;
}

/**
 * Transforme une propriété et valeur flat style openlayer en
 * propriété et valeurs IGN (mcutils)
 * @param {String} key Propriété du flatStyle openlayer
 * @param {String} value Valeur associée
 * @returns {Array<IGNKeyValue>} Propriété et valeur associée pour le style IGN
 */
function flatToIGNKeyValue(key, value) {
  let result = [];
  const k = flatToIgnKey(key);
  if (k === "labelAttribute") {
    value = value.replace(/\n{1,}$/g, '');
    result.push({ key: k, value: value });
  } else if (k === "fillPatternConfig") {
    const values = value.split(";");
    result.push({ key: "fillPattern", value: values.shift() });
    if (values.length) {
      result.push({ key: "anglePattern", value: values.shift() });
    }
  } else {
    result.push({ key: k, value: value });
  }
  return result;
}

/**
 * Convertit le style d'une feature OpenLayers en flat style openlayer
 * @param {ol.Feature} feature - La feature dont on extrait le style
 * @returns {Object} Objet représentant le flat style
 */
function styleToFlatStyle(feature) {
  const flatStyle = createDefaultStyle() || {};
  // Extraction du style de la feature, parmi ce qui est modifié
  const st = getCurrentStyle(feature);
  // Création du flatStyle openlayer
  Object.keys(styleLut).forEach(key => {
    if (key === "fill-pattern-config") {
      // Motif : modification à faire
      const pattern = st["fillPattern"];
      const angle = st["anglePattern"];
      let name = pattern + (angle !== undefined ? `;${angle}` : "");
      flatStyle[key] = name;
    } else {
      flatStyle[key] = st[styleLut[key]];
    }
  });
  return flatStyle;
}

export {
  styleToFlatStyle,
  flatToIgnStyle,
  flatToIgnKey,
  flatToIGNKeyValue
};
