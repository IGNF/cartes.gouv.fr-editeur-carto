
import Carte from "mcutils/Carte";
import { isInertAvailable } from "../charte/utils";

// Interactions sur la carte
const interactions: Record<number, boolean> = {};
/**
 * Bloque les interactions avec la carte
 */
export function setInert(carte: Carte) {
  const inert = carte.getMap().getTargetElement().inert;
  if (!inert) {
    carte.getMap().getTargetElement().inert = true;

    // Inert non supporté : empêche les interactions et cache les éléments
    if (!isInertAvailable()) {
      carte.getMap().getTargetElement().classList.add('inert-legacy');
      carte.getMap().getInteractions().forEach(i => {
        // Pour ne réactiver que les interactions active plus tard
        // @ts-ignore
        interactions[i.ol_uid] = i.getActive();
        i.setActive(false);
      })
    }
  }
}

/**
 * Ajoute un élément HTML sur l'application pour bloquer la carte
 */
export function unsetInert(carte: Carte) {
  carte.getMap().getTargetElement().inert = false;

  if (!isInertAvailable()) {
    carte.getMap().getTargetElement().classList.remove('inert-legacy')
    carte.getMap().getInteractions().forEach(i => {
      // Réactive les interactions
      // @ts-ignore
      const active = interactions[i.ol_uid];
      i.setActive(active);
    })
  }
}
