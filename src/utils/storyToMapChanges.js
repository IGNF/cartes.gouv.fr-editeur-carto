/**
 * @file
 * Fichier permettant de lier les modifications de la storymap avec la carte qui sera enregistrée.
 * 
 * Fonctionne via des écouteurs d'événements génériques openlayers.
 */

import story, { carte } from "../story.js";

// Paramètre de la story map, utilisé aussi pour le format et le 
let storyParam = carte.get("story");
if (!storyParam) {
  storyParam = {};
  carte.set("story", storyParam);
}

const saveModif = (obj) => {
  obj ??= {};
  carte.set("story", obj);
}

// Titre
story.on("change:title", (e) => {
  storyParam[e.key] = e.target.get(e.key);
  saveModif(storyParam);
})

// Sous-titre
story.on("change:subTitle", (e) => {
  storyParam[e.key] = e.target.get(e.key);
  saveModif(storyParam);
})
