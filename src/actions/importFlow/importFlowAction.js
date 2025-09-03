import Action from '../Action.js';
import content from './importFlow.html?raw';
import './importFlow.scss';

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
  dialog = e.target
}

const importFlowAction = new Action({
  id: 'import-flow',
  title: 'Importer un flux',
  icon: 'ri-global-line',
  onOpen: onOpen,
  content: content,
})

export default importFlowAction;