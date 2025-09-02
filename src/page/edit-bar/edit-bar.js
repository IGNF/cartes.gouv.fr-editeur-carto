
import carte from '../../carte.js'

// import Bar from 'ol-ext/control/Bar'
// import Toggle from 'ol-ext/control/Toggle'
import Bar from '../../control/CustomBar/CustomBar.js'
import Toggle from '../../control/CustomToggle/CustomToggle.js'

import Draw from 'ol/interaction/Draw.js';
import VectorSource from 'ol/source/Vector.js';

import Action from '../../actions/Action.js'

import './edit-bar.scss'
import rightPanel from '../../rightPanel.js';

/**
 * @type {Toggle}
 */
let toggle;
// Fonction temporaire pour les toggle
// (n'envoient pas d'événement au click)
function onToggleAction() {
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

// Barre ajout de donnée
let catalogue = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-book-open-line ',
  attributes: {
    'data-action': 'import-catalog',
    'aria-controls': rightPanel.getId(),
    title: "Importer une donnée de cartes.gouv",
    'aria-label': "Importer une donnée de cartes.gouv",
  },
  onToggle: onToggleAction
});

let flux = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-global-line ',
  attributes: {
    'data-action': 'import-flow',
    'aria-controls': rightPanel.getId(),
    title: "Importer un flux",
    'aria-label': "Importer un flux",
  },
  onToggle: onToggleAction
});

let file = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-file-upload-line ',
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
    flux,
    file,
  ]
});

// Interaction de select
let selectToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-cursor-line ',
  attributes: {
    title: "Activer la sélection sur la carte",
    'aria-label': "Activer la sélection sur la carte",
  },
  interaction: carte.getSelect(),
  active: true,
  onToggle: function () {
    carte.getSelect().getFeatures().clear();
  }
});


// Interactions de dessins
let getDraw = function (type) {
  let draw = new Draw({
    source: new VectorSource(),
    type: type,
  })
  return draw
}

let drawPointInteraction = getDraw('Point');
let drawLineStringInteraction = getDraw('LineString');
let drawPolygonInteraction = getDraw('Polygon');
let draws = [drawPointInteraction, drawLineStringInteraction, drawPolygonInteraction]

draws.forEach(draw => {
  draw.on('drawend', () => {
    // Code à modifier lorsqu'il y'aura une sélection des couches
    // vector.getSource().addFeature(e.feature);
  })
})

let point = new Toggle({
  className: 'dsfr-btn',
  html: '<i class="fr-mr-1w ri-1x ri-map-pin-line"></i>Point',
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left ',
  interaction: drawPointInteraction,
});
let line = new Toggle({
  className: 'dsfr-btn',
  html: 'Ligne',
  classButton: 'fr-btn fr-icon-ign-dessiner-trace-line fr-btn--tertiary-no-outline fr-btn--icon-left ',
  interaction: drawLineStringInteraction,
});
let polygon = new Toggle({
  className: 'dsfr-btn',
  html: 'Surface',
  classButton: 'fr-btn fr-icon-ign-surface fr-btn--tertiary-no-outline fr-btn--icon-left ',
  interaction: drawPolygonInteraction,
});

let drawBar = new Bar({
  className: 'ol-bar--separator',
  toggleOne: true,
  controls: [
    point,
    line,
    polygon
  ]
})


let drawToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-pen-nib-line ',
  bar: drawBar,
});


// Interaction de mesure

let distanceMeasure = new Toggle({
  className: 'dsfr-btn',
  html: '<i class="fr-mr-1w ri-1x ri-ruler-line"></i>Mesurer une distance',
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left ',
});
let surfaceMeasure = new Toggle({
  className: 'dsfr-btn',
  html: 'Mesurer une surface',
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-icon-ign-surface fr-btn--icon-left ',
});
let isochrone = new Toggle({
  className: 'dsfr-btn',
  html: '<i class="fr-mr-1w ri-1x ri-map-pin-5-line"></i>Mesurer une isochrone',
  classButton: 'fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left ',
  // html:'Mesurer une isochrone',
  // classButton: 'fr-btn fr-icon-map-pin-2-line','fr-btn--tertiary-no-outline fr-btn--icon-left ',
});

let measureBar = new Bar({
  className: 'ol-bar--separator',
  toggleOne: true,
  controls: [
    distanceMeasure,
    surfaceMeasure,
    isochrone
  ]
})

let measureToggle = new Toggle({
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-ruler-line ',
  bar: measureBar
});

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
    selectToggle,
    interactionBar,
  ]
})

// Barre principale
let mainbar = new Bar({
  className: 'ol-bar--separator',
  toggleOne: true,
  controls: [carte.getControl('layerSwitcher'), addDataBar, editDataBar]
})

carte.addControl('mainBar', mainbar)

mainbar.setPosition('right')