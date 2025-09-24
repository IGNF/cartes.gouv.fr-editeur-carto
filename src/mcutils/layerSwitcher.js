
import { LayerSwitcher } from 'geopf-extensions-openlayers/src/index.js';
import carte from '../carte.js';
import leftPanel from '../dialogs/leftPanel.js';
import addLayer from './addLayer.js';
import Action from '../actions/Action.js';
import modal from '../dialogs/modal.js';
import "./layerSwitcher.scss";

const switcher = new LayerSwitcher({
  options: {
    // position: 'top-right',
    collapsed: true,
    panel: true,
    counter: true,
    allowEdit: true,
    headerButtons: [
      {
        id: "add-layer-layerswitcher",
        label: "Ajouter",
        icon: "fr-icon-add-line",
        cb: addLayer,
      }
    ],
    advancedTools: [
      {
        key: LayerSwitcher.switcherButtons.INFO
      },
      {
        label: 'Style',
        icon: 'fr-icon-brush-line',
        attributes: {
          'data-action': "edit-layer-style",
          "aria-controls": leftPanel.getId(),
        },
        cb: (e, instance, layer, options) => {
          carte.selectedLayer = layer;
          carte.dispatchEvent({
            type: 'selected:layer:change',
            layer: layer,
            options: options,
          })
          Action.open(e);
          // open(e, instance, layer, options);
        }
      },
      {
        label: 'Paramètres',
        icon: 'fr-icon-settings-5-line',
        attributes: {
          "aria-controls": modal.getId(),
        },
        cb: (e) => {
          Action.open(e);
        }
      },
    ]
  }
});

// Passe le bouton en primary
let switcherBtn = switcher.container.querySelector("[id^=GPshowLayersListPicto]");
switcherBtn.classList.remove('fr-btn--tertiary', 'gpf-btn--tertiary');
switcherBtn.classList.add('gpf-btn--primary');

export default switcher;