import SearchEngineAdvanced from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngineAdvanced.js";
import InseeAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/InseeAdvancedSearch.js";
import LocationAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/LocationAdvancedSearch.js";
import CoordinateAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/CoordinateAdvancedSearch.js";
import ParcelAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/ParcelAdvancedSearch.js";
import carte from "../carte.js";
import i18next from "../i18n/index";

const insee = new InseeAdvancedSearch({
    name: i18next.t("controls:search.insee"),
});

const location = new LocationAdvancedSearch({
    name: i18next.t("controls:search.location"),
});

const coordinates = new CoordinateAdvancedSearch({
    name: i18next.t("controls:search.coordinates"),
    coordinateSearch: {
        systems: [
            { crs: "EPSG:4326", type: "Geographical", label: i18next.t("controls:search.systems.geographical") },
            { crs: "EPSG:3857", type: "Metric", label: i18next.t("controls:search.systems.webMercator") },
            { crs: "EPSG:2154", type: "Metric", label: i18next.t("controls:search.systems.lambert93") },
        ],
    },
});

const parcel = new ParcelAdvancedSearch({
    name: i18next.t("controls:search.parcel"),
});

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
        return;
    }
    const layer = switcher.getSelectedLayer();
    if (!layer) {
        alert(i18next.t("notifications:search.noLayerSelected"));
        return;
    } else if (layer.get("type") !== "Vector") {
        alert(i18next.t("notifications:search.notDrawingLayer"));
        return;
    } else {
        const newFeature = feature.clone();
        newFeature.setStyle(undefined); // Pour réinitialiser le style
        newFeature.unset("infoPopup"); // Pour ne pas avoir de conflit avec l'ancien popup
        layer.getSource().addFeature(newFeature);
        return true;
    }
}

let search = new SearchEngineAdvanced({
    advancedSearch: [insee, location, coordinates, parcel],
    returnTrueGeometry: true,
    placeholder: i18next.t("common:search"),
    popupButtons: [
        {
            label: i18next.t("controls:search.addFeature"),
            className: "custom-button",
            icon: "fr-icon-map-pin-add-line",
            onClick: addFeatureToLayer,
        },
    ],
});

export default search;
