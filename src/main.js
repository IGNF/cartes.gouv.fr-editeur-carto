import './version.js'
import './charte/dsfr.js'
import './charte/navigation.js'
import './actions/actions.js'

import carte from './carte.js'
import api from 'mcutils/api/api.js'

import switcher from './mcutils/layerSwitcher.js';

import './page/page.js'

// Custom CSS
import 'remixicon/fonts/remixicon.css'
import './css/index.scss';

// Ajout du layerSwitcher (gère le )
carte.once('read', () => {
  carte.addControl('layerSwitcher', switcher)
})

/* DEBUG */
window.carte = carte;
window.api = api;
/**/