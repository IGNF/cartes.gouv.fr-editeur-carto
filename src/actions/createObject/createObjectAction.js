import carte from '../../carte.js';
import Action from '../Action.js';
import { createBar } from './createObject.js';
import './createObject.scss';

/**
 * @type {import('../../control/Dialog/Dialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/Dialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target
  let bar = createBar(dialog.getModalContent());
  carte.removeControl('create-object-bar');
  carte.addControl('create-object-bar', bar);
  dialog.onClose(onClose, true);
}


/**
 * Fonction à la fermeture du dialog.
 */
function onClose() {
  // Désactive les contrôles actifs
  let bar = carte.getControl('create-object-bar');
  if (bar) {
    let controls = bar.getActiveControls();
    controls.forEach(control => {
      control.setActive(false);
    });
  }
  carte.removeControl('create-object-bar');
}

const createObjectAction = new Action({
  title: 'Annoter la carte',
  icon: 'ri-pen-nib-line',
  onOpen: onOpen,
})

export default createObjectAction;