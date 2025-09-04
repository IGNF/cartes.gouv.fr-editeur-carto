import carte from '../../carte.js';

import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';

import Action from '../../actions/Action.js';

import './edit-bar.scss';
import rightPanel from '../../dialogs/rightPanel.js';

// TODO : mieux gérer les toggle d'édition / mesure
// et leur lien avec l'interaction de sélection

/**
 * @type {Toggle}
 */
let activeToggle;

/**
 * @type {Toggle}
 */
let toggle;
// Fonction temporaire pour les toggle
// (les toggle n'envoient pas d'événement au click)
function onToggleAction() {
  // Désactive le toggle précédent
  if (toggle && toggle !== this) {
    toggle.setActive(false);
  }
  toggle = this;
  let e = new CustomEvent('click', {
    detail: {
      'target': toggle.button_,
    }
  });
  Action.open(e);
}

rightPanel.onClose(() => {
  closeToggle(toggle)
}, false)

/**
 * Ferme le toggle à la fermeture du dialog
 * @param {Event} e 
 * @param {Toggle} toggle 
 */
function closeToggle(toggle) {
  if (toggle.getActive()) {
    toggle.setActive(false)
  }
}

// Interaction de select
let selectToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-cursor-line',
  attributes: {
    title: "Sélecteur",
    'aria-label': "Sélecteur",
  },
  interaction: carte.getSelect(),
  active: true,
  onToggle: function (e) {
    if (e) {
      carte.getSelect().getFeatures().clear();
      if (activeToggle && activeToggle.getActive()) {
        // Simule un click sur le toggle
        activeToggle.button_.click()
      }
    }
  }
});

// Barre ajout de donnée
let catalogue = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-map-2-line',
  attributes: {
    'data-action': 'import-catalog',
    'aria-controls': rightPanel.getId(),
    title: "Importer une donnée depuis cartes.gouv",
    'aria-label': "Importer une donnée depuis cartes.gouv",
  },
  onToggle: onToggleAction
});

let file = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-file-upload-line',
  attributes: {
    'data-action': 'import-local',
    'aria-controls': rightPanel.getId(),
    title: "Importer une donnée locale",
    'aria-label': "Importer une donnée locale",
  },
  onToggle: onToggleAction
});

let addDataBar = new Bar({
  toggleOne: true,
  controls: [
    catalogue,
    file,
  ]
});

let drawToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-pen-nib-line',
  attributes: {
    'data-action': 'create-object',
    'aria-controls': rightPanel.getId(),
    title: "Annoter la carte",
    'aria-label': "Annoter la carte",
  },
  onToggle: onToggleAction
});

let measureToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-ruler-line ',
  attributes: {
    'data-action': 'measure',
    'aria-controls': rightPanel.getId(),
    title: "Mesurer",
    'aria-label': "Mesurer",
  },
  onToggle: onToggleAction
});

// Gère l'activation du toggle de sélection
const interactionToggles = [drawToggle, measureToggle]
interactionToggles.forEach((toggle) => {
  toggle.on('change:active', (e) => {
    if (e.active) {
      activeToggle = e.target;
      selectToggle.setActive(false)
    } else if (!(drawToggle.getActive() || measureToggle.getActive())) {
      // Les deux sont désactivés, on réactive
      selectToggle.setActive(true);
      activeToggle = null;
    }
  })
})

// Barre d'interaction
let interactionBar = new Bar({
  toggleOne: true,
  controls: [
    drawToggle,
    measureToggle,
  ]
})

// Barre d'édition
let editDataBar = new Bar({
  controls: [
    interactionBar,
  ]
})

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--separator edit-bar',
  toggleOne: true,
  controls: [selectToggle, addDataBar, editDataBar]
})

carte.addControl('mainBar', mainbar)

mainbar.setPosition('right')