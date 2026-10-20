import carte from '../../carte.js';
import i18next from '../../i18n/index';

import Draw from "geopf-extensions-openlayers/src/packages/Controls/Draw/Draw.js";
import Drawing from "geopf-extensions-openlayers/src/packages/Interactions/Drawing.js";
import styleDialog from '../../control/StyleDialog/styleDialog.js';
import leftPanel from '../../dialogs/leftPanel.js';

const drawToggle = new Draw({
  position: "right",
  title: i18next.t('pages:draw.title'),
  select: carte.getSelect(),
  drawingInteractions: false,
  addToMap: false,
  onStyle: false,
  style: styleDialog,
});

const typeObjects = {
  "Multi": {
    icon: "fr-icon-map-pin-2-line",
    label: i18next.t('pages:draw.multiple'),
  },
  "Point": {
    icon: "fr-icon-map-pin-2-line",
    label: i18next.t('pages:draw.point'),
  },
  "LineString": {
    icon: "fr-icon-ign-dessiner-trace-line",
    label: i18next.t('pages:draw.line'),
  },
  "Polygon": {
    icon: "fr-icon-ign-shape-3-fill",
    label: i18next.t('pages:draw.polygon'),
  }
  ,
  "Circle": {
    icon: "fr-icon-circle-line",
    label: i18next.t('pages:draw.circle'),
  }
  ,
  "Box": {
    icon: "fr-icon-rectangle-line",
    label: i18next.t('pages:draw.box'),
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

drawToggle.getStyleDialog().onOpen(() => {
  leftPanel.close();
})

leftPanel.onOpen(() => {
  drawToggle.getStyleDialog().close();
})

export default drawToggle;
