/**
 * @file Gère les mesures sur la carte.
 */


// import Bar from 'ol-ext/control/Bar'
// import Toggle from 'ol-ext/control/Toggle'
import Bar from '../../control/CustomBar/CustomBar.js'
import Toggle from '../../control/CustomToggle/CustomToggle.js'

// Interaction de mesure
let distanceMeasure = new Toggle({
  className: 'dsfr-btn',
  html: '<i class="fr-mr-1w ri-1x ri-ruler-line"></i>Mesurer une distance',
  classButton: 'fr-btn fr-btn--tertiary fr-btn--icon-left ',
});

let surfaceMeasure = new Toggle({
  className: 'dsfr-btn',
  html: 'Mesurer une surface',
  classButton: 'fr-btn fr-btn--tertiary fr-icon-ign-surface fr-btn--icon-left ',
});

let isochrone = new Toggle({
  className: 'dsfr-btn',
  html: '<i class="fr-mr-1w ri-1x ri-map-pin-5-line"></i>Mesurer une isochrone',
  classButton: 'fr-btn fr-btn--tertiary fr-btn--icon-left ',
});


function createBar(target) {
  let bar = new Bar({
    className: 'dsfr-btn-group fr-btns-group fr-btns-group--icon-left',
    target: target,
    toggleOne: true,
    controls: [
      distanceMeasure,
      surfaceMeasure,
      isochrone
    ]
  });

  return bar;
}
export { createBar };