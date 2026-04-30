
import carte from '../../carte.js';
import modal from '../../dialogs/modal.js';
import charte from '../../charte/charte.js';
import Charte from '../../charte/objects/Charte.js';
import Button from 'ol-ext/control/Button.js';
import Bar from 'ol-ext/control/Bar.js';
import Toggle from 'ol-ext/control/Toggle.js';

import Action from '../../actions/Action.js'

import './step-bar.scss'

let onToggleMode = function () {
  let toggle = this;
  const currentMode = charte.getMode();
  const action = this.button_.getAttribute('data-action');
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
  onToggle: onToggleMode,
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
  onToggle: onToggleMode,
});

let save = new Button({
  className: 'save-button',
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-save-line',
  attributes: {
    type: 'button',
    title: "Enregistrer",
    'aria-label': "Enregistrer",
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
    title: "Partager",
    'aria-label': "Partager",
    'data-action': 'share-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false',
  },
  handleClick: Action.open
});

carte.on("read", () => {
  if (!carte.get("id")) {
    share.setDisable(true);
    share.button_.setAttribute("title", "Enregistrez avant de partager");
    share.button_.setAttribute("aria-label", "Enregistrez avant de partager");
  } else {
    share.setDisable(false);
    share.button_.setAttribute("title", "Partager");
    share.button_.setAttribute("aria-label", "Partager");
  }
})

carte.on("save", () => {
  share.setDisable(false);
  share.button_.setAttribute("title", "Partager");
  share.button_.setAttribute("aria-label", "Partager");
})

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--fixed ol-bar--separator ol-bar--row step-bar',
  controls: [createmap, storymap, save, share]
})

carte.addControl('stepBar', mainbar);
mainbar.setPosition('top-right');
