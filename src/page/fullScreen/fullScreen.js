import { FullScreen } from 'ol/control.js';
import Toggle from 'ol-ext/control/Toggle.js';
import Bar from 'ol-ext/control/Bar.js';
import carte from '../../carte.js';

const fullScreenClass = 'ri-fullscreen-line';
const fullScreenExitClass = 'ri-fullscreen-exit-line';

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
  fullScreenToggle.button_.classList.add(fullScreenExitClass);
  fullScreenToggle.button_.classList.remove(fullScreenClass);
  fullScreenToggle.setTitle("Sortir du plein écran");
  fullScreenToggle.button_.ariaLabel = "Sortir du plein écran";
})

fullScreen.on('leavefullscreen', () => {
  fullScreenToggle.setActive(false);
  fullScreenToggle.button_.classList.add(fullScreenClass);
  fullScreenToggle.button_.classList.remove(fullScreenExitClass);
  fullScreenToggle.setTitle("Afficher le plein écran");
  fullScreenToggle.button_.ariaLabel = "Afficher le plein écran";
})

let fullScreenToggle = new Toggle({
  className: 'fullscreen-toggle',
  autoActivate: true,
  classButton: `fr-btn fr-btn--tertiary-no-outline ${fullScreenClass}`,
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