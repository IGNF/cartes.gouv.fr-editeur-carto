import Action from '../Action.js';
import carte from '../../carte.js';
import api from 'mcutils/api/api.js';
import content from './saveMap.html?raw';
import ol_ext_element from 'ol-ext/util/element.js';


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
  let title = carte.get('title') || carte.getMap().get('title');
  input.value = title ? title : '';

  let select = dialog.querySelector('[data-field="theme"]');
  api.getThemes((themes) => {
    if (themes.length) {
      addThemes(themes, select);
    }
  });
}

function addThemes(themes, select) {
  Object.keys(themes).forEach(key => {
    let { id, name } = themes[key]
    let option = ol_ext_element.create('option', {
      value: id,
      html: name,
    })
    select.appendChild(option);
  });
}

function saveMap() {
  // let inputName = dialog.querySelector('[data-field="title"]');
  // let select = dialog.querySelector('[data-field="theme"]');
}

const saveMapAction = new Action({
  id: 'save-map',
  title: 'Enregistrer',
  content: content,
  buttons: [
    {
      label: "Enregistrer",
      kind: 0,
      callback: saveMap,
    },
    {
      label: "Annuler",
      kind: 1,
      close: true
    }
  ],
  onOpen: onOpen
});

export default saveMapAction;