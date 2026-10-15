/**
 * Si vrai, ajoute une écoute sur l'événement `beforeunload` pour éviter
 * que l'utilisateur·ice perde ses données
 */
let dirty = false;

/**
 * Permet de 
 * @param ev Événement à gérer
 */
export const beforeUnloadHandler = async (ev: BeforeUnloadEvent) => {
  ev.preventDefault();
  ev.returnValue = true;
};

/**
 * Si vrai, ajoute un écouteur d'événement.
 * Si faux, enlève cet écouteur.
 * @param b Vrai s'il faut demander confirmation à l'utilisateur, faux sinon
 */
export function setDirty(b: boolean) {
  if (b === dirty) return;
  dirty = b;
  if (b) {
    window.addEventListener("beforeunload", beforeUnloadHandler);
  } else {
    window.removeEventListener("beforeunload", beforeUnloadHandler);
  }
}

export default dirty;
