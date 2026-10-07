import Action from '../../actions/Action.js';
import content from './connect.html?raw';
import './connect.scss';

import carte from '../../carte.js';
import charte from '../../charte/charte.js';
import dirty, { setDirty } from '../../utils/dirtyMap';
import { setInert, unsetInert } from '../../utils/inert.js';

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
  setInert(carte);
}

function closeDialog() {
  dialog.close();
  unsetInert(carte);
  charte.setCompact(true);
}

const connectAction = new Action({
  id: 'connect',
  title: 'Créer votre carte',
  content: content,
  buttons: [{
    label: 'Voir mes cartes',
    kind: 1,
    markup: 'a',
    href: '/tableau-de-bord/editeur/cartes',
  }, {
    label: 'Créer une carte',
    className: 'fr-icon-arrow-right-s-line fr-btn--icon-right',
    kind: 0,
    close: true,
    callback: e => {
      closeDialog(e);
      
      // Active les notifications de changement de carte après être entré dans la carte
      carte.on('change', () => setDirty(true));
      carte.getMap().getLayerGroup().on('change', () => setDirty(true));
      carte.on(['read', 'save'], () => setDirty(false));

      /** Map has changed */
      carte.hasChanged = function () {
        return dirty;
      }
    }
  }],
  onOpen: onOpen
});

export default connectAction;