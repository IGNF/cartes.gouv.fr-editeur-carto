import carte from "../../carte.js";
import i18next from "../../i18n/index";

import Catalog from "geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog.js";

// import local des layers
import GeoportalMapBox from "geopf-extensions-openlayers/src/packages/Layers/LayerMapBox.js";
import GeoportalWFS from "geopf-extensions-openlayers/src/packages/Layers/LayerWFS.js";
import GeoportalWMS from "geopf-extensions-openlayers/src/packages/Layers/LayerWMS.js";
import GeoportalWMTS from "geopf-extensions-openlayers/src/packages/Layers/LayerWMTS.js";

import Config from "geopf-extensions-openlayers/src/packages/Utils/Config.js";
import LayerConfig from "geopf-extensions-openlayers/src/packages/Utils/LayerConfigUtils.js";
import GeopfExtensionsFormat from "mcutils/cgouv/GeopfExtensionsFormat.js";
import Alert from "../../control/Alert/Alert";

/**
 * @typedef {Object} CatalogEvent Événément envoyé lors d'un clic sur une couche du catalogue
 * @property {import("geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog.js").default} target instance du catalogue
 * @property {"catalog:layer:add"|"catalog:layer:remove"} type Type de l'événement
 * @property {String} name Nom de la couche
 * @property {Service} service Nom du service
 * @property {Object} layer Configuration de la couche (vide si non ajouté / retiré de la carte)
 */

const catalog = new Catalog({
    position: "top-right",
    listable: false,
    titlePrimary: i18next.t("pages:catalog.title"),
    layerLabel: "title",
    layerThumbnail: true,
    optimisation: "on-demand",
    tabHeightAuto: false,
    size: "xl",
    addToMap: false, // Gestion directement dans l'éditeur
    search: {
        display: false,
    },
    categories: [
        {
            title: i18next.t("pages:catalog.referenceMaps"),
            id: "base",
            order: false,
            featured: true,
            filter: {
                field: "base",
                value: "true",
            },
        },
        {
            title: i18next.t("pages:catalog.allMaps"),
            id: "data",
            search: true,
            items: [
                {
                    title: i18next.t("pages:catalog.theme"),
                    default: true,
                    order: true,
                    section: true,
                    icon: true,
                    filter: {
                        field: "thematic",
                        value: "*",
                    },
                },
                {
                    title: i18next.t("pages:catalog.producer"),
                    section: true,
                    order: true,
                    icon: false,
                    filter: {
                        field: "producer",
                        value: "*",
                    },
                },
                {
                    title: i18next.t("pages:catalog.service"),
                    section: true,
                    order: true,
                    featured: true,
                    icon: false,
                    filter: {
                        field: "service",
                        value: "*",
                    },
                },
            ],
        },
    ],
});

// N'utilise pas catalog.addLayer car ne prend pas en compte le thumbnail
catalog.on(catalog.ADD_CATALOG_LAYER_EVENT, function (/** @type {CatalogEvent} */ e) {
    const { name, service } = e;
    const id = this.getLayerId(name, service);
    if (!id) {
        return;
    }
    const conf = !Config.isConfigLoaded() ? LayerConfig.getLayerConfig(this.layersList[id]) : null;
    let layer = null;
    // Créé la couche correspondante
    try {
        switch (service) {
            case "WMS":
                layer = new GeoportalWMS({
                    layer: name,
                    configuration: conf,
                });
                break;
            case "WMTS":
                layer = new GeoportalWMTS({
                    layer: name,
                    configuration: conf,
                });
                break;
            case "TMS":
                layer = new GeoportalMapBox(
                    {
                        layer: name,
                        configuration: conf,
                    },
                    {
                        declutter: true,
                    }
                );
                break;
            case "WFS":
                layer = new GeoportalWFS({
                    layer: name,
                    configuration: conf,
                });
                break;
            default:
                break;
        }
    } catch (error) {
        if (error?.message === "ERROR : Layer ID not found into the catalogue !?") {
            // La couche n'a pas été trouvé dans le catalogue
            // On essaie de récupérer le label contenant le nom visible (pas nom technique)
            const layerName = e.target?.getContainer().querySelector(`input[data-layer="${name}:${service}"] ~ * label.GPlabelActive`)?.title;
            Alert.addAlert(
                {
                    closeLabel: i18next.t("notifications:dismiss"),
                    id: `add-catalog-layer-ID-${id.replaceAll(/[^a-zA-Z]/g, "-")}--error`,
                    closable: true,
                    type: Alert.TYPES.ERROR,
                    title: i18next.t("pages:catalog.requestError"),
                    description: layerName
                        ? i18next.t("pages:catalog.namedLayerAddError", {
                              name: layerName,
                              interpolation: { escapeValue: false },
                          })
                        : i18next.t("pages:catalog.layerAddError"),
                    // small: true,
                },
                true
            );
        } else {
            console.error(error);
        }
        return;
    }

    // Ajoute la couche à la carte
    if (layer) {
        // Ajoute le type si présent
        for (let i = 0; i < GeopfExtensionsFormat.validConstructors.length; i++) {
            const [type, constructor] = GeopfExtensionsFormat.validConstructors[i];
            if (layer instanceof constructor) {
                layer.set("type", type);
                break;
            }
        }
        const config = Object.assign({}, this.layersList[id]);
        // Dans le cas où la personne aurait enregistrée la carte auparavant
        // layer.set("title", config.title);
        // Ajoute les infos manquantes
        layer.config.thumbnail = config.thumbnail || "default";
        layer.config.producer = config.producer || "";
        layer.config.catalogId = id;
        carte.addLayer(layer, false);
        this.layersListOnMap[name + ":" + service] = layer;
    }
});

// addToMap est faux, on appelle nous même la méthode removeLayer
catalog.on(catalog.REMOVE_CATALOG_LAYER_EVENT, function (/** @type {CatalogEvent} */ e) {
    this.removeLayer(e.name, e.service);
});

window.catalog = catalog;

export default catalog;
