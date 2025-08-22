import carte from '../../carte.js'

import './mobile-bar.scss'
import CustomBar from '../../control/CustomBar/CustomBar.js'

let mobileBar = new CustomBar({
  className: 'ol-bar--separator ol-bar--row mobile-bar',
});

/**
 * Fonction permettant de dupliquer un contrôle dans une barre
 * pour permettre de lier les deux contrôles
 * 
 * @param {import('ol/control').Control} control Contrôle à dupliquer
 */
function duplicate(control) {
  console.log(control)
  const options = parseOptions(control._options) || {};

  let ctrl = new control.constructor(options)
  console.log(ctrl)
  console.log(ctrl === control)
  mobileBar.addControl(ctrl)
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
  console.log(options)
  let opt = {}
  const ctrls = options.controls;
  if (ctrls && ctrls.length) {
    let controls = []
    ctrls.forEach(control => {
      const options = parseOptions(control._options) || {};
      let ctrl = new control.constructor(options)
      console.log(ctrl)
      controls.push(ctrl)
    });
    opt.controls = controls;
  }

  const bar = options.bar;
  if (bar) {
    const options = parseOptions(bar._options) || {};
    let ctrl = new bar.constructor(options);
    opt.bar = ctrl;
  }

  for (const attr in options) {
    if (attr !== 'controls' && attr!== 'bar') {
      opt[attr] = options[attr];
    }
  }

  return opt;
}

carte.addControl('mobilebar', mobileBar)
mobileBar.setPosition('top')

export default duplicate