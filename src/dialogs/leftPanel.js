import Panel from "../control/Panel/Panel.js";

const leftPanel = new Panel({
  id: 'left-panel-action',
  position: 'left',
  icon: 'fr-icon-checkbox-line',
  parent: document.body.querySelector('main > div[data-role="map"]'),
})

export default leftPanel;