import Action from '../Action.js';
import i18next from '../../i18n/index';
import carte from '../../carte.js';
import content from './renameMap.html?raw';
import { translateHtml } from '../../i18n/translateHtml';
import { api } from '../../api/index.js';

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
  let input = dialog.querySelector('[data-field="title"]');
  input.value = carte.getTitle(true);
}

async function renameMap() {
  let input = dialog.querySelector('[data-field="title"]');

  // Permet la modification
  if (input.value && carte.get("atlas")?.edit_id) {
    const metadata = carte.get("atlas");
    carte.set('title', input.value);
    carte.getMap().set('title', input.value);
    metadata.title = input.value;
    await api.map.patchMapByEditId(metadata.edit_id, {
      title: input.value
    });
  }

  dialog.close()
}

const renameMapAction = new Action({
  id: 'rename-map',
  title: i18next.t('actions:rename-map.title'),
  content: translateHtml(content),
  buttons: [
    {
      label: i18next.t('common:save'),
      kind: 0,
      callback: renameMap
    },
    {
      label: i18next.t('common:cancel'),
      kind: 1,
      close: true
    }
  ],
  onOpen: onOpen
});

export default renameMapAction;