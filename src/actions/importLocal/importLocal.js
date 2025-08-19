import Action from '../Action.js';
import content from './importLocal.html?raw';
import './importLocal.scss';
import { getUid } from '../../charte/utils.js';
import carte from '../../carte.js';
import { getValidFeatures, loadFile } from 'mcutils/dialog/dialogImportFile'

import VectorSource from 'ol/source/Vector';
import VectorStyle from 'mcutils/layer/VectorStyle';
import VectorLayer from 'ol/layer/Vector';

// https://www.iana.org/assignments/media-types/media-types.xhtml

const accepted = [
  'application/geo+json',
  'application/json',
  'application/vnd.google-earth.kml+xml',
  'application/geopackage+sqlite3',
  // 'application/vnd.gpxsee.map+xml',
  'application/gpx+xml',
  '.gpx',
]

function onOpen(e) {
  let dialog = importLocalAction.getDialog();

  let form = dialog.selectElement('form');
  form.addEventListener('submit', importFile);

  let input = dialog.selectElement('input[type="file"]');
  input.accept = accepted.join(',');

  let importAgain = dialog.selectAllElements('[data-action="import-again"]');
  importAgain.forEach(button => {
    button.addEventListener('click', resetForm)
  })


}

function resetForm(e) {
  let dialog = importLocalAction.getDialog();

  let dataStatus = dialog.selectElement('[data-status]')
  dataStatus.dataset.status = 'default'

  let input = dialog.selectElement('input')
  input.value = '';
}

/**
 * 
 * @param {HTMLFormElement} form 
 */
function validateForm(form) {
  // Input du fichier
  let fileInput = form.querySelector('input')
  const file = fileInput.files.item(0);
  if (!file) {
    addMessage(fileInput, 'Fichier manquant');
    return false;
  } else if (!accepted.includes(file.type)) {
    addMessage(fileInput, 'Format non supporté');
    return false;
  }
  removeMessage(fileInput);

  return true;
}

/**
 * Ajoute une erreur lié à un input / select.
 * 
 * L'input doit avoir un élément pour le message, défini par
 * l'attribut `aria-describedby`.
 * 
 * L'input doit être compris dans un autre élément, dont le
 * tag est défini par le paramètre `closest`.
 * La classe de cet élément doit contenir 'groupe' ou doit être
 * 'fr-fieldset' et sera utilisée pour ajouter la classe globale
 * de validation ou d'erreur.
 * 
 * Si error est vrai, ajoute un message d'erreur.
 * Sinon, ajouter un message de succès.
 * 
 * @param {Element} input Input sur lequel ajouter le message.
 * @param {String} message Message à ajouter.
 * @param {Object} options Options à ajouter
 * @param {Boolean} options.error Optionnel. Définit si c'est une erreur ou un succès
 * @param {String} options.closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 * @param {String} options.append Optionnel. Si vrai, ajoute le message
 * aux autres messages. Sinon, enlève les messages existants. Par défaut `false`.
 */
function addMessage(input, message, options) {
  options = options ? options : {};
  options.closest = options.closest ? options.closest : 'div';
  options.error = options.error === undefined ? true : options.error;
  // Classe à ajouter au message
  const msgClass = options.error ? '--error' : '--valid';
  // Classe à enlever sur l'élément englobant
  const removedClass = options.error ? '--valid' : '--error';

  // Récupère les éléments importants
  const msgId = input.getAttribute('aria-describedby');
  let element = input.closest(options.closest);
  let msg = element.querySelector(`#${msgId}`);
  if (!element) return;

  // Ajoute les classes à l'élément
  let elementClass = element.classList.item(0);
  element.classList.add(elementClass + msgClass);
  element.classList.remove(elementClass + removedClass);

  // Ajoute le message en enlevant les autres
  if (!options.append) msg.replaceChildren();
  const p = document.createElement('p');
  p.classList.add('fr-message', `fr-message${msgClass}`);
  p.id = getUid(`fr-message${msgClass}`);
  p.textContent = message;
  msg.appendChild(p)
}

/**
 * 
 * @param {Element} input Input sur lequel ajouter le message.
 * @param {String} closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 */
function removeMessage(input, closest = 'div') {

  // Récupère les éléments importants
  const msgId = input.getAttribute('aria-describedby');
  let element = input.closest(closest);
  let msg = element.querySelector(`#${msgId}`);
  if (!element) return;

  let elementClass = element.classList.item(0);
  element.classList.remove(elementClass + '--valid', elementClass + '--error');

  msg.replaceChildren();
}

/**
 * 
 * @param {SubmitEvent} e 
 */
function importFile(e) {
  e.preventDefault();

  let form = e.target
  let dialog = importLocalAction.getDialog();

  let dataStatus = dialog.selectElement('[data-status]')
  if (validateForm(form)) {
    const formData = new FormData(form);

    loadFile(formData.get('file'), (e) => processFile(e, form), { silent: true })
  } else {
    dataStatus.dataset.status = 'error'
  }
}

/**
 * Function permettant de gérer le fichier une fois lu.
 * Ajoute la couche à la carte si c'est bon.
 * 
 * @param {Object} result Résultat de la fonction de lecture du fichier
 * @param {Array<import("ol").Feature>|boolean} result.features
 * Array de features à ajouter. Faux si aucune feature n'est à ajouter.
 * @param {String} result.name Nom de la couche.
 * @param {String} result.fileName Nom du fichier en entrée.
 * @param {String} [result.data] Résultat brut de la lecture du fichier
 * si aucune feature n'est trouvé.
 * @param {Object} [result.carte] Carte au format JSON (si le fichier donnéeen entrée est une carte).
 * @param {HTMLFormElement} form Formulaire de l'ajout de fichier.
 */
function processFile(result, form) {
  let dialog = importLocalAction.getDialog();
  let dataStatus = dialog.selectElement('[data-status]')
  let input = form.querySelector('input');
  const name = result.name;
  if (result.features) {
    // let layer = new VectorLayer({
    let layer = new VectorStyle({
      type: 'Vector',
      title: name,
      source: new VectorSource()
    });
    carte.addLayer(layer);

    // Ajout des features à la couche
    layer.getSource().addFeatures(result.features);
    addMessage(input, `Le fichier ${name} a été ajouté à vos couches.`, { error: false })

    dataStatus.dataset.status = 'success'
  } else {
    dataStatus.dataset.status = 'error'
    addMessage(input, `Le fichier ${name} n'a pas pu être correctement importé.`, { error: true })
  }
}

const importLocalAction = new Action({
  title: 'Importer une donnée locale',
  icon: 'ri-file-upload-line',
  onOpen: onOpen,
  content: content,
})

export default importLocalAction;