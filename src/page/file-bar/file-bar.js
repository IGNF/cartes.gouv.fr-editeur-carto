import carte from '../../carte.js';
import modal from '../../dialogs/modal.js';

import './file-bar.scss';

// Download
import FileSaver from 'file-saver';

import Button from 'ol-ext/control/Button.js';
import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';
import TextButton from 'ol-ext/control/TextButton.js';

import Action from '../../actions/Action.js';

// Variables utiles
let title = carte.get('title');

let exportMap = function (e) {
  const data = carte.write(e.shiftKey);
  data.param.titre = data.param.titre || carte.getTitle();

  const blob = new Blob([JSON.stringify(data, null, e.ctrlKey ? undefined : ' ')], { type: "text/plain;charset=utf-8" });
  FileSaver.saveAs(blob, "carte.carte");
}

let printMap = function () {
  // Add ScaleLine on canvas
  carte.getControl('scaleLine').element.style.visibility = 'hidden';
  // Print
  carte.getControl('printDlg').print();
}

carte.getControl('printDlg')._printDialog.on('hide', () => {
  // Remove ScaleLine from canvas
  carte.getControl('scaleLine').element.style.visibility = '';
  carte.getMap().render();
})

// Nom du fichier (dans le menu ouvert)
let fileName = new TextButton({
  className: 'file-name fr-p-2w fr-text--sm fr-m-0',
  html: 'Nom du fichier',
});

// Ouvrir une carte existante
let openMapBtn = new Button({
  classButton: 'map-item fr-icon-upload-line fr-link--icon-left',
  attributes: {
    'data-action': 'open-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Ouvrir une carte',
  handleClick: Action.open
});

// Enregistrer une carte
let saveMapBtn = new Button({
  classButton: 'map-item fr-icon-save-line fr-link--icon-left',
  attributes: {
    'data-action': 'save-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Enregistrer',
  handleClick: Action.open,
});

// Renommer la carte
let renameMapBtn = new Button({
  classButton: 'map-item fr-icon-edit-line fr-link--icon-left',
  attributes: {
    'data-action': 'rename-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Renommer',
  handleClick: Action.open,
});

// Partager la carte
let shareMapBtn = new Button({
  classButton: 'map-item fr-icon-share-2-line fr-link--icon-left',
  attributes: {
    'data-action': 'share-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Partager',
  handleClick: Action.open,
});

// Exporter la carte en fichier .carte
let exportMapBtn = new Button({
  classButton: 'map-item fr-icon-download-line fr-link--icon-left',
  attributes: {
    'data-action': 'export-map',
    type: 'button'
  },
  html: 'Exporter',
  handleClick: exportMap,
});

// Imprimer la carte
let printMapBtn = new Button({
  classButton: 'map-item fr-icon-printer-line fr-link--icon-left',
  attributes: {
    'data-action': 'print-map',
    type: 'button'
  },
  html: 'Imprimer',
  handleClick: printMap,
});

// Barre regroupant les actions (boutons)
let actionBar = new Bar({
  className: 'ol-bar--column action-bar',
  controls: [openMapBtn, saveMapBtn, renameMapBtn, shareMapBtn, exportMapBtn, printMapBtn]
});

// Barre correspondant au menu ouvert (nom fichier + boutons d'actions)
let btnBar = new Bar({
  className: 'ol-bar--separator ol-bar--column map-file-actions',
  controls: [fileName, actionBar]
});

// Toggle permettant d'ouvrir / fermer le menu
let fileToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-icon-ign-add-data',
  attributes: {
    'aria-label': "Gérer ma carte",
  },
  bar: btnBar
});

// Titre de la carte (affiché en permanence sur la carte)
let mapTitle = new TextButton({
  html: title || 'Carte sans titre',
  attributes: {
    title: title || 'Carte sans titre',
  },
  className: 'fr-text map-title'
});

// Fonction pour mettrre à jour le titre
function setTitle(e) {
  let title = carte.getTitle();
  if (e.key === "title") {
    title = carte.get("title");
  }
  mapTitle.setHtml(title)
  mapTitle.setTitle(title)
  fileName.setHtml(title)
  fileName.setTitle(title)
}
carte.on('change:title', setTitle)
carte.on('read', setTitle);
carte.on('save', setTitle);

// Barre principale (menu permanent + menu ouvert)
let filebar = new Bar({
  className: 'ol-bar--fixed ol-bar--separator ol-bar--row map-handle',
  controls: [fileToggle, mapTitle],
});

/**
 * Ferme le menu si le focus quitte la barre (navigation clavier)
 */
const handleFocusOut = () => {
  // setTimeout 0 pour laisser le navigateur mettre à jour document.activeElement
  setTimeout(() => {
    const focused = document.activeElement;
    if (!btnBar.element.contains(focused) && !fileToggle.element.contains(focused)) {
      fileToggle.setActive(false);
      btnBar.element.removeEventListener("focusout", handleFocusOut);
    }
  }, 0);
};

/**
 * Ferme le menu si on clique en dehors (souris)
 * @param {MouseEvent} e Événement mouseDown
 */
const closeOnOutsideClick = (e) => {
  if (!btnBar.element.contains(e.target) && !fileToggle.element.contains(e.target)) {
    fileToggle.setActive(false);
    document.removeEventListener("mousedown", closeOnOutsideClick);
  }
};

// Ajoute un écouteur d'événement pour fermer la barre automatiquement si on clique ailleurs
fileToggle.on("change:active", (e) => {
  if (e.target.getActive()) {
    // Met le focus sur le premier élément
    openMapBtn.button_.focus();
    // Clavier : focusout sur la barre
    btnBar.element.addEventListener("focusout", handleFocusOut);
    // Souris : mousedown sur le document
    document.addEventListener("mousedown", closeOnOutsideClick);
  } else {
    btnBar.element.removeEventListener("focusout", handleFocusOut);
    document.removeEventListener("mousedown", closeOnOutsideClick);
  }
})

carte.addControl('filebar', filebar);
filebar.setPosition('top-left');

export { shareMapBtn };