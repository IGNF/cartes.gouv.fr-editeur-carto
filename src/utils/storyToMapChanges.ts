/**
 * @file
 * Fichier permettant de lier les modifications de la storymap avec la carte qui sera enregistrée.
 *
 * Fonctionne via des écouteurs d'événements génériques openlayers.
 */

// @ts-expect-error TS(7016): Could not find a declaration file for module '../s... Remove this comment to see the full error message
import story, { carte } from "../story.js";

// Paramètre de la story map, utilisé aussi pour le format et le
let storyParam = carte.get("story");
if (!storyParam) {
    storyParam = {};
    carte.set("story", storyParam);
}

const saveModif = (obj: any) => {
    obj ??= {};
    carte.set("story", obj);
};

// Sous-titre
story.on("change:showTitle", (e: any) => {
    storyParam[e.key] = e.target.get(e.key);
    saveModif(storyParam);
});

// Titre
story.on("change:title", (e: any) => {
    storyParam[e.key] = e.target.get(e.key);
    saveModif(storyParam);
});

// Sous-titre
story.on("change:subTitle", (e: any) => {
    storyParam[e.key] = e.target.get(e.key);
    saveModif(storyParam);
});

// Logo
story.on("change:logo", (e: any) => {
    if (!e.target.get(e.key)?.startsWith("data:image")) {
        // N'enregistre pas une image importée
        storyParam[e.key] = e.target.get(e.key);
        saveModif(storyParam);
    }
});
