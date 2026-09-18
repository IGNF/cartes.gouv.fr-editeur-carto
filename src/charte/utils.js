import charte from './charte.js';

let bearer = "";

/**
 * Set the user from an API event
 * @param {Event} e 
 */
export function setUser(e) {
  let error = e.error
  let type = e.type;
  if (e && !error && type !== 'logout') {
    let user = e.user ? e.user : e;
    charte.setConnected(true);
    charte.getHeaderMenu({ action: 'connect' }).setMenu('user', {
      label: user.username,
      info: user.email
    })
  } else {
    charte.setConnected(false)
  }
}

/**
 * Vérifie si la propriété `inert` est supportée par le navigateur.
 * 
 * @returns {boolean}
 */
export function isInertAvailable() {
  return "inert" in HTMLElement.prototype;
}

/**
 * Permet de définir le bearer utilisé par l'appli
 * @param {string} bearer Bearer à utiliser dans les requêtes
 */
export function setBearer(b) {
  bearer = b;
}

/**
 * Retourne le bearer utilisé dans les requêtes
 * @returns {string} Bearer à utiliser dans les requêtes
 */
export function getBearer() {
  return bearer;
}