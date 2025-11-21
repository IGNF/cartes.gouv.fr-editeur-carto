import Action from '../../actions/Action.js';
import content from './connect.html?raw';
import './connect.scss';

import { isInertAvailable } from '../../charte/utils.js';
import carte from '../../carte.js';


/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

// Interactions sur la carte
let interactions = {};

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target;
  setInert();
  dialog.getButtons().item(0).style = "margin-left: 1rem;"
}

/**
 * Bloque les interactions avec la carte
 */
function setInert() {
  const inert = carte.getMap().getTargetElement().inert;
  if (!inert) {
    carte.getMap().getTargetElement().inert = true;

    // Inert non supporté : empêche les interactions et cache les éléments
    if (!isInertAvailable()) {
      carte.getMap().getTargetElement().classList.add('inert-legacy');
      carte.getMap().getInteractions().forEach(i => {
        // Pour ne réactiver que les interactions active plus tard
        interactions[i.ol_uid] = i.getActive();
        i.setActive(false);
      })
    }
  }
}

/**
 * Ajoute un élément HTML sur l'application pour bloquer la carte
 */
function unsetInert() {
  carte.getMap().getTargetElement().inert = false;

  if (!isInertAvailable()) {
    carte.getMap().getTargetElement().classList.remove('inert-legacy')
    carte.getMap().getInteractions().forEach(i => {
      // Réactive les interactions
      const active = interactions[i.ol_uid];
      i.setActive(active);
    })
  }
}

function closeDialog() {
  dialog.close();
  unsetInert();
}

const connectActionTest = new Action({
  id: 'connect-test',
  title: 'Créer votre carte',
  content: content,
  buttons: [{
    label: 'Voir mes cartes',
    className: 'view',
    kind: 1,
    markup: 'a',
    href: '#',
    callback: closeDialog
  }, {
    label: 'Créer une carte',
    className: 'create fr-icon-arrow-right-s-line fr-btn--icon-right',
    kind: 0,
    close: true,
    callback: closeDialog
  }],
  onOpen: onOpen
});

export default connectActionTest;