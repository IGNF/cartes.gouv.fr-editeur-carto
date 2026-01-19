// Extensions géoplateforme
import 'geoportal-access-lib/dist/GpServices.js';

import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';

// Ma Carte
import Carte from './mcutils/Carte.js';

import charte from './charte/charte.js';

import 'ol-ext/dist/ol-ext.css'
import 'mcutils/Carte.css';
import 'mcutils/Carte.js';
import ModifyingInteraction from 'geopf-extensions-openlayers/src/packages/Interactions/Modifying.js';

// The Carte
const carte = new Carte({
  target: charte.getElement('map'),
  // Default Carte
  url: import.meta.env.BASE_URL + 'carte/template.carte'
})
// Only one selction when editing features
carte.getSelect().multi_ = false;

const modify = new ModifyingInteraction({
  select : carte.getInteraction('select'),
})
carte.getMap().addInteraction(modify);

export default carte