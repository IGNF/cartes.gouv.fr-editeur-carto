import carte from "../carte.js";

// Prevent unload
let dirty = false;

window.onbeforeunload = function() {
// console.log('BEFOREUNLOAD', dirty)
  // is map dirty
  return dirty ? 'La carte a été modifiée...' : null;
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


/* Handle map modifications */
carte.on('change', () => setDirty(true));
carte.getMap().getLayerGroup().on('change', () => setDirty(true));
carte.on(['read', 'save'], () => setDirty(false));

/** Map has changed */
carte.hasChanged = function() {
  return dirty;
}

export default dirty;
