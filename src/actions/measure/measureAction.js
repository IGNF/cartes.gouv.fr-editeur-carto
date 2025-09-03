import Action from '../Action.js';
import './measure.scss';
import carte from '../../carte.js';
import { createBar } from './measure.js';



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
  carte.removeControl('measure-bar');
  carte.addControl('measure-bar', bar);
}


/**
 * Fonction à la fermeture du dialog.
 */
function onClose() {
  // Désactive les contrôles actifs
  let bar = carte.getControl('measure-bar');
  if (bar) {
    let controls = bar.getActiveControls();
    controls.forEach(control => {
      control.setActive(false);
    });
    carte.removeControl('measure-bar');
  }
}

const measureAction = new Action({
  id: 'measure',
  title: 'Outils de mesure',
  icon: 'ri-ruler-line',
  onOpen: onOpen,
  onClose: onClose,
  size: 'md',
})

export default measureAction;