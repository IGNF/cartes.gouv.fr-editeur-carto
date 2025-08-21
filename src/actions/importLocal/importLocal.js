import Action from '../Action.js';
import content from './importLocal.html?raw';
import './importLocal.scss';
import { getUid } from '../../charte/utils.js';
import carte from '../../carte.js';
import { getValidFeatures, loadFile } from 'mcutils/dialog/dialogImportFile'
import { info, init, toGeoJSON } from 'geoimport';
import workerUrl from 'geoimport/dist/static/gdal3.js?url';
import dataUrl from 'geoimport/dist/static/gdal3WebAssembly.data?url';
import wasmUrl from 'geoimport/dist/static/gdal3WebAssembly.wasm?url';

import VectorSource from 'ol/source/Vector';
import VectorStyle from 'mcutils/layer/VectorStyle';
import VectorLayer from 'ol/layer/Vector';

// https://www.iana.org/assignments/media-types/media-types.xhtml

const accepted = [
  'application/geo+json',
  'application/json',
  'application/vnd.google-earth.kml+xml',
  'application/geopackage+sqlite3',
  'application/gpx+xml',
  'application/zip',
  'text/csv',
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // 'application/vnd.oasis.opendocument.spreadsheet',
  '.gpx',
]

// Initialise geoimport
init({
  paths: {
    wasm: wasmUrl,
    data: dataUrl,
    js: workerUrl,
  },
  useWorker: false,
});

function onOpen(e) {
  let dialog = importLocalAction.getDialog();

  let form = dialog.selectElement('form');
  form.addEventListener('submit', importFile);

  let input = dialog.selectElement('input[type="file"]');
  input.accept = accepted.join(',');
  input.addEventListener('change', (e) => removeMessage(e.target))
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
  let form = e.target;

  if (validateForm(form)) {
    const formData = new FormData(form);
    let file = formData.get('file');

    // TODO : Gérer l'import des fichiers de cette manière là pour les autres
    // type de fichier aussi ?
    // GPX : à traiter comme actuellement ou via geoimport ?
    if (file.type === "application/zip" || file.type === "application/geopackage+sqlite3") {
      // Gère les fichiers zip / shp autrement
      info(file).then(r => {
        let layers = r.layers;
        layers.forEach(layer => {
          toGeoJSON(file, { layerName: layer.name, writeBbox: true })
            .then(json => {
              // Créé un nouveau fichier pour envoyer à l'application
              let geojson = new File([JSON.stringify(json)], `${json.name}.geojson`, {
                type: 'application/geo+json',
              });
              loadFile(geojson, (e) => processFile(e, form), { silent: true });
            })
            .catch(r => {
              processFile({ name: layer.name }, form)
            });
        });
      });
    } else {
      loadFile(file, (e) => processFile(e, form), { silent: true });
    }
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
  let input = form.querySelector('input');
  const name = result.name;
  if (result.features) {
    // let layer = new VectorLayer({
    let layer = new VectorStyle({
      type: 'Vector',
      title: name,
      source: new VectorSource()
    });
    // Ajout des features à la couche
    layer.getSource().addFeatures(result.features);

    // Ajout du layer à la carte
    carte.addLayer(layer);
    addMessage(input, `Le fichier ${name} a été ajouté à vos couches.`, { error: false })
  } else {
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