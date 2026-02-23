import { createDefaultStyle } from "ol/style/flat.js";
import getCurrentStyle from "../../mcutils/currentStyle.js";

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
 * @returns {IGNKeyValue} Propriété et valeur associée pour le style IGN
 */
function flatToIGNKeyValue(key, value) {
  const k = flatToIgnKey(key);
  let v = value;
  if (k === "labelAttribute") {
    v = v.replace(/\n{1,}$/g, '');
  }
  return { key: k, value: v };
}

/**
 * Convertit le style d'une feature OpenLayers en flat style openlayer
 * @param {ol.Feature} feature - La feature dont on extrait le style
 * @returns {Object} Objet représentant le flat style
 */
function styleToFlatStyle(feature) {
  const flatStyle = createDefaultStyle() || {};
  // Extraction du style de la feature, parmi ce qui est modifié
  const st = feature?.getIgnStyle?.();
  // Mix entre style courant et style de la feature
  const style = Object.assign(getCurrentStyle(), st)
  // Création du flatStyle openlayer
  Object.keys(styleLut).forEach(key => {
    flatStyle[key] = style[styleLut[key]];
  });
  return flatStyle;
}

export {
  styleToFlatStyle,
  flatToIgnStyle,
  flatToIgnKey,
  flatToIGNKeyValue
};
