import Action from '../Action.js';
import content from './importLocal.html?raw';
import './importLocal.scss';
import carte from '../../carte.js';
import message from '../../utils/message.js';

import * as importLocal from './importLocal.js';
import * as errors from '../../utils/errors.js';
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

  let form = dialog.querySelector('form');
  form.addEventListener('submit', submitForm);

  let input = dialog.querySelector('input[type="file"]');
  input.accept = importLocal.accepted.join(',');
  input.addEventListener('change', (e) => message.removeMessage(e.target))
}

/**
 * 
 * @param {SubmitEvent} e 
 */
async function submitForm(e) {
  e.preventDefault();
  let form = e.target;
  let input = form.querySelector('input');
  let inputFile = input.files.item(0);
  const formData = new FormData(form);
  const file = formData.get('file');

  try {
    if (importLocal.checkFile(inputFile)) {
      message.removeMessage(input);

      const promises = await importLocal.importFile(file);

      promises.forEach(promise => {
        if (promise.status === "fulfilled") {
          const layer = promise.value
          carte.addLayer(layer);
          message.addMessage(input, `Le fichier ${layer.get('title')} a été ajouté à vos couches.`, { error: false, append: true });
        } else {
          handleError(promise.reason, input, file, true);
        }
      });

    }
  } catch (err) {
    handleError(err, input, file);
  }
}

function handleError(err, input, file, append = false) {
  let options = {
    append: append
  };
  switch (true) {
    case err instanceof errors.MissingFileError:
      message.addMessage(input, "Fichier manquant", options);
      break;

    case err instanceof errors.UnsupportedExtensionError:
      message.addMessage(input, `Format non supporté: ${err.message}`, options);
      break;

    case err instanceof errors.EmptyLayerError:
      message.addMessage(input, `Le fichier ${err.message} ne contient aucun objet valide`, options);
      break;

    case err instanceof errors.MissingFileInZipError:
      message.addMessage(input, `Fichier manquant dans l'archive: ${err.message}`, options);
      break;

    default:
      message.addMessage(input, `Le fichier ${file.name} n'a pas pu être correctement importé.`, options);
      console.error(err);
      break;
  }
}

const importLocalAction = new Action({
  id: 'import-local',
  title: 'Importer une donnée locale',
  icon: 'ri-file-upload-line',
  onOpen: onOpen,
  content: content,
})

export default importLocalAction;
// export { accepted, addMessage, removeMessage, processFile };