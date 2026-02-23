import carte from '../../carte.js';

import Draw from "geopf-extensions-openlayers/src/packages/Controls/Draw/Draw.js";
import Drawing from "geopf-extensions-openlayers/src/packages/Interactions/Drawing.js";
import styleDialog from '../../control/StyleDialog/styleDialog.js';

const drawToggle = new Draw({
  position: "right",
  title: "Annoter la carte",
  select: carte.getSelect()
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

const onSelect = (e) => {
  // Selected features
  const features = e.target.getFeatures();
  // styleForm.setFeatures(features.getArray());
  // At least one feature selected
  if (features.getLength()) {
    // Update styleform
    // styleForm.setFlatStyle(styleToFlatStyle(features.item(0)));
    // Geometry lists
    const gTypes = {};
    features.forEach(f => {
      gTypes[f.getGeometry().getType()] = true;
    })
    const geomType = Object.keys(gTypes).length > 1 ? 'Multi' : features.item(0).getGeometry().getType();
    // Title
    styleDialog.setDialogTitle(typeObjects[geomType].label);
    styleDialog.setIcon(typeObjects[geomType].icon);
    // Content class
    styleDialog.getDialogContent().className = 'GPF-dialog__content ' + Object.keys(gTypes).join(' ');
    // Show dialog
    styleDialog.show();
  } else {
    styleDialog.close();
  }
}

// À la sélection, ouvre ou ferme le dialog
carte.getSelect().on("select", onSelect);

export default drawToggle;
