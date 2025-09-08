import Panel from "../control/Panel/Panel.js";
import './rightPanel.scss'

const rightPanel = new Panel({
  id: 'right-panel-action',
  position: 'right',
  icon: 'fr-icon-checkbox-line',
  parent: document.body.querySelector('main > div[data-role="map"]'),
})

export default rightPanel;