import Action from '../Action.js';
import editStyleItem from './edit-style.js';
import editTexteItem from './edit-texte.js';
import editInfobulleItem from './edit-infobulle.js';
import editAttributeItem from './edit-attribute.js';
import './editLayerStyle.scss';

function onOpen(e) {
  let dialog = editLayerAction.getDialog();
}

const editLayerAction = new Action({
  title: 'Point',
  icon: 'ri-global-line',
  onOpen: onOpen,
  // content: content,
  items: [editStyleItem, editTexteItem, editInfobulleItem, editAttributeItem]
})

export default editLayerAction;