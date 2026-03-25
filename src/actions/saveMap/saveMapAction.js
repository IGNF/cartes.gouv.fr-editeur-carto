import Action from '../Action.js';
import carte from '../../carte.js';
import api from 'mcutils/api/api.js';
import content from './saveMap.html?raw';
import ol_ext_element from 'ol-ext/util/element.js';
import { transformExtent } from 'ol/proj'
import notification from '../../control/Notification/notification.js';
import { addMessage } from '../../utils/message.js';
import savingContent from './saving.html?raw';


let GPFThemes = [];

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
  const metadata = carte.get('atlas') || {};
  console.log('metadata', metadata);
  
  // Title
  const inputTitle = dialog.querySelector('[data-field="title"]');
  inputTitle.value = metadata.title || '';

  // Theme
  const select = dialog.querySelector('[data-field="theme"]');
  if (GPFThemes.length) {
    addThemes(GPFThemes, select);
    select.value = metadata.theme_id || '';
  } else {
    api.getThemes((themes) => {
      GPFThemes = themes;
      if (themes.length) {
        addThemes(themes, select);
        select.value = metadata.theme_id || '';
      }
    });
  }

  // Description
  const inputDescription = dialog.querySelector('[data-field="description"]');
  inputDescription.value = metadata.description || ''; 
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

/** Save current Carte to server */
function saveMap(e) {
  // Input values
  const inputName = dialog.querySelector('[data-field="title"]');
  const select = dialog.querySelector('[data-field="theme"]');
  const inputDescription = dialog.querySelector('[data-field="description"]');
  // Check mandatory
  if (!inputName.value) {
    addMessage(inputName, 'Le nom de la carte est obligatoire...', { type: 'error' });
    inputName.focus();
    return;
  }
  if (!select.value) {
    addMessage(select, 'Le thème est obligatoire...', { type: 'error' });
    select.focus();
    return;
  }

  let metadata = carte.get('atlas');
  metadata.type = 'macarte';
  metadata.active = true;
  // Premium EDUGEO
  metadata.premium = api.getPremium();
  metadata.bbox = transformExtent(
    carte.getMap().getView().calculateExtent(), 
    carte.getMap().getView().getProjection(), 
    'EPSG:4326'
  );
  const toUpdate = {};
  if (metadata.title !== inputName.value) {
    toUpdate.title = inputName.value;
  }
  if (metadata.theme_id !== select.value) {
    toUpdate.theme_id = select.value;
    toUpdate.theme = select.options[select.selectedIndex].text;
  }
  if (metadata.description !== inputDescription.value) {
    toUpdate.description = inputDescription.value;
  }
  // New Data
  metadata.title = inputName.value;
  metadata.description = inputDescription.value;
  metadata.theme_id = select.value;
  metadata.theme = select.options[select.selectedIndex].text;
  metadata.img_url = '';
  metadata.organization_id = '';
  metadata.share = 'public';

  // Write carte data
  const data = carte.write();

  // Post the map
  const postMap = function() {
    // Do something when post
    function onpost(response) {
      if (response.status == 401) {
        // Connect and iterate
        // connectAction().then(postMap);
        console.error('Unauthorized, please login to save the map');
        notification.error('Vous devez être connecté pour enregistrer une carte...');
      } else if (response.status == 418) {
        console.error('Map size limit exceeded');
        notification.error('La taille de la carte dépasse la limite autorisée par le serveur...');
      } else if (response.status) {
        console.error('Error saving map', response);
        notification.error('Une erreur est survenue lors de l\'enregistrement de la carte...' + (response.message ? ` (${response.message})` : ''));
      } else {
        // Update id
        if (response.view_id) {
          carte.set('id', response.view_id);
        }
        // Get save info
        if (!metadata.edit_id) {
          carte.set('atlas', response);
        }
        notification.info('La carte a bien été enregistrée...')
        carte.dispatchEvent({ type: 'save' })
      }
      // Close dialog
      dialog.close();
    }
    function post() {
      console.log('Posting map...', metadata, data);
      dialog.setDialogContent(savingContent);
      dialog.setButtons();
      // Post or update
      if (metadata.edit_id) {
        if (Object.keys(toUpdate).length) {
          api.updateMap(metadata.edit_id, toUpdate, e => {
            api.updateMapFile(metadata.edit_id, data, onpost);
          });
        } else {
          api.updateMapFile(metadata.edit_id, data, onpost);
        }
      } else {
        api.postMap(metadata, data, onpost);
      }
    }
    // Test size
    /** test size before sending to server, if size is too big, ask user to confirm 
    const size = api.testMapSize(data);
    if (size === true) {
      post();
    } else {
      // TOO BIG
      console.warn('Map size (' + size + ' bytes) exceeds the limit allowed by the server');
      post();
    }
    /*/
    post();
    /**/
  }
  // Try to post the map
  postMap();
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