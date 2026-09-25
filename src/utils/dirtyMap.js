import carte from "../carte.js";
import { getOidc } from "../oidc.js";

// Prevent unload
let dirty = false;

window.onbeforeunload = async function() {
// console.log('BEFOREUNLOAD', dirty)
  // is map dirty
  // Vérifie que l'user est loggé avant
  const oidc = await getOidc();
  if (oidc.isUserLoggedIn) {
    return dirty ? 'La carte a été modifiée...' : null;
  } else {
    return null;
  }
}


/**
 * Returns true if any modifcations occurs on the map.
 * @param {*} b 
 * @returns 
 */
function setDirty(b) {
  if (b === dirty) return;
  if (b) {
    dirty = true;
  } else {
    setTimeout(() => { 
      dirty = false;
    }, 500)
  }
}


/* Attend que la carte soit chargée */
carte.once('read', () => {
  carte.on('change', () => setDirty(true));
  carte.getMap().getLayerGroup().on('change', () => setDirty(true));
  carte.on(['read', 'save'], () => setDirty(false));

  /** Map has changed */
  carte.hasChanged = function () {
    return dirty;
  }
});

export default dirty;
