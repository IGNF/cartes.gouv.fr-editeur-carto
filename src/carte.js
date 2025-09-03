// Ma Carte
import Carte from './mcutils/Carte.js';

import charte from './charte/charte.js';

import 'ol-ext/dist/ol-ext.css'
import 'mcutils/Carte.css';
import 'mcutils/Carte.js';

// Extensions géoplateforme
import 'geoportal-access-lib/dist/GpServices.js';

import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';

// The Carte
const carte = new Carte({
  target: charte.getElement('map'),
  // Default Carte
  url: import.meta.env.BASE_URL + 'carte/template.carte'
})

export default carte