
import SearchEngineAdvanced from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngineAdvanced.js";
import InseeAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/InseeAdvancedSearch.js";
import LocationAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/LocationAdvancedSearch.js";
import CoordinateAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/CoordinateAdvancedSearch.js";
import carte from "../carte";
import VectorSource from "ol/source/Vector";

const insee = new InseeAdvancedSearch({
})

const location = new LocationAdvancedSearch({
})

const coordinates = new CoordinateAdvancedSearch({
})

/**
 * 
 * @param {import("ol/Feature").default} feature Feature à ajouter à la couche
 */
function addFeatureToLayer(feature) {
  /**
   * @type {import("geopf-extensions-openlayers/src/index.js").LayerSwitcher}
   */
  const switcher = carte.getControl("layerSwitcher");
  if (!switcher) {
    console.error("Le gestionnaire de couche n'a pas été ajoutée à la carte");
    return
  }
  const layer = switcher.getSelectedLayer();
  if (!layer) {
    alert("Aucune couche sélectionnée");
    return;
  } else {
    const source = layer.getSource();
    if (!(source instanceof VectorSource)) {
      alert("La couche séléctionnée n'est pas une couche vectorielle");
      return
    } else {
      source.addFeature(feature.clone());
      alert("L'objet a bien été ajoutée à la couche " + layer.get("title") || "");
    }
  }
}

let search = new SearchEngineAdvanced({
  advancedSearch: [insee, location, coordinates],
  returnTrueGeometry: true,
  popupButtons : [{
    label : "Ajouter l'objet à la couche",
    className : "custom-button",
    icon : "fr-icon-map-pin-add-line",
    onClick : addFeatureToLayer
  }]
})

export default search;