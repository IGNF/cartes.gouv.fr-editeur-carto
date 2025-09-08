import Action from '../Action.js';
import content from './importLocal.html?raw';
import './importLocal.scss';
import carte from '../../carte.js';
import message from '../../utils/message.js';

import * as importLocal from './importLocal.js';
import * as errors from '../../utils/errors.js';

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

  let form = dialog.querySelector('form');
  form.addEventListener('submit', submitForm);

  let input = dialog.querySelector('input[type="file"]');
  input.accept = importLocal.accepted.join(',');
  input.addEventListener('change', (e) => message.removeMessage(e.target))
}

/**
 * Gère l'envoi du formulaire.
 * 
 * @param {SubmitEvent} e Événement submit du formulaire.
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

      message.addMessage(input, 'Chargement en cours', { type: 'info', append: false });
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;

      const promises = await importLocal.importFile(file);

      message.removeMessage(input);
      // setTimeout(() => form.querySelector('[type="submit"]').disabled = false, 500);

      promises.forEach(promise => {
        if (promise.status === "fulfilled") {
          const layer = promise.value
          if (layer.getSource().getFeatures().length) {
            carte.addLayer(layer);
            message.addMessage(input, `La couche ${layer.get('title')} a été ajouté à votre carte.`, { type: 'valid', append: true });
          } else {
            message.addMessage(input, `La couche ${layer.get('title')} ne contient pas de données.`, { type: 'warning', append: true });
          }
        } else {
          handleError(promise.reason, form, file, true);
        }
      });
      submit.disabled = false;
    }
  } catch (err) {
    handleError(err, form, file);
  }
}

/**
 * Gère les erreurs en affichant les bons messages.
 * 
 * @param {Error} err Erreur à gérer
 * @param {HTMLFormElement} form Formulaire d'import
 * @param {File} file Fichier dont l'erreur provient
 * @param {boolean} [append] Optionnel. Ajoute le message d'erreur si vrai.
 * Par défaut : `false` 
 */
function handleError(err, form, file, append = false) {
  let options = {
    append: append
  };
  let input = form.querySelector('input');
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
  form.querySelector('[type="submit"]').disabled = false;
}

const importLocalAction = new Action({
  id: 'import-local',
  title: 'Importer une donnée locale',
  icon: 'ri-file-upload-line',
  onOpen: onOpen,
  content: content,
})

export default importLocalAction;
