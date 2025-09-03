import Action from '../Action.js';
import editStyleItem from './edit-style.js';
import editTexteItem from './edit-texte.js';
import editInfobulleItem from './edit-infobulle.js';
import editAttributeItem from './edit-attribute.js';
import './editLayerStyle.scss';

/**
 * @type {import('../../control/Dialog/Dialog.js').default}
 * Dialog utilisé par l'action 
 */
// let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/Dialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen() {
  // dialog = e.target;
}

const editLayerAction = new Action({
  title: 'Point',
  icon: 'ri-global-line',
  onOpen: onOpen,
  items: [editStyleItem, editTexteItem, editInfobulleItem, editAttributeItem]
})

export default editLayerAction;