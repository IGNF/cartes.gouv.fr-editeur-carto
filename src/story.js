import 'geoportal-access-lib/dist/GpServices.js';
import 'geopf-extensions-openlayers/src/packages/CSS/DSFRgeneralWidget.css';
import 'geopf-extensions-openlayers/css/Dsfr.css';
import loadFonts from 'mcutils/cgouv/loadFonts.js'

import StoryMap from 'mcutils/StoryMap.js';
import Carte from 'mcutils/cgouv/Carte.js';

import charte from './charte/charte.js';
import config from 'mcutils/config/config.js';

// Extensions géoplateforme
import 'ol-ext/dist/ol-ext.css'
import 'mcutils/Carte.css';
import './css/modes.scss';
import { setLogo, setTitle } from './utils/story.js';

import Gp from "geoportal-access-lib/dist/GpServices-src.js"

loadFonts()

const story = new StoryMap({
  target: charte.getElement('map'),
});
story.showTitle(false);
// Carte par défaut
const carte = new Carte({});

// Connecte aux services géoportail
Gp.Services.getConfig({
  customConfigFile: config.customConfigFile,
  timeOut: 20000,
  onSuccess: (e) => carte.read(import.meta.env.BASE_URL + 'carte/template.carte'),
  onFailure: (e) => {
    console.error(e);
    // Impossible d'importer la couche du catalogue
    carte.read(import.meta.env.BASE_URL + 'carte/template_error.carte');
  }
});

// Ajoute les options de la storymap dans la storymap après lecture de la carte
carte.on("read", () => {
  const storyParam = carte.get("story");
  if (storyParam) {
    Object.entries(storyParam).forEach(([key, value]) => {
      story.set(key, value)
    })
  }

  // Modifie le DOM de la storymap pour afficher le titre / sous-titre
  if (story.get("title") || story.get("subTitle")) {
    setTitle(story, { title: story.get("title"), subTitle: story.get("subTitle") })
  }

  // N'affiche pas le logo  s'il n'y en a pas
  story.target.dataset.logo = story.get("logo") ? "" : "none";
  setLogo(story, story.get("logo"));

  // Affiche le titre s'il y'en a un
  story.get("showTitle") ? story.showTitle(true) : story.showTitle(false);
})
story.setCarte(carte);

export default story;
// Export de la carte pour certains fichiers (avant appel de carte.js)
export { carte };