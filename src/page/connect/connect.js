
import introDialog from '../../dialogs/introDialog.js'
import loginDialog from '../../loginDialog.js';
import modal from '../../modal.js';
import Action from '../../actions/Action.js';

import contentHTML from './connect.html?raw';
import './connect.scss';

const connectAction = new Action({
  id: 'connect',
  title: 'Créer votre carte',
  content: contentHTML,
  buttons: [
    {
      label: "Connectez-vous pour commencer",
      className: 'disconnected fr-icon-arrow-right-s-line fr-btn--icon-right',
      kind: 0,
      close: true,
      'data-action': 'login',
      'aria-controls': loginDialog.getId(),
      callback: e => {
        delete document.body.dataset.disconnected;
        Action.open(e)
      }
    },
    {
      label: "Voir mes cartes",
      className: 'view connected',
      kind: 1,
      close: true,
      'data-action': 'open-map',
      'aria-controls': modal.getId(),
      callback: e => {
        Action.open(e),
        introDialog.close()
      }
    },
    {
      label: "Créer une carte",
      className: 'create connected fr-icon-arrow-right-s-line fr-btn--icon-right',
      kind: 0,
      close: true,
      callback: () => introDialog.close()
    }
  ],
  onOpen: () => {}
});


/* intro dialog */
introDialog.setAction(connectAction);
introDialog.open()
