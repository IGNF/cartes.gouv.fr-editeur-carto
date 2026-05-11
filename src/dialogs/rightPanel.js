import Panel from "../control/Panel/Panel.js";
import carte from "../carte.js";
import './rightPanel.scss';

const rightPanel = new Panel({
  id: 'right-panel-action',
  position: 'right',
  icon: 'fr-icon-checkbox-line',
  // parent: document.body.querySelector('main > div[data-role="map"], main > div[data-role="storymap"]'),
  parent: carte.getMap().getOverlayContainerStopEvent(),
})

export default rightPanel;