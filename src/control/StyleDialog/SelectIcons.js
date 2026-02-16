import FontSymbol from 'ol-ext/style/FontSymbol'
import CustomSelectGrid from "./CustomSelectGrid.js";

/**
 * @typedef {Object} SelectIconsConfig
 * @property {String} label Le label de l'input
 * @property {String} property La propriété flat style correspondante
 * @property {Array<String>} fonts Les options de la sélection (valeur: libellé)
 */

/**
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/} Pour voir l'inspiration
 */
class SelectIcons extends CustomSelectGrid {

  /**
   * Constructeur du contrôle StyleForm
   * @param {SelectIconsConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * @param {SelectIconsConfig} options Options du contrôle
   * @override
   */
  _initialize(options) {
    super._initialize(options);

    /**
     * Nom des fonts à charger
     * @type {Array<String>}
     */
    this.fonts = options.fonts || ["remixicon, blabalab"];

    const fonts = FontSymbol.defs?.fonts;
    const glyphs = FontSymbol.defs?.glyphs;
    if (!fonts || !glyphs) {
      console.warn("Aucune police n'est installée !");
      return
    }

    const opt = {}

    this.fonts = this.fonts.filter(f => fonts[f]);

    Object.entries(glyphs).forEach(([key, elem]) => {
      if (this.fonts.includes(elem.font)) {
        opt[key] = elem;
      }
    })

    this.options = opt;
    this.choices = Object.entries(this.options);
  }


  /**
   * @param {SelectIconsConfig} options Options du contrôle
   * @override
   */
  _initContainer(options) {
    super._initContainer(options);
  }

  /**
   * @param {SelectIconsConfig} options Options du contrôle
   */
  _initEvents(options) {
    super._initEvents(options);
  }
}

export default SelectIcons;