import VectorStyle from "mcutils/layer/VectorStyle.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js"
import carte from "../carte";

/**
 * 
 * @param {PointerEvent} e Événement générique au clic
 * @param {import ("geopf-extensions-openlayers/src/index.js").LayerSwitcher} layerSwitcher Gestionnaire de couche
 */
function addLayer(e, layerSwitcher) {
  console.log(e, layerSwitcher);
  let layer = new VectorLayer({
    source: new VectorSource(),
    description: "Bla bla bla mon dessin",
    title: "Dessin",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(0,0,145,1)'%3E%3Cpath d='M21 1.99669C6 1.99669 4 15.9967 3 21.9967C3.66667 21.9967 4.33275 21.9967 4.99824 21.9967C5.66421 18.6636 7.33146 16.8303 10 16.4967C14 15.9967 17 12.4967 18 9.49669L16.5 8.49669C16.8333 8.16336 17.1667 7.83002 17.5 7.49669C18.5 6.49669 19.5042 4.99669 21 1.99669Z'%3E%3C/path%3E%3C/svg%3E"
  })
  carte.addLayer(layer)
  layerSwitcher.addLayer(layer);
}

export default addLayer;