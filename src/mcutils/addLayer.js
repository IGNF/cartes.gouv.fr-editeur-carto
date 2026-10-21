import VectorStyle from "mcutils/layer/VectorStyle.js";
// import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js"
import carte from "../carte.js";
import i18next from '../i18n/index';

/**
 * 
 * @param {PointerEvent} e Événement générique au clic
 * @param {import ("geopf-extensions-openlayers/src/index.js").LayerSwitcher} layerSwitcher Gestionnaire de couche
 */
function addLayer(e, layerSwitcher) {
  let layer = new VectorStyle({
    source: new VectorSource(),
    description: i18next.t('controls:layerSwitcher.newLayerDescription'),
    title: i18next.t('controls:layerSwitcher.newLayerTitle'),
    type: "Vector",
    thumbnail: "personal-drawing",
  });
  carte.addLayer(layer);
  layerSwitcher.addLayer(layer);
}

export default addLayer;