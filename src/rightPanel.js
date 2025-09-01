import Panel from "./control/Panel/Panel.js";

const rightPanel = new Panel({
  id: 'right-panel-action',
  position: 'right',
  icon: 'fr-icon-checkbox-line',
  parent: document.body.querySelector('main'),
})

export default rightPanel;