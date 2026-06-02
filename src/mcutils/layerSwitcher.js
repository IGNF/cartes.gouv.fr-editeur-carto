
import { LayerSwitcher } from 'geopf-extensions-openlayers/src/index.js';
// import carte from '../carte.js';
import { carte } from '../story.js';
import addLayer from './addLayer.js';
import Action from '../actions/Action.js';
import modal from '../dialogs/modal.js';
import editLayerStyleAction from '../actions/editLayerStyle/editLayerStyleAction.js';
import "./layerSwitcher.scss";
import BaseEvent from 'ol/events/Event.js';
import leftPanel from '../dialogs/leftPanel.js';
import VectorSource from 'ol/source/Vector.js';
import Alert from '../control/Alert/Alert.js';

const switcher = new LayerSwitcher({
  options: {
    // position: 'top-right',
    collapsed: true,
    panel: true,
    counter: true,
    allowEdit: true,
    label: "Couches",
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
        // MODIFIER BOUTON INFOS POUR OUVRIR MODALE
        key: LayerSwitcher.switcherButtons.INFO
      },
      {
        label: 'Style',
        icon: 'fr-icon-brush-line',
        attributes: {
          "aria-controls": leftPanel.getElement()?.id,
          'data-action': editLayerStyleAction._id,
        },
        cb: (e, instance, layer, options) => {
          if (carte.getControl("left-panel") === undefined) {
            leftPanel.setTarget()
            carte.addControl("left-panel", leftPanel);
          }
          carte.selectedLayer = layer;
          carte.dispatchEvent(new BaseEvent({
            type: 'selected:layer:change',
            layer: layer,
            options: options,
          }))
          // Vérifie que la couche est modifiable
          if (layer?.getSource() instanceof VectorSource) {
            editLayerStyleAction.layer = layer;
            const { action } = Action.open(e);
          } else {
            // Vérifie si on peut modifier le style
            const tms = (options?.layer?.config && options?.layer?.config?.serviceParams?.id === "GPP:TMS");
            const styles = tms ? options?.layer?.config?.styles : null;
            if (tms && styles.length > 1) {
              instance._onEditLayerStyleClick(e, styles);
            } else {
              const alertId = `layer-not-editable--${layer.gpLayerId ?? ''}`
              // Affiche un message à l'utilisateur
              Alert.addAlert({
                id: alertId,
                description: "Le style de cette couche n'est pas modifiable",
                size: "sm",
                type: Alert.TYPES.WARNING,
              }, true)
            }
          }
        }
      },
      {
        label: 'Paramètres',
        icon: 'fr-icon-settings-5-line',
        attributes: {
          "aria-controls": modal.getId(),
        },
        cb: (e, instance, layer, options) => {
          Action.open(e);
        }
      },
    ]
  }
});

// Enlève la classe gpf-mobile-fullscreen
switcher.container.classList.remove("gpf-mobile-fullscreen")

// Passe le bouton en primary
let switcherBtn = switcher.container.querySelector("[id^=GPshowLayersListPicto]");
switcherBtn.ariaLabel = "Couches";
switcherBtn.classList.remove('fr-btn--tertiary', 'gpf-btn--tertiary');
switcherBtn.classList.add('gpf-btn--primary');

export default switcher;