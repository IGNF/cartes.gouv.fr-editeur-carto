/**
 * @file Gère la création d'un objet.
 */


// import Bar from 'ol-ext/control/Bar'
// import Toggle from 'ol-ext/control/Toggle'
import Bar from '../../control/CustomBar/CustomBar.js'
import Toggle from '../../control/CustomToggle/CustomToggle.js'

import Draw from 'ol/interaction/Draw.js';
import VectorSource from 'ol/source/Vector.js';

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
  classButton: 'fr-btn fr-btn--tertiary fr-btn--icon-left ',
  interaction: drawPointInteraction,
});

let line = new Toggle({
  className: 'dsfr-btn',
  html: 'Ligne',
  classButton: 'fr-btn fr-icon-ign-dessiner-trace-line fr-btn--tertiary fr-btn--icon-left ',
  interaction: drawLineStringInteraction,
});

let polygon = new Toggle({
  className: 'dsfr-btn',
  html: 'Surface',
  classButton: 'fr-btn fr-icon-ign-surface fr-btn--tertiary fr-btn--icon-left ',
  interaction: drawPolygonInteraction,
});


function createBar(target) {
  let bar = new Bar({
    className: 'dsfr-btn-group fr-btns-group fr-btns-group--icon-left',
    target: target,
    toggleOne: true,
    controls: [
      point,
      line,
      polygon
    ]
  })

  return bar;
}
export { createBar };