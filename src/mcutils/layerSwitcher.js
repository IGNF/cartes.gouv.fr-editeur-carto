
import { LayerSwitcher } from 'geopf-extensions-openlayers/src/index.js';
import carte from '../carte.js';
import leftPanel from '../leftPanel.js';
import editLayerAction from '../actions/editLayerStyle/editLayerStyleAction.js';


function openMapDialog(e, instance, layer, options) {
  editLayerAction.setAction(leftPanel);
  // leftPanel.setDialogTitle('Couche : ' + layer.get('name'))
  console.log(e, instance, layer, options);
  leftPanel.open();
}

const switcher = new LayerSwitcher({
  options: {
    // position: 'top-right',
    collapsed: true,
    panel: true,
    counter: true,
    allowEdit: true,
    advancedTools: [
      {
        label: 'Sélectionner la couche',
        icon: 'fr-icon-cursor-line',
        cb: (e, instance, layer, options) => {
          carte.selectedLayer = layer;
          carte.dispatchEvent({
            type: 'selected:layer:change',
            layer: layer,
            options: options,
          })
          openMapDialog(e, instance, layer, options);
        }
      },
    ]
  }
});

export default switcher;