import 'geoportal-access-lib/dist/GpServices.js';
import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';
import loadFonts from 'mcutils/cgouv/loadFonts.js'

import StoryMap from 'mcutils/StoryMap.js';
import Carte from 'mcutils/cgouv/Carte.js';

import charte from './charte/charte.js';

// Extensions géoplateforme
import 'ol-ext/dist/ol-ext.css'
import 'mcutils/Carte.css';
import './css/modes.scss';

loadFonts()

const story = new StoryMap({
  target: charte.getElement('map'),
});
story.showTitle(false);
// The Carte
const carte = new Carte({
  // Default Carte
  url: import.meta.env.BASE_URL + 'carte/template.carte'
})

story.setCarte(carte);

export default story;
// Export de la carte pour certains fichiers (avant appel de carte.js)
export { carte };