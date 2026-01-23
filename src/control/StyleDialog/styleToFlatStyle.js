import {createDefaultStyle} from "ol/style/flat.js"

/**
 * Convertit un Stroke OpenLayers en propriétés flat style
 * @param {ol.style.Stroke} stroke - Le stroke à convertir
 * @returns {Object} Propriétés flat style pour le stroke
 */
function strokeToFlat(stroke) {
  const flat = {};
  
  if (!stroke) return flat;
  
  const color = stroke.getColor();
  if (color) flat['stroke-color'] = color;
  
  const width = stroke.getWidth();
  if (width !== undefined) flat['stroke-width'] = width;
  
  const lineDash = stroke.getLineDash();
  if (lineDash) flat['stroke-line-dash'] = lineDash;
  
  const lineCap = stroke.getLineCap();
  if (lineCap) flat['stroke-line-cap'] = lineCap;
  
  const lineJoin = stroke.getLineJoin();
  if (lineJoin) flat['stroke-line-join'] = lineJoin;
  
  return flat;
}

/**
 * Convertit un Fill OpenLayers en propriétés flat style
 * @param {ol.style.Fill} fill - Le fill à convertir
 * @returns {Object} Propriétés flat style pour le fill
 */
function fillToFlat(fill) {
  const flat = {};
  
  if (!fill) return flat;
  
  const color = fill.getColor();
  if (color) flat['fill-color'] = color;
  
  return flat;
}

/**
 * Convertit un CircleStyle OpenLayers en propriétés flat style
 * @param {ol.style.Circle} circle - Le circle à convertir
 * @returns {Object} Propriétés flat style pour le circle
 */
function circleToFlat(circle) {
  const flat = {};
  
  if (!circle || !circle.getRadius) return flat;
  
  const radius = circle.getRadius();
  if (radius !== undefined) flat['circle-radius'] = radius;
  
  const stroke = circle.getStroke();
  if (stroke) {
    const color = stroke.getColor();
    if (color) flat['circle-stroke-color'] = color;
    
    const width = stroke.getWidth();
    if (width !== undefined) flat['circle-stroke-width'] = width;
  }
  
  const fill = circle.getFill();
  if (fill) {
    const color = fill.getColor();
    if (color) flat['circle-fill-color'] = color;
  }
  
  return flat;
}

/**
 * Convertit un Icon OpenLayers en propriétés flat style
 * @param {ol.style.Icon} icon - L'icon à convertir
 * @returns {Object} Propriétés flat style pour l'icon
 */
function iconToFlat(icon) {
  const flat = {};
  
  if (!icon || !icon.getSrc) return flat;
  
  const src = icon.getSrc();
  if (src) flat['icon-src'] = src;
  
  const color = icon.getColor();
  if (color) flat['icon-color'] = color;
  
  const anchor = icon.getAnchor();
  if (anchor) flat['icon-anchor'] = anchor;
  
  const scale = icon.getScale();
  if (scale !== undefined) flat['icon-scale'] = scale;
  
  const anchorXUnits = icon.getAnchorXUnits();
  if (anchorXUnits) flat['icon-anchor-x-units'] = anchorXUnits;
  
  const anchorYUnits = icon.getAnchorYUnits();
  if (anchorYUnits) flat['icon-anchor-y-units'] = anchorYUnits;
  
  const opacity = icon.getOpacity();
  if (opacity !== undefined) flat['icon-opacity'] = opacity;
  
  return flat;
}

/**
 * Convertit un RegularShape OpenLayers en propriétés flat style
 * @param {ol.style.RegularShape} shape - La shape à convertir
 * @returns {Object} Propriétés flat style pour la shape
 */
function shapeToFlat(shape) {
  const flat = {};
  
  if (!shape || !shape.getPoints) return flat;
  
  const points = shape.getPoints();
  if (points !== undefined) flat['shape-points'] = points;
  
  const radius = shape.getRadius();
  if (radius !== undefined) flat['shape-radius'] = radius;
  
  const radius2 = shape.getRadius2();
  if (radius2 !== undefined) flat['shape-radius2'] = radius2;
  
  const angle = shape.getAngle();
  if (angle !== undefined) flat['shape-angle'] = angle;
  
  const stroke = shape.getStroke();
  if (stroke) {
    const color = stroke.getColor();
    if (color) flat['shape-stroke-color'] = color;
    
    const width = stroke.getWidth();
    if (width !== undefined) flat['shape-stroke-width'] = width;
  }
  
  const fill = shape.getFill();
  if (fill) {
    const color = fill.getColor();
    if (color) flat['shape-fill-color'] = color;
  }
  
  return flat;
}

/**
 * Convertit un Image OpenLayers en propriétés flat style
 * @param {ol.style.Image} image - L'image à convertir
 * @returns {Object} Propriétés flat style pour l'image
 */
function imageToFlat(image) {
  const flat = {};
  
  if (!image) return flat;
  
  // Déterminer le type d'image et utiliser le bon convertisseur
  if (image.getRadius) {
    // C'est un Circle
    Object.assign(flat, circleToFlat(image));
  } else if (image.getSrc) {
    // C'est un Icon
    Object.assign(flat, iconToFlat(image));
  } else if (image.getPoints) {
    // C'est un RegularShape
    Object.assign(flat, shapeToFlat(image));
  }
  
  return flat;
}

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
  'fill-color': 'fillColor'
}

function flatToIgnStyle(flatStyle) {
  flatStyle = flatStyle || {};
  const ignStyle = {};
  Object.keys(flatStyle).forEach(key => {
    ignStyle[styleLut[key] || key] = flatStyle[key];
  });
  return ignStyle;
}

/**
 * Convertit le style d'une feature OpenLayers en flat style
 * @param {ol.Feature} feature - La feature dont on extrait le style
 * @returns {Object} Objet représentant le flat style
 */
function styleToFlatStyle(feature) {
  const flatStyle = createDefaultStyle() || {};
  const st = feature.getIgnStyle(true);
  Object.keys(styleLut).forEach(key => {
    flatStyle[key] = st[styleLut[key]];
  });
  return flatStyle;

    console.log(feature)
  // Récupérer le style de la feature
  let style = feature.getStyle();
  console.log(style)
  
  // Si pas de style sur la feature, retourner un objet vide
  if (!style) {
    return flatStyle;
  }
  
  // Si le style est une fonction, l'exécuter
  if (typeof style === 'function') {
    style = style(feature);
  }
  
  console.log(style);
  // Si le style est un array, prendre le premier élément pour l'instant
  // TODO: gérer tous les styles de l'array
  if (Array.isArray(style)) {
    style = style[0];
  }
  
  if (!style) {
    return flatStyle;
  }
  
  // Extraire les propriétés de stroke
  const stroke = style.getStroke();
  if (stroke) {
    Object.assign(flatStyle, strokeToFlat(stroke));
  }
  
  // Extraire les propriétés de fill
  const fill = style.getFill();
  if (fill) {
    Object.assign(flatStyle, fillToFlat(fill));
  }
  
  // Extraire les propriétés de l'image
  const image = style.getImage();
  if (image) {
    Object.assign(flatStyle, imageToFlat(image));
  }
  
  // Extraire les propriétés de texte
  const text = style.getText();
  if (text) {
    // TODO: implémenter textToFlat si nécessaire
  }
  
  return flatStyle;
}

export {
  styleToFlatStyle,
  strokeToFlat,
  fillToFlat,
  circleToFlat,
  iconToFlat,
  shapeToFlat,
  imageToFlat,
  flatToIgnStyle
};
