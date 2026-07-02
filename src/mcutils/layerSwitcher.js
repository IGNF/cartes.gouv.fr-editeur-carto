
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
import editLayerInfoAction from '../actions/editLayerInfo/editLayerInfoAction.js';
import editLayerPopupAction from '../actions/editLayerPopup/editLayerPopupAction.js';

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
        label: 'Info',
        icon: 'fr-icon-information-line',
        attributes: {
          "aria-controls": modal.getId(),
          'data-action': editLayerInfoAction.id,
          'data-fr-opened': 'false'
        },
        cb: (e, instance, layer, options) => {
          // Enregistre les informations dans l'action
          editLayerInfoAction.layer = layer;

          // Config : vient du gestionnaire de couche
          editLayerInfoAction.options = options
          editLayerInfoAction.layerSwitcher = instance;

          Action.open(e);
        }
      },
      {
        label: 'Style',
        icon: 'fr-icon-brush-line',
        attributes: {
          "aria-controls": leftPanel.getElement()?.id,
          'data-action': editLayerStyleAction.id,
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
            Action.open(e);
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
        label: 'Infobulle',
        icon: 'fr-icon-chat-quote-line',
        attributes: {
          "aria-controls": leftPanel.getElement()?.id,
          'data-action': editLayerPopupAction.id,
        },
        cb: (e, instance, layer, options) => {
          if (carte.getControl("left-panel") === undefined) {
            leftPanel.setTarget()
            carte.addControl("left-panel", leftPanel);
          }
          carte.selectedLayer = layer;
          editLayerPopupAction.layer = layer;
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

// Modifie l'ordre des couches lors d'un repositionnement
switcher.on("layerswitcher:change:position", (e) => {
  const position = e.position;
  const layer = e.layer?.layer;
  if (position !== undefined && layer !== undefined) {
    const collection = switcher.getMap().getLayers();

    // Trouve et enlève la couche
    // Ne passe pas par collection.insertAt etc. pour éviter les envois d'événements
    const length = collection.getArray().length;
    for (let i = 0; i < length; ++i) {
      if (collection.getArray()[i] === layer) {
        // L'ordre est inversé entre l'ordre des couches (map.getLayer())
        // et l'ordre du layer switcher
        const index = (length - 1 - position);
        // Élément trouvé, on l'enlève et on insert ensuite l'élément
        if (i !== index) {
          // L'élément a bien été déplacé : on l'enlève et on le place autre part
          collection.getArray().splice(i, 1);
          // Place l'élément au bon endroit
          collection.getArray().splice(index, 0, layer);
        }
        break;
      }
    }
  }
})

export default switcher;