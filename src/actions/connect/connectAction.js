import Action from '../../actions/Action.js';
import content from './connect.html?raw';
import './connect.scss';

import introDialog from '../../dialogs/introDialog.js';
import api from 'mcutils/api/api.js';
import { isInertAvailable, setUser } from '../../charte/utils.js';
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
  api.whoami(setUser);
  setInert();
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
    markup: 'a',
    target: '_blank',
    href: '#',
    callback: closeDialog
  }, {
    label: 'Créer une carte',
    className: 'create connected fr-icon-arrow-right-s-line fr-btn--icon-right',
    kind: 0,
    close: true,
    callback: closeDialog
  }],
  onOpen: onOpen
});

export default connectAction;