import { FullScreen } from 'ol/control.js';
// import Toggle from 'ol-ext/control/Toggle.js';
// import Bar from 'ol-ext/control/Bar.js';
import Toggle from '../../control/CustomToggle/CustomToggle.js'
import Bar from '../../control/CustomBar/CustomBar.js';
import carte from '../../carte.js';

function onToggle() {
  fullScreen.button_.click();
}

let fullScreen = new FullScreen({
  className: 'fr-hidden',
  activeClassName: 'fr-hidden',
  inactiveClassName: 'fr-hidden',
  source: document.body.querySelector('main'),
})

fullScreen.on('enterfullscreen', () => {
  fullScreenToggle.setActive(true);
})

fullScreen.on('leavefullscreen', () => {
  fullScreenToggle.setActive(false);
})

let fullScreenToggle = new Toggle({
  className: 'fullscreen-toggle',
  autoActivate: true,
  classButton: 'fr-btn fr-btn--tertiary-no-outline ri-fullscreen-line',
  attributes: {
    title: "Afficher le plein écran",
    'aria-label': "Afficher le plein écran",
  },
  onToggle: onToggle
})

// TODO : changer la barre pour inclure le zoom
let bar = new Bar({
  className: 'temp-fullscreen-bar',
  controls: [fullScreenToggle],
})

carte.addControl('fullScreen-hidden', fullScreen)
carte.addControl('fullScreen', bar)

bar.setPosition('bottom-right')