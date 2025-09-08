import modal from '../../dialogs/modal.js';
import Action from '../../actions/Action.js';
import content from './connect.html?raw';
import * as connect from './connect.js';
import './connect.scss';

import message from '../../utils/message.js';
import * as errors from '../../utils/errors.js';
import introDialog from '../../dialogs/introDialog.js';
import api from 'mcutils/api/api.js';
import { setUser } from '../../charte/utils.js';


/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target;
  api.whoami(setUser);
}

function onConnect(e) {
  Action.open(e);
  api.on('login', onLogin);
}

function onLogin() {
  dialog.onClose(() => {
    dialog.setAction(connectAction);
  }, true)
  api.un('login', onLogin);
}

const connectAction = new Action({
  id: 'connect',
  title: 'Créer votre carte',
  content: content,
  buttons: [{
    label: 'Connectez-vous pour commencer',
    className: 'disconnected fr-icon-arrow-right-s-line fr-btn--icon-right',
    kind: 0,
    'data-action': 'login',
    'aria-controls': introDialog.getId(),
    callback: onConnect
  }, {
    label: 'Voir mes cartes',
    className: 'view connected',
    kind: 1,
    'data-action': 'open-map',
    'aria-controls': modal.getId(),
    callback: (e) => {
      Action.open(e),
        dialog.close()
    }
  }, {
    label: 'Créer une carte',
    className: 'create connected fr-icon-arrow-right-s-line fr-btn--icon-right',
    kind: 0,
    close: true,
    callback: () => dialog.close()
  }],
  onOpen: onOpen
});

export default connectAction;