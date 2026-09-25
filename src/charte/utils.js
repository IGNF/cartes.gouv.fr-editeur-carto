/**
 * Vérifie si la propriété `inert` est supportée par le navigateur.
 * 
 * @returns {boolean}
 */
export function isInertAvailable() {
  return "inert" in HTMLElement.prototype;
}