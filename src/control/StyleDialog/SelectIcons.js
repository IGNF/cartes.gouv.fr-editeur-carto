import FontSymbol from 'ol-ext/style/FontSymbol.js';
import CustomSelectGrid from "./CustomSelectGrid.js";

/**
 * @typedef {Object} SelectIconsConfig
 * @property {String} label Le label de l'input
 * @property {String} property La propriété flat style correspondante
 * @property {Array<String>} fonts Les options de la sélection (valeur: libellé)
 */

let selectedIcons = [
  "ri-Map-pin-2-fill",
  "ri-Map-pin-user-fill",
  "ri-Map-pin-add-fill",
  "ri-Map-pin-3-fill",
  "ri-Flag-fill",
  "ri-Circle-fill",
  "ri-Square-fill",
  "ri-Triangle-fill",
  "ri-Pentagon-fill",
  "ri-Hexagon-fill",
  "ri-Poker-diamonds-fill",
  "ri-Arrow-up-circle-fill",
  "ri-Arrow-down-circle-fill",
  "ri-Checkbox-circle-fill",
  "ri-Close-circle-fill",
  "ri-Information-fill",
  "ri-Error-warning-fill",
  "ri-Alert-fill",
  "ri-Question-fill",
  "ri-Time-fill",
  "ri-Prohibited-2-fill",
  "ri-Settings-fill",
  "ri-Focus-3-fill",
  "ri-Heart-fill",
  "ri-Star-fill",
  "ri-Shield-fill",
  "ri-Tools-fill",
  "ri-Barricade-fill",
  "ri-Lightbulb-fill",
  "ri-Home-4-fill",
  "ri-Building-4-fill",
  "ri-Hospital-fill",
  "ri-School-fill",
  "ri-Building-3-fill",
  "ri-Bank-fill",
  "ri-Car-fill",
  "ri-Truck-fill",
  "ri-Caravan-fill",
  "ri-Train-fill",
  "ri-Bus-fill",
  "ri-Plane-fill",
  "ri-Sailboat-fill",
  "ri-Ship-2-fill",
  "ri-Motorbike-fill",
  "ri-Riding-fill",
  "ri-Walk-fill",
  "ri-Subway-fill",
  "ri-Anchor-fill",
  "ri-Parking-box-fill",
  "ri-Gas-station-fill",
  "ri-Cup-fill",
  "ri-Restaurant-fill",
  "ri-Gobelet-fill",
  "ri-Hotel-bed-fill",
  "ri-Tent-fill",
  "ri-Shopping-bag-fill",
  "ri-Money-euro-circle-fill",
  "ri-Camera-fill",
  "ri-Music-2-fill",
  "ri-Scales-3-fill",
  "ri-Basketball-fill",
  "ri-Chess-fill",
  "ri-Diploma-fill",
  "ri-Book-shelf-fill",
  "ri-Film-fill",
  "ri-First-aid-kit-fill",
  "ri-Heart-pulse-fill",
  "ri-Stethoscope-fill",
  "ri-Tooth-fill",
  "ri-Capsule-fill",
  "ri-Virus-fill",
  "ri-Landscape-fill",
  "ri-Tree-fill",
  "ri-Leaf-fill",
  "ri-Seeding -fill",
  "ri-Delete-fill",
  "ri-Bug-fill",
  "ri-Base-station-fill",
  "ri-Battery-charge-fill",
  "ri-Wifi-fill",
  "ri-Dashboard-3-fill",
  "ri-Team-fill",
  "ri-Parent-fill",
  "ri-Account-fill",
  "ri-Accessibility-fill",
  "ri-Wheelchair-fill",
  "ri-Computer-fill",
  "ri-Phone -fill",
  "ri-Mail-fill",
  "ri-File-text-fill",
  "ri-Calendar-fill",
  "ri-Chat-2-fill",
  "ri-Sun-fill",
  "ri-Moon-fill",
  "ri-Cloudy-2-fill",
  "ri-Heavy-showers-fill",
  "ri-Snowflake-fill",
  "ri-Flashlight-fill",
  "ri-Windy-fill",
  "ri-Fire-fill",
  "ri-Submersion-fill",
  "ri-Flood-fill",
  // Icônes DSFR / DSFR-extension
  "fr-icon-Mer-fill",
  "fr-icon-Avalanches-fill",
  "fr-icon—ear-of-fill",
  "fr-icon—mental-disabilities-fill",
  "fr-icon—signlanguage-fill",
];

selectedIcons = selectedIcons.map(icon => icon.toLowerCase());

/**
 * @classdesc Input permettant de sélectionner des icônes. Celle-ci sont extraites de remixicon.
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
    this.fonts = options.fonts || ["remixicon"];

    const fonts = FontSymbol.defs?.fonts;
    const glyphs = FontSymbol.defs?.glyphs;
    if (!fonts || !glyphs) {
      console.warn("Aucune police n'est installée !");
      return;
    }

    // Par défaut : aucune icône
    const opt = {
      " ": "Sans icône",
    }

    this.fonts = this.fonts.filter(f => fonts[f]);

    // // Version avec recherche (prend toutes les icônes en compte)
    // Object.entries(glyphs).forEach(([key, elem]) => {
    //   console.log(key)
    //   if (this.fonts.includes(elem.font) && (selectedIcons.includes(key))) {
    //     opt[key] = elem;
    //   }
    // })

    selectedIcons.forEach(icon => {
      const elem = glyphs[icon];
      if (elem && this.fonts.includes(elem.font)) {
        opt[icon] = elem;
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

  selectOption(index, silent = false) {
    super.selectOption(index, silent);

    // Gère le label de l'input
    const option = this.choices[index];
    const label = option[1];
    this.inputContainer.ariaLabel = typeof label === "object" ? label.name : label;
  }

  /**
   * Créé une option avec une valeur et un label
   * @param {String} value Valeur du choix (dépend de la propriété)
   * @param {String} label Libellé à afficher
   * @param {Number} index Indice de l'élément (utile pour les raccourcis claviers)
   * @override
   */
  addChoice(value, label, index) {
    const option = super.addChoice(value, label, index)
    if (typeof label === "object") {
      // Icônes via une font
      option.ariaLabel = label.name
    }
    return option;
  }
}

export default SelectIcons;