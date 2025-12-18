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
})


/**
 * UNIQUEMENT EN TEST, SI LOGIN NON SOUHAITÉ
*/
introDialog.setAction(connectActionTest);
// introDialog.setAction(connectAction);
introDialog.open();

/* DEBUG */
window.carte = carte;
window.api = api;
/**/