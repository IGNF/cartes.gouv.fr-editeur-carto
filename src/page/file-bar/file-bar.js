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

// Actions
let createNewMap = function () {
  window.open(import.meta.env.BASE_URL, '_blank').focus();
}

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
  className: 'ol-bar--separator ol-bar--column fr-px-2w fr-pb-2w map-file-actions',
  controls: [fileName, actionBar]
});

// Toggle permettant d'ouvrir / fermer le menu
let fileToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-icon-ign-add-data',
  attributes: {
    title: "Gestion ma carte",
    'aria-label': "Gestion ma carte",
  },
  bar: btnBar
});

// Titre de la carte (affiché en permanence sur la carte)
let mapTitle = new TextButton({
  html: title || 'Carte sans titre',
  attributes: {
    title: title || 'Carte sans titre',
  },
  className: 'fr-px-2w fr-py-1w fr-text map-title'
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
  className: 'ol-bar--separator ol-bar--row map-handle',
  controls: [fileToggle, mapTitle]
});

carte.addControl('filebar', filebar);
filebar.setPosition('top-left');
