import carte from '../../carte.js';

import Catalog from "geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog.js";

const catalog = new Catalog({
  position: "top-right",
  titlePrimary: "Catalogue des cartes",
  layerLabel: "title",
  layerThumbnail: true,
  optimisation: "on-demand",
  tabHeightAuto: false,
  size: "xl",
  search: {
    display: true,
    criteria: ["name", "title", "description"]
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
            // value : ["Hydrologie", "Agriculture", "Transports"] // all : "*"
          }
        },
        {
          title: "Producteur",
          section: true,
          order: true,
          icon: true,
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
          icon: true,
          filter: {
            field: "service",
            value: "*"
          }
        }
      ]
    },
  ]
});

export default catalog;