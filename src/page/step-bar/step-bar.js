
import carte from '../../carte.js'
import modal from '../../modal.js';
import charte from '../../charte/charte.js';
import Charte from '../../charte/objects/Charte.js';
// import Button from 'ol-ext/control/Button';
// import Bar from 'ol-ext/control/Bar';
// import Toggle from 'ol-ext/control/Toggle';

import Button from '../../control/CustomButton/CustomButton.js'
import Bar from '../../control/CustomBar/CustomBar.js'
import Toggle from '../../control/CustomToggle/CustomToggle.js'

import './step-bar.scss'
import openAction from '../../actions/actions.js'
import duplicate from '../mobile-bar/mobile-bar.js';


let onToggleMode = function () {
  let toggle = this;
  const action = this.button_.getAttribute('data-action');
  charte.setMode(action);
  let mode = charte.getMode();
  // Active ou non le toggle en fonction du mode
  if (mode === action) {
    toggle.setActive(true);
    toggle.set('autoActivate', true);
  } else {
    toggle.setActive(false);
    toggle.set('autoActivate', false);
  }
}

// Barre ajout de donnée
let createmap = new Toggle({
  html: '<i class="ri-pencil-line"></i><span>Création</span>',
  autoActivate: true,
  className: 'action-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline',
  attributes: {
    title: "Gérer le contenu de la carte",
    'aria-label': "Gérer le contenu de la carte",
    'data-action': Charte.modes.EDITOR,
  },
  onToggle: onToggleMode
});

let storymap = new Toggle({
  html: '<i class="ri-collage-line"></i><span>Mise en page</span>',
  className: 'action-button',
  autoActivate: true,
  classButton: 'fr-btn fr-btn--tertiary-no-outline',
  attributes: {
    title: "Gérer la mise en page de la carte",
    'aria-label': "Gérer la mise en page de la carte",
    'data-action': Charte.modes.STORYMAP,
  },
  onToggle: onToggleMode
});

let save = new Button({
  className: 'save-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-save-line',
  attributes: {
    type: 'button',
    title: "Enregistrer la carte",
    'aria-label': "Enregistrer la carte",
    'data-action': 'save-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  handleClick: openAction
});

let share = new Button({
  className: 'share-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-send-plane-line',
  attributes: {
    type: 'button',
    title: "Partager la carte",
    'aria-label': "Partager la carte",
    'data-action': 'share-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  handleClick: openAction
});

let modeBar = new Bar({
  toggleOne: true,
  autoActivate: true,
  controls: [createmap, storymap]
})

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--separator ol-bar--row step-bar',
  controls: [modeBar, save, share]
})

// Ajout à la barre mobile
duplicate(mainbar);

carte.addControl('stepBar', mainbar);
mainbar.setPosition('top-right');

// Lien avec la barre mobile
const toggleModes = {};
toggleModes[Charte.modes.EDITOR] = createmap;
toggleModes[Charte.modes.STORYMAP] = storymap;

charte.on('change:mode', (e) => {
  let mode = e.target.getMode();
  let previousMode = e.oldValue;
  const toggle = toggleModes[mode];
  const oldToggle = toggleModes[previousMode];
  toggle.setActive(true);
  toggle.set('autoActivate', true);
  oldToggle.set('autoActivate', false);
});