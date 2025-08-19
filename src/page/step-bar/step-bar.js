
import carte from '../../carte.js'
import modal from '../../modal.js';

import CustomButton from '../../control/CustomButton/CustomButton.js'
import CustomBar from '../../control/CustomBar/CustomBar.js'
import CustomToggle from '../../control/CustomToggle/CustomToggle.js'

import './step-bar.scss'
import openAction from '../../actions/actions.js'

// Barre ajout de donnée
let createmap = new CustomToggle({
  // html: '<i class="fr-mr-1w ri-1x ri-map-pin-line"></i>Création',
  html: '<i class="ri-pencil-line"></i><span>Création</span>',
  autoActivate:true,
  className: 'action-button ol-custom-button',
  buttonClasses: ['fr-btn', 'fr-btn--tertiary-no-outline'],
  buttonAttributes: {
    title: "Gérer le contenu de la carte",
    'aria-label': "Gérer le contenu de la carte",
  },
  onToggle: function () {
    if (createmap.getActive()) {
      storymap.set('autoActivate', false);
      createmap.set('autoActivate', true);
    }
    info("Création de la map");
  }
});

let storymap = new CustomToggle({
  // html: '<i class="fr-mr-1w ri-1x ri-map-pin-line"></i>Mise en page',
  html: '<i class="ri-collage-line"></i><span>Mise en page</span>',
  className: 'action-button ol-custom-button',
  autoActivate:true,
  buttonClasses: ['fr-btn', 'fr-btn--tertiary-no-outline'],
  buttonAttributes: {
    title: "Gérer la mise en page de la carte",
    'aria-label': "Gérer la mise en page de la carte",
  },
  onToggle: function () {
    if (storymap.getActive()) {
      storymap.set('autoActivate', true);
      createmap.set('autoActivate', false);
    }
    info("Storymap");
  }
});

let save = new CustomButton({
  className: 'save-button',
  buttonClasses: ['fr-btn', 'fr-btn--tertiary-no-outline', 'ri-save-line'],
  buttonAttributes: {
    type: 'button',
    title: "Enregistrer la carte",
    'aria-label': "Enregistrer la carte",
    'data-action': 'save-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  handleClick: openAction
});

let share = new CustomButton({
  className: 'share-button',
  buttonClasses: ['fr-btn', 'fr-btn--tertiary-no-outline', 'ri-send-plane-line'],
  buttonAttributes: {
    type: 'button',
    title: "Partager la carte",
    'aria-label': "Partager la carte",
    'data-action': 'share-map',
    'aria-controls': modal.getId(),
    'data-fr-opened': 'false'
  },
  handleClick: openAction
});

let modeBar = new CustomBar({
  className: '',
  toggleOne: true,
  autoActivate: true,
  controls: [createmap, storymap]
})

// Barre principale
let mainbar = new CustomBar({
  className: 'ol-bar--separator ol-bar--row',
  controls: [modeBar, save, share]
})


// Show info
function info(i) {
  console.log(i || "");
}

carte.addControl('stepBar', mainbar)

mainbar.setPosition('top-right')