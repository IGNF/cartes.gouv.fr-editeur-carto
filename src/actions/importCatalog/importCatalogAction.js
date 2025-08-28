import Action from '../Action.js';
import content from './importCatalog.html?raw';
import './importCatalog.scss';

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
  dialog = e.target;
}

const importCatalogAction = new Action({
  title: 'Catalogue de cartes',
  icon: 'fr-icon-ign-map-line',
  content: content,
  onOpen: onOpen
})

export default importCatalogAction;