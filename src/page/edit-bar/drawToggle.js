import carte from '../../carte.js';

import Draw from "geopf-extensions-openlayers/src/packages/Controls/Draw/Draw.js";
import Drawing from "geopf-extensions-openlayers/src/packages/Interactions/Drawing.js";
import styleDialog from '../../control/StyleDialog/styleDialog.js';

const drawToggle = new Draw({
  position: "right",
  title: "Annoter la carte",
  select: carte.getSelect(),
  drawingInteractions: false,
  addToMap: false,
  onStyle: false,
  style: styleDialog,
});

const typeObjects = {
  "Multi": {
    icon: "fr-icon-map-pin-2-line",
    label: "Multiple",
  },
  "Point": {
    icon: "fr-icon-map-pin-2-line",
    label: "Point",
  },
  "LineString": {
    icon: "fr-icon-ign-dessiner-trace-line",
    label: "Ligne",
  },
  "Polygon": {
    icon: "fr-icon-ign-shape-3-fill",
    label: "Surface",
  }
  ,
  "Circle": {
    icon: "fr-icon-circle-line",
    label: "Cercle",
  }
  ,
  "Box": {
    icon: "fr-icon-rectangle-line",
    label: "Rectangle",
  }
}

Object.keys(typeObjects).forEach(k => {
  if (k === "Multi") return;
  const obj = typeObjects[k];
  const interaction = new Drawing({
    type: k,
    select: drawToggle.select,
    selectOnDrawEnd: true,
  })
  interaction.setActive(false);
  drawToggle.addInteraction({
    interaction: interaction,
    icon: obj.icon,
    label: obj.label,
  });
});

export default drawToggle;
