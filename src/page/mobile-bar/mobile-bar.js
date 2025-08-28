import carte from '../../carte.js'
import charte from '../../charte/charte.js';
import Charte from '../../charte/objects/Charte.js';
import { Collection } from 'ol';

import './mobile-bar.scss'
import CustomBar from '../../control/CustomBar/CustomBar.js'

let mobileBar = new CustomBar({
  className: 'ol-bar--separator ol-bar--row mobile-bar',
});

const duplicateControls = new Collection()

/**
 * Fonction permettant de dupliquer un contrôle dans une barre
 * pour permettre de lier les deux contrôles
 * 
 * @param {import('ol/control').Control} control Contrôle à dupliquer
 */
function duplicate(control) {
  const options = parseOptions(control._options) || {};

  let ctrl = new control.constructor(options)
  mobileBar.addControl(ctrl)
  duplicateControls.push(ctrl)
}

/**
 * Copie les options du contrôle en créant de
 * nouveaux contrôles au besoin
 * 
 * @param {Object} options Option du contrôle
 * @returns {Object} options du contrôle avec
 * d'autres contrôles si nécessaire
 */
function parseOptions(options) {
  let opt = {}
  const ctrls = options.controls;
  if (ctrls && ctrls.length) {
    let controls = []
    ctrls.forEach(control => {
      const options = parseOptions(control._options) || {};
      let ctrl = new control.constructor(options)
      controls.push(ctrl)
      duplicateControls.push(ctrl)
    });
    opt.controls = controls;
  }

  const bar = options.bar;
  if (bar) {
    const options = parseOptions(bar._options) || {};
    let ctrl = new bar.constructor(options);
    duplicateControls.push(ctrl)

    opt.bar = ctrl;
  }

  for (const attr in options) {
    if (attr !== 'controls' && attr !== 'bar') {
      opt[attr] = options[attr];
    }
  }

  return opt;
}

carte.addControl('mobilebar', mobileBar)
mobileBar.setPosition('top')
duplicateControls.push(mobileBar)

// Lien avec la barre non mobile
const toggleModes = {}

// Récupère les toggle de création / mise en page
duplicateControls.on('add', (e) => {
  const elem = e.element;
  const options = elem._options;
  if (options && options.attributes && options.attributes['data-action']) {
    const action = options.attributes['data-action'];
    switch (action) {
      case Charte.modes.EDITOR:
        toggleModes[Charte.modes.EDITOR] = elem;
        break;

      case Charte.modes.STORYMAP:
        toggleModes[Charte.modes.STORYMAP] = elem;
        break;
    }
  }
})

charte.on('change:mode', (e) => {
  const mode = e.target.getMode();
  const previousMode = e.oldValue;
  const toggle = toggleModes[mode];
  const oldToggle = toggleModes[previousMode]
  if (toggle && oldToggle) {
    toggle.setActive(true);
    toggle.set('autoActivate', true);
    oldToggle.set('autoActivate', false);
  }
});

export default duplicate