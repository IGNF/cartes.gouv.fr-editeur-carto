import './version.js'
import './charte/dsfr.js'
import './charte/navigation.js'
import './actions/actions.js'

import carte from './carte.js'
import api from './mcutils/api.js'
import introDialog from './dialogs/introDialog.js'
// import connectAction from './actions/connect/connectAction.js'
import connectActionTest from './actions/alreadyConnected/connectAction.js'

import switcher from './mcutils/layerSwitcher.js';
import search from './mcutils/search.js';

import './page/page.js'

// Custom CSS
import 'remixicon/fonts/remixicon.css'
import './css/index.scss';

// Ajout des contrôles
carte.once('read', () => {
  carte.addControl('layerSwitcher', switcher);
  carte.addControl('search', search);
  carte.getMap().getOverlayContainerStopEvent().style.cursor = "auto";
  // switcher.setSelectedLayer(switcher)
  try {
    switcher.setSelectedLayer(switcher._layers[1].layer, true)
    // console.log(switcher._layers[1].layer)
    // switcher._layers[1].layer?.getLayer()?.setStyle();
    // console.log(carte.getSelect())
    // switcher._layers[1].layer.getLayer().setStyle(carte.getSelect().getStyle());
  } catch (error) {
    console.warn("aucune couche sélectionnée");
  }
})

switcher.on(switcher.ADD_LAYER_EVENT, (e) => {
  console.log(e)
})


/**
 * UNIQUEMENT EN TEST, SI LOGIN NON SOUHAITÉ
*/
introDialog.setAction(connectActionTest);
// introDialog.setAction(connectAction);
introDialog.open();

/* DEBUG */
document.addEventListener('keydown', e => console.log('keydown', e));
document.addEventListener('keyup', e => console.log('keyup', e));

window.carte = carte;
window.api = api;
/**/