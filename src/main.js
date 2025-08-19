import './version'
import './charte/dsfr.js'
import './charte/navigation.js'

import carte from './carte.js'
import api from 'mcutils/api/api.js'
import account from './charte/nav-user.js'

import './page/connect/connect.js'
import './page/edit-bar/edit-bar.js'
import './page/step-bar/step-bar.js'
import './page/file-bar/file-bar.js'

// Custom CSS
import 'remixicon/fonts/remixicon.css'
import './css/index.scss';

/* DEBUG */
window.carte = carte;
window.api = api;
/**/

function setUser(e) {
  if (e) {
    account.setMenu('user', {
      label: e.username,
      info: e.email
    })
  } else {
  }
}

api.whoami(setUser)

api.on('me', setUser)