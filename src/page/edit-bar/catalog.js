import carte from '../../carte.js';

import Catalog from "geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog.js";

// import local des layers
import GeoportalWFS from "geopf-extensions-openlayers/src/packages/Layers/LayerWFS.js";
import GeoportalWMS from "geopf-extensions-openlayers/src/packages/Layers/LayerWMS.js";
import GeoportalWMTS from "geopf-extensions-openlayers/src/packages/Layers/LayerWMTS.js";
import GeoportalMapBox from "geopf-extensions-openlayers/src/packages/Layers/LayerMapBox.js";

import Config from "geopf-extensions-openlayers/src/packages/Utils/Config.js";
import LayerConfig from "geopf-extensions-openlayers/src/packages/Utils/LayerConfigUtils.js";
import GeopfExtensionsFormat from 'mcutils/cgouv/GeopfExtensionsFormat.js';

/**
 * @typedef {Object} CatalogEvent Événément envoyé lors d'un clic sur une couche du catalogue
 * @property {import("geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog.js").default} target instance du catalogue
 * @property {"catalog:layer:add"|"catalog:layer:remove"} type Type de l'événement
 * @property {String} name Nom de la couche
 * @property {Service} service Nom du service
 * @property {Object} layer Configuration de la couche (vide si non ajouté / retiré de la carte)
 * 
 */

const catalog = new Catalog({
  position: "top-right",
  listable: false,
  titlePrimary: "Catalogue des cartes",
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
      title: "Cartes de références",
      id: "base",
      order: false,
      featured: true,
      filter: {
        field: "base",
        value: "true"
      }
    },
    {
      title: "Toutes les cartes",
      id: "data",
      search: true,
      items: [
        {
          title: "Thème",
          default: true,
          order: true,
          section: true,
          icon: true,
          filter: {
            field: "thematic",
            value: "*"
          }
        },
        {
          title: "Producteur",
          section: true,
          order: true,
          icon: false,
          filter: {
            field: "producer",
            value: "*"
          }
        },
        {
          title: "Service",
          section: true,
          order: true,
          featured: true,
          icon: false,
          filter: {
            field: "service",
            value: "*"
          }
        }
      ]
    },
  ]
});

// N'utilise pas catalog.addLayer car ne prend pas en compte le thumbnail
catalog.on(catalog.ADD_CATALOG_LAYER_EVENT, function (/** @type {CatalogEvent} */ e) {
  const { name, service } = e;
  const id = this.getLayerId(name, service);
  if (!id) {
    return;
  }
  const conf = (!Config.isConfigLoaded()) ? LayerConfig.getLayerConfig(this.layersList[id]) : null;
  let layer = null;
  // Créé la couche correspondante
  switch (service) {
    case "WMS":
      layer = new GeoportalWMS({
        layer: name,
        configuration: conf
      });
      break;
    case "WMTS":
      layer = new GeoportalWMTS({
        layer: name,
        configuration: conf
      });
      break;
    case "TMS":
      layer = new GeoportalMapBox({
        layer: name,
        configuration: conf
      }, {
        declutter: true
      });
      break;
    case "WFS":
      layer = new GeoportalWFS({
        layer: name,
        configuration: conf
      });
      break;
    default:
      break;
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
    carte.addLayer(layer);
    this.layersListOnMap[name + ":" + service] = layer;
  }
});

// addToMap est faux, on appelle nous même la méthode removeLayer
catalog.on(catalog.REMOVE_CATALOG_LAYER_EVENT, function (/** @type {CatalogEvent} */ e) {
  this.removeLayer(e.name, e.service);
});

window.catalog = catalog;

export default catalog;