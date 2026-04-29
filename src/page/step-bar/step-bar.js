
import carte from '../../carte.js';
import modal from '../../dialogs/modal.js';
import charte from '../../charte/charte.js';
import Charte from '../../charte/objects/Charte.js';
import Button from 'ol-ext/control/Button.js';
import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';

import Action from '../../actions/Action.js'

import './step-bar.scss'

let onToggleMode = function (e) {
  console.log(e)
  let toggle = this;
  console.log(toggle);
  const currentMode = charte.getMode();
  const action = this.button_.getAttribute('data-action');
  console.log(currentMode, action, currentToggle);
  if (currentMode === action) {
    // On a appuyé sur le même bouton : on laisse le toggle actif
    toggle.setActive(true);
  } else {
    // Désactive l'autre toggle (le mode change)
    currentToggle?.setActive(false);
    // Change le mode de l'appli
    charte.setMode(action);
    toggle.setActive(true)
  }
  currentToggle = toggle;
  // Active ou non le toggle en fonction du mode
  // if (mode === action) {
  //   toggle.setActive(true);
  //   toggle.set('autoActivate', true);
  // } else {
  //   toggle.setActive(false);
  //   toggle.set('autoActivate', false);
  // }
}

// Barre ajout de donnée
let createmap = new Toggle({
  html: '<i class="ri-pencil-line"></i><span>Création</span>',
  active: true,
  className: 'action-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline',
  attributes: {
    title: "Gérer le contenu de la carte",
    'aria-label': "Gérer le contenu de la carte",
    'data-action': Charte.modes.EDITOR,
  },
  onToggle : onToggleMode,
  // toggleFn: function(e) {
    // onToggleMode.call(this, e);
    // story.showTitle(false);
  // },
});

/**
 * @type {import("ol-ext/control/Toggle.js").default} Toggle actif
 */
let currentToggle = createmap;

let storymap = new Toggle({
  html: '<i class="ri-collage-line"></i><span>Mise en page</span>',
  className: 'action-button',
  // autoActivate: true,
  classButton: 'fr-btn fr-btn--tertiary-no-outline',
  attributes: {
    title: "Gérer la mise en page de la carte",
    'aria-label': "Gérer la mise en page de la carte",
    'data-action': Charte.modes.STORYMAP,
  },
  onToggle : onToggleMode,
  // toggleFn: function(e) {
  //   onToggleMode.call(this, e);
    // update title of the storymap with the carte title
    // story.setTitle({ title: carte.getTitle(true) });
    // story.showTitle(true);
  // },
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
  handleClick: Action.open
});

let share = new Button({
  className: 'share-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-icon-share-2-line',
  attributes: {
    type: 'button',
    title: "Partager la carte",
    'aria-label': "Partager la carte",
    'data-action': 'share-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  handleClick: Action.open
});

// let modeBar = new Bar({
//   className: 'ol-bar--separator ol-bar--row',
//   toggleOne: true,
//   autoActivate: true,
//   controls: [createmap, storymap]
// })

// modeBar.setPosition('top-right')

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--fixed ol-bar--separator ol-bar--row step-bar',
  controls: [createmap, storymap, save, share]
})

carte.addControl('stepBar', mainbar);
mainbar.setPosition('top-right');
