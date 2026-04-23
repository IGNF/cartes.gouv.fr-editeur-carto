import './version.js'
import './charte/dsfr.js'
import './charte/navigation.js'
import './actions/actions.js'
import loadFonts from 'mcutils/cgouv/loadFonts.js'

import story from './story.js'
import carte from './carte.js'
import './utils/dirtyMap.js';

import api from './mcutils/api.js'
import introDialog from './dialogs/introDialog.js'
import connectAction from './actions/connect/connectAction.js'
import connectActionTest from './actions/alreadyConnected/connectAction.js'

import switcher from './mcutils/layerSwitcher.js';
import search from './mcutils/search.js';

import './page/page.js'

// Custom CSS
import 'remixicon/fonts/remixicon.css'
import './css/index.scss';

loadFonts()

// Ajout des contrôles
carte.once('read', () => {
  carte.addControl('layerSwitcher', switcher);
  carte.addControl('search', search);
  carte.getMap().getOverlayContainerStopEvent().style.cursor = "auto";
  try {
    switcher.setSelectedLayer(switcher._layers[1].layer, true)
  } catch (error) {
    console.warn("aucune couche sélectionnée", error);
  }
})

switcher.on(switcher.ADD_LAYER_EVENT, (e) => {
  console.log(e)
})


/**
 * UNIQUEMENT EN TEST, SI LOGIN NON SOUHAITÉ
*/
// introDialog.setAction(connectActionTest);
introDialog.setAction(connectAction);
introDialog.open();

/* DEBUG */
window.story = story;
window.carte = carte;
window.api = api;
/**/