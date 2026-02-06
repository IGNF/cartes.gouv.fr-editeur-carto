import Color from 'ol-ext/util/input/Color.js';

import './inputColor.scss';

/**
 * Input de type couleur pour le formulaire de style
 */
class ColorInput extends Color {
  constructor(options) {
    options = options || {};
    options.position = options.position || 'fixed';
    super(options);
    this.input.addEventListener('change', e => this.setColor(e.target.value));
    this.element.querySelectorAll('button').forEach(btn => {
      btn.className = 'fr-btn fr-btn--tertiary';
    });
  }
}

export default ColorInput;