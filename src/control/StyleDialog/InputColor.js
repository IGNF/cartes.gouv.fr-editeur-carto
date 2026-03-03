import Color from 'ol-ext/util/input/Color.js';
import getUid from "../../utils/getUid.js";

import './InputColor.scss';

/**
 * Input de type couleur pour le formulaire de style
 */
class InputColor extends Color {
  constructor(options) {
    options = options || {};
    options.position = options.position || 'fixed';
    options.paletteLabel = "Palette";
    options.pickerLabel = "Mélangeur";
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

    const palette = this.element.querySelector('.ol-palette');
    palette.innerHTML = '';
    this._paletteColor = [];
    const colors = [
      '#FFCC33', '#FFB03B', '#FF7F00', '#F00', '#FF8FC8', '#FF24FF', 
      '#2FDE30', '#97C005', '#008900', '#00FF9A', '#12D8B6', '#00AE91',
      '#00FFFF', '#0A76F6', '#000091', '#CC8BF9', '#9A00FF', '#BC6630',
      '#FFFFFF', '#CDCDCD', '#999999', '#666666', '#333333', '#000000',
    ]
    colors.forEach(color => {
      this.addPaletteColor(color, color);
    });
    palette.appendChild(document.createElement('hr'));
    Color.customColorList.forEach(function (c) {
      this._addCustomColor(this.getColorFromID(c));
    }.bind(this));


    // Eyedropper accessibility
    if (window.EyeDropper) {
      const self = this
      // Couleur sur le bouton pipette
      async function pickColor() {
        let eyeDropper = new EyeDropper();
        try {
          eyedropperBtn.classList.add('ol-active');
          eyedropperBtn.setAttribute('aria-pressed', 'true');
          let pickedColor = await eyeDropper.open();
          self.setColor(pickedColor.sRGBHex);
          eyedropperBtn.classList.remove('ol-active');
          eyedropperBtn.setAttribute('aria-pressed', 'false');
        } catch (error) {
          /* oops */
          console.warn(error);
          eyedropperBtn.classList.remove('ol-active');
          eyedropperBtn.setAttribute('aria-pressed', 'false');
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

  /**
   * Get the color input element
   * @returns {Element}
   */
  getInput() {
    return this.input;
  }
  /** Get 
   * Get the main element of the control
   * @returns {Element}
   */
  getElement() {
    return this.element;
  }

  /** change color on keypress
   * @private
   * @param {string} key 
   */
  _handleColorByKey(key) {
    // 0 = transparent
    if (key === '0' && !this.element.classList.contains('ol-nopacity')) {
      this.setColor([0, 0, 0, 0])
      return true;
    }
    if (!/^Arrow/.test(key)) return false;
    // Arrow key
    var col = 0, colors = [];
    Object.keys(this._paletteColor).forEach(function(c) {
      var p = this._paletteColor[c]
      if (p.element.classList.contains('ol-select')) {
        col = colors.length;
      }
      if (!this.element.classList.contains('ol-nopacity') || !p.element.classList.contains('ol-alpha')) {
        colors.push(p)
      }
    }.bind(this))
    switch (key) {
      case 'ArrowRight': {
        col += 1;
        break;
      }
      case 'ArrowLeft': {
        col -= 1;
        break;
      }
      case 'ArrowUp': {
        col -= 6;
        break;
      }
      case 'ArrowDown': {
        col += 6;
        break;
      }
    }
    if (colors[col]) {
      this._selectPalette(colors[col].color)
      this.setColor(colors[col].color)
    }
    return true;
  }
  _addCustomColor(color) {
    super._addCustomColor(color);
    while (Color.customColorList.getLength() > 18) {
      Color.customColorList.removeAt(0);
    }
  }

}

export default InputColor;