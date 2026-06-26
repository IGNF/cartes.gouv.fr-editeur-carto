import Action from '../Action.js';
import { carte } from '../../story.js';
import content from './editLayerInfo.html?raw';
import { addMessage, removeMessage } from '../../utils/message.js';
import Alert from '../../control/Alert/Alert.js';
import VectorStyle from 'mcutils/layer/VectorStyle.js';

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialogue utilisé par l'action.
 */
let dialog;

/**
 * @type {Object} Options de configuration de la couche
 */
let options;

/**
 * @type {import("ol/layer/Layer.js").default} Couche à modifier
 */
let layer;

/**
 * Fonction à l'ouverture du dialogue.
 * Initialise les différents inputs.
 * 
 * @param {import("ol/events/Event.js").default} e Événement générique openlayer
 */
function onOpen (e) {
  dialog = e.target;
  const inputs = getInstances(dialog.getDialogContent());

  options = this?.action?.options;
  layer = this?.action?.layer;

  /** @type {HTMLFormElement} */
  const form = dialog.querySelector("form");
  form.addEventListener("submit", (e) => saveInfo(e))

  inputs.title.value = getTitle(options, layer);
  inputs.description.value = getDescription(options, layer);
  inputs.attributions.value = getAttributions(layer);
  inputs.thumbnail.value = getThumbnail(options, layer);

  // Écouteurs d'événements
  inputs.title.addEventListener("change", (e) => {
    if (e.target.value === "") {
      addMessage(e.target, 'Le nom de la couche est obligatoire.', { type: 'error' });
      return;
    } else {
      removeMessage(e.target)
    }
  })

  inputs.thumbnail.addEventListener("change", (e) => {
    if (e.target.value && !e.target.value.startsWith("https://")) {
      addMessage(e.target, 'Le li en doit être un lien https.', { type: 'error' });
      return;
    } else {
      removeMessage(e.target)
    }
  })

  // TODO : désactiver champs saisie avec message d'info différent
  // dans le cas où la couche est importée avec ses copyrights
  // (OSM, cartalogue etc.)
}

/**
 * Fonction utilitaire retournant le titre de la couche
 * 
 * @param {Object} config Configuration de l'objet dans le gestionnaire de couche
 * @param {import("ol/layer/Layer.js").default} layer Couche à modifier
 * @returns {String} Titre de la couche
 */
function getTitle(config, layer) {
  return config?.title ?? layer.get("title") ?? "";
}

/**
 * Fonction utilitaire retournant la description de la couche
 * 
 * @param {Object} config Configuration de l'objet dans le gestionnaire de couche
 * @param {import("ol/layer/Layer.js").default} layer Couche à modifier
 * @returns {String} Description de la couche
 */
function getDescription(config, layer) {
  return config?.description ?? layer.get("description") ?? "";
}

/**
 * Fonction utilitaire retournant les crédits (copyright) de la couche
 * 
 * @param {import("ol/layer/Layer.js").default} layer Couche à modifier
 * @returns {String} Crédits / copyrights de la couche
 */
function getAttributions(layer) {
  const sourceAttribution = layer.getSource()?.getAttributions();
  const attribution = typeof sourceAttribution === "function" ? sourceAttribution() : sourceAttribution;
  return attribution ?? layer.get("copyright") ?? "";
}

/**
 * Fonction utilitaire retournant le logo (url ou fichier) de la couche
 * 
 * @param {Object} config Configuration de l'objet dans le gestionnaire de couche
 * @param {import("ol/layer/Layer.js").default} layer Couche à modifier
 * @returns {String} Logo de la couche
 */
function getThumbnail(config, layer) {
  /** @type {String} */
  let thumbnail = config?.thumbnail ?? layer.get("thumbnail") ?? layer.get("logo") ?? "";
  if (thumbnail && !thumbnail.startsWith("https://")) {
    thumbnail = "";
  }
  return thumbnail
}

/**
 * Fonction utilitaire permettant de récupérer les inputs.
 * Ceux-ci sont rajoutés à l'objet en fonction de l'attribut "data-field".
 * @param {import('../../control/Dialog/AbstractDialog.js').default} dialog Dialogue utilisé par l'action.
 */
function getInstances(dialog) {
  return {
    /** @type {HTMLInputElement} */ title: dialog.querySelector("[data-field=title]"),
    /** @type {HTMLFieldSetElement} */ description: dialog.querySelector("[data-field=description]"),
    /** @type {HTMLInputElement} */ attributions: dialog.querySelector("[data-field=attributions]"),
    /** @type {HTMLInputElement} */ thumbnail: dialog.querySelector("[data-field=thumbnail]"),
  };
}

/**
 * Fonction récupérant les inputs en erreur.
 * 
 * @param {import('../../control/Dialog/AbstractDialog.js').default} dialog Dialogue utilisé par l'action
 * @returns {NodeList} Liste des inputs
 */
function getErrorInputs(dialog) {
  return dialog.querySelectorAll(".fr-input-group--error > .fr-input");
}

/**
 * Fonction permettant de sauvegarder les informations dans la couche
 * @param {SubmitEvent} e
 */
function saveInfo(e) {
  e.preventDefault();
  
  // Récupère les inputs
  const inputs = getInstances(dialog.getDialogContent());

  // Valeurs correspondantes
  const title = inputs.title.value;
  const description = inputs.description.value;
  const attributions = inputs.attributions.value;
  let thumbnail = inputs.thumbnail.value;

  // Pour vérifier les erreurs
  let error = false;
  let focusElement = null;
  const errors = getErrorInputs(dialog);

  if (errors.length) {
    error = true;
    focusElement = errors.item(0)
  }

  if (error) {
    // Il y'a une erreur : on bouge le focus et on empêche l'enregistrement
    focusElement?.focus();
    return false;
  } else {
    // Pas d'erreur, on enregistre
    // Titre et description
    layer.set("title", title);
    layer.set("description", description);
    
    // Crédits / copyright : on modifie la source
    layer.getSource()?.setAttributions(attributions);
    layer.set("copyright", attributions);
    
    // Logo : passe par switcher.addLayer pour le modifier
    const image = options.div.querySelector(".GPtitleImage");
    layer.set("thumbnail", thumbnail);
    layer.set("logo", thumbnail);

    if (thumbnail) {
      // Modifie la source et enlève l'image par défaut
      image.src = thumbnail;
      image.classList.remove("GPtitleDefaultImage");
    } else if (layer instanceof VectorStyle) {
      // Mets l'image de dessin par défaut
      thumbnail = "personal-drawing"
      image.src = thumbnail;
    } else {
      image.removeAttribute("src");
      image.classList.add("GPtitleDefaultImage");
      // Image par défaut
    }
    
    // Modifie les options de configuration du layerswitcher
    options.title = title;
    options.description = description;
    options.thumbnail = thumbnail;

    // Ferme le dialogue
    dialog.close();
  }
}

const editLayerInfoAction = new Action({
  id: 'edit-layer-info',
  title: 'Informations de la couche',
  content: content,
  buttons: [
    {
      label: "Valider",
      kind: 0,
      "type": "submit",
      "form": "edit-layer-info-form",
    },
    {
      label: "Annuler",
      kind: 1,
      close: true
    }
  ],
  onOpen: onOpen
});

export default editLayerInfoAction;