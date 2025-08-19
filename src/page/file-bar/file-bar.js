import carte from '../../carte.js'

import modal from '../../modal.js';


import './file-bar.scss'
// Download
import FileSaver from 'file-saver'

import CustomButton from '../../control/CustomButton/CustomButton.js'
import CustomBar from '../../control/CustomBar/CustomBar.js'
import CustomToggle from '../../control/CustomToggle/CustomToggle.js'
import CustomTextButton from '../../control/CustomTextButton/CustomTextButton.js';
import openAction from '../../actions/actions.js';

// Variables utiles
let title = carte.get('title');

// Actions
let createNewMap = function (e) {
  window.open(import.meta.env.BASE_URL, '_blank').focus();
}

let previewMap = function (e) {
  console.log("ouvre la visualisation")
}

let exportMap = function (e) {
  const data = carte.write(e.shiftKey);

  const blob = new Blob([JSON.stringify(data, null, e.ctrlKey ? undefined : ' ')], { type: "text/plain;charset=utf-8" });
  FileSaver.saveAs(blob, "carte.carte");
}

let printMap = function (e) {
  // Add ScaleLine on canvas
  carte.getControl('scaleLine').element.style.visibility = 'hidden'
  // Print
  carte.getControl('printDlg').print();
}

carte.getControl('printDlg')._printDialog.on('hide', () => {
  // Remove ScaleLine from canvas
  carte.getControl('scaleLine').element.style.visibility = '';
  carte.getMap().render()
})

// Nom du fichier

let fileName = new CustomTextButton({
  html: 'Nom du fichier',
  className: 'ol-custom-text-button file-name fr-px-2w fr-py-1w fr-text--sm file-name fr-m-0'
})

// --- First bar (Ouvrir / Créer) ---
let openMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-dashboard-3-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'open-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Ouvrir une carte',
  handleClick: openAction
});



let createMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-external-link-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'create-map',
    type: 'button'
  },
  html: 'Créer une nouvelle carte',
  handleClick: createNewMap,
});

let bar1 = new CustomBar({
  className: 'ol-bar ol-bar--column',
  controls: [openMapBtn, createMapBtn]
});

// --- Second bar (Enregistrer / Renommer) ---
let saveMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-save-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'save-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Enregistrer',
  handleClick: openAction,
});

let renameMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-edit-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'rename-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Renommer',
  handleClick: openAction,
});

let bar2 = new CustomBar({
  className: 'ol-bar ol-bar--column',
  controls: [saveMapBtn, renameMapBtn]
});

// --- Third bar (Prévisualiser / Partager / Exporter / Imprimer) ---
let previewMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-play-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'preview-map',
    type: 'button'
  },
  html: 'Prévisualiser',
  handleClick: previewMap,
});

let shareMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-send-plane-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'share-map',
    type: 'button',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  html: 'Partager',
  handleClick: openAction,
});

let exportMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-download-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'export-map',
    type: 'button'
  },
  html: 'Exporter',
  handleClick: exportMap,
});

let printMapBtn = new CustomButton({
  className: 'ol-custom-button',
  buttonClasses: ['map-item', 'fr-icon-printer-line', 'fr-link--icon-left'],
  buttonAttributes: {
    'data-action': 'print-map',
    type: 'button'
  },
  html: 'Imprimer',
  handleClick: printMap,
});

let bar3 = new CustomBar({
  className: 'ol-bar ol-bar--column',
  controls: [previewMapBtn, shareMapBtn, exportMapBtn, printMapBtn]
});

// --- Main bar that groups everything ---
let btnBar = new CustomBar({
  className: 'ol-bar--separator ol-bar--column fr-p-2w map-file-actions',
  controls: [fileName, bar1, bar2, bar3]
});

let fileToggle = new CustomToggle({
  className: 'button-hint ol-custom-button',
  buttonClasses: ['fr-btn', 'fr-btn--tertiary-no-outline', 'fr-icon-ign-add-data'],
  buttonAttributes: {
    title: "Gestion ma carte",
    'aria-label': "Gestion ma carte",
  },
  bar: btnBar
});

// Map title
let mapTitle = new CustomTextButton({
  html: title || 'Carte sans titre',
  textAttributes: {
    title: title || 'Carte sans titre',
  },
  className: 'ol-custom-text-button fr-px-2w fr-py-1w fr-text map-title'
})

// Mise à jour du titre
carte.on('change:title', (e) => {
  mapTitle.setHtml(e.target.get(e.key))
  mapTitle.setTitle(e.target.get(e.key))
})

carte.on('read', (e) => {
  let title;
  if (Object.keys(e.target.get('atlas')).length === 0) {
    title = e.target.get('title') || 'Carte sans titre';
  } else {
    title = e.target.getTitle();
  }
  carte.set('title', title)
  mapTitle.setHtml(title)
  mapTitle.setTitle(title)
})

let filebar = new CustomBar({
  className: 'ol-bar--separator ol-bar--row map-handle',
  controls: [fileToggle, mapTitle]
});

carte.addControl('filebar', filebar)

filebar.setPosition('top-left')