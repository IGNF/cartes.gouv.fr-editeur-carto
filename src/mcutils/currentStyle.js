import { defaultIgnStyle } from 'mcutils/style/ignStyleFn.js';
import carte from "../carte.js";
import labelForm from '../control/StyleDialog/labelForm.js';
import styleForm from '../control/StyleDialog/styleForm.js';
import { flatToIGNKeyValue } from '../control/StyleDialog/styleToFlatStyle.js';
import Feature from 'ol/Feature.js';
import { LineString, Point, Polygon } from 'ol/geom.js';

const currentStyle = {
  Point: {},
  LineString: {},
  Polygon: {}
};
const typeGeom = {
  Point: 'Point',
  MultiPoint: 'Point',
  LineString: 'LineString',
  MultiLineString: 'LineString',
  Polygon: 'Polygon',
  MultiPolygon: 'Polygon',
}

function initCurrentStyle(defaultStyle) {
  const ptStyle = new Feature({
    geometry: new Point([0, 0]),
  }).getIgnStyle(true);
  const lineStyle = new Feature({
    geometry: new LineString([0, 0]),
  }).getIgnStyle(true);
  const polyStyle = new Feature({
    geometry: new Polygon([0, 0], [0, 0]),
  }).getIgnStyle(true);

  const styles = {
    Point:ptStyle,
    LineString:lineStyle,
    Polygon:polyStyle
  };

  Object.entries(styles).forEach(([type, style] )=> {
    Object.entries(style).forEach(([key, value]) => {
      if (!defaultStyle[type].hasOwnProperty(key)) {
        // Ajoute le style par défaut si n'est pas encore ajouté
        defaultStyle[type][key] = value;
      }
    });
  })
}

initCurrentStyle(currentStyle);

// Change le style courant à la sélection
carte.getSelect().on("select", (e) => {
  // const features = carte.getSelect().getFeatures().getArray();
  if (e?.selected?.length) {
    updateCurrentStyle(e.selected[0]);
  }
})

/**
 * Retourne une copie du style courant
 * @param {Feature} f Feature dont le style doit être récupéré
 * @returns {Object} Copie du style courant
 */
function getCurrentStyle(f) {
  const type = f.getGeometry().getType();
  const style = Object.assign({}, currentStyle[typeGeom[type]]);
  // Retire le zIndex
  style.zIndex = 0;
  return style;
}

/**
 * Met à jour le style courant
 * @param {Feature} f Feature dont le style doit être récupéré
 */
function updateCurrentStyle(f) {
  const type = f.getGeometry().getType();
  // Modifie seulement ce qui doit l'être
  currentStyle[typeGeom[type]] = Object.assign(currentStyle[typeGeom[type]], f.getIgnStyle());
}

export { getCurrentStyle, updateCurrentStyle };
