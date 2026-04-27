import Panel from "../control/Panel/Panel.js";
// import carte from "../carte.js";
import { carte } from "../story.js";

const leftPanel = new Panel({
  id: 'left-panel-action',
  position: 'left',
  icon: 'fr-icon-checkbox-line',
  // parent: document.body.querySelector('main > div[data-role="map"], main > div[data-role="storymap"]'),
  parent: carte.getMap().getOverlayContainerStopEvent(),
})

export default leftPanel;