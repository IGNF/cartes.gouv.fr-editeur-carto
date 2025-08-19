import Action from '../Action.js';
import carte from '../../carte.js';
import content from './renameMap.html?raw';

function onOpen(e) {
  let input = e.target.querySelector('[data-field="title"]');
  let title = carte.get('title') || carte.getMap().get('title');
  input.value = title ? title : '';
}
function renameMap(e) {
  let dialog = renameMapAction.getDialog()

  let input = dialog.getDialog().querySelector('[data-field="title"]');

  if (input.value) {
    carte.set('title', input.value);
    carte.getMap().set('title', input.value);
  }

  dialog.close()
}

const renameMapAction = new Action({
  title: 'Renommer',
  content: content,
  buttons: [
    {
      label: "Enregistrer",
      kind: 0,
      callback: renameMap
    },
    {
      label: "Annuler",
      kind: 1,
      close: true
    }
  ],
  onOpen: onOpen
});

export default renameMapAction;