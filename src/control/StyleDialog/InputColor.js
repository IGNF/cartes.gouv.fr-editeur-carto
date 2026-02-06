import Color from 'ol-ext/util/input/Color.js';
import getUid from "../../utils/getUid";

import './InputColor.scss';

/**
 * Input de type couleur pour le formulaire de style
 */
class ColorInput extends Color {
  constructor(options) {
    options = options || {};
    options.position = options.position || 'fixed';
    super(options);
    // Dispatch change event on color change
    this.input.addEventListener('change', e => this.setColor(e.target.value));
    // Style des boutons
    this.element.querySelectorAll('button').forEach(btn => {
      btn.className = 'fr-btn fr-btn--tertiary';
    });
    // Popup accessibility
    this._elt.popup.id = getUid('color-picker-popup');
    this.element.id = getUid('color-picker');
    this.element.ariaLabel = 'Sélecteur de couleur';
    this.element.ariaExpanded = false;
    this.element.role = 'button';
    this.element.setAttribute('aria-controls', this._elt.popup.id);
    this.on('collapse', e => {
      this.element.ariaExpanded = e.visible;
    });

    // Eyedropper accessibility
    if (window.EyeDropper) {
      const self = this
      // Couleur sur le bouton pipette
      async function pickColor() {
        let eyeDropper = new EyeDropper();
        try {
          let pickedColor = await eyeDropper.open();
          self.setColor(pickedColor.sRGBHex);
          console.log(pickedColor.sRGBHex);
        } catch (error) {
          /* oops */
        }
      }
      this.element.classList.add('eyedropper');
      const eyedropperBtn = document.createElement('button');
      eyedropperBtn.className = 'ol-eyedropper fr-btn fr-btn--tertiary fr-icon-sip-line';
      eyedropperBtn.type = 'button';
      eyedropperBtn.ariaLabel = 'Outil pipette';
      eyedropperBtn.title = 'Outil pipette';
      eyedropperBtn.addEventListener('click', pickColor);
      this.element.querySelector('.ol-container').insertBefore(eyedropperBtn, this.element.querySelector('.ol-txt-color'));
    }
  }

  getInput() {
    return this.input;
  }

  getElement() {
    return this.element;
  }
}

export default ColorInput;