import StoryMap from 'mcutils/StoryMap.js';
import Carte from 'mcutils/cgouv/Carte.js';
import 'mcutils/Carte.js';

import charte from './charte/charte.js';

// Extensions géoplateforme
import 'ol-ext/dist/ol-ext.css'

import 'geoportal-access-lib/dist/GpServices.js';
import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';

import 'mcutils/Carte.css';
import './story.scss';

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
story.setTitle("Titre de la StoryMap");
story.setLogo("https://upload.wikimedia.org/wikipedia/commons/a/a0/IGN_logo_2012.svg");

export default story;