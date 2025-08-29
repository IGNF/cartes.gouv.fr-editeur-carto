import Control from 'ol/control/Control.js';
import './Beta.scss';

/**
 * @typedef {Object} Options
 * @property {string} [className] Classe css à ajouter au contrôle (en plus de
 * la classe par défaut `ol-beta`).
 * @property {string} [label='Version Bêta'] Label du badge.
 * @property {HTMLElement|string} [target] Élément cible sur lequel ajouter le contrôle.
 */

/**
 * @classdesc
 * Élément affiché sur la carte pour indiquer que le site
 * est en version bêta.
 */
class Beta extends Control {
  /**
   * @param {Options} [options] Options du contrôle.
   */
  constructor(options) {

    options = options ? options : {};

    super({
      element: document.createElement('div'),
      target: options.target,
    });

    let className = options.className !== undefined ? options.className : '';

    this.element.className = `${className}`;
    this.element.classList.add('ol-beta');

    this.badge = document.createElement('p');
    this.element.appendChild(this.badge);
    // this.badge.classList.add('fr-badge', 'fr-badge--green-emeraude');
    this.badge.classList.add('fr-badge', 'fr-badge--success', 'fr-badge--no-icon');

    if (options.label) {
      this.badge.textContent = options.label
    } else {
      this.badge.textContent = 'Version Bêta'
    }
  }
}

export default Beta;