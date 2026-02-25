import CustomSelectGrid from "./CustomSelectGrid.js";
import ol_style_FillPattern from "ol-ext/style/FillPattern";

/**
 * @typedef {Object} SelectPatternConfig Option du constructeur SelectPattern
 * @property {String} label Le label de l'input
 * @property {String} property La propriété flat style correspondante
 * @property {Object} options Les options des motifs
 */


/**
 * @typedef {Object} PatternValue Objet contenant les valeurs du motif
 * @property {String} pattern Nom du motif
 * @property {Number} [angle] Valeur de l'angle correspondante
 */

/**
 * @classdesc Input permettant de sélectionner des icônes. Celle-ci sont extraites de remixicon.
 */
class SelectPattern extends CustomSelectGrid {

  /**
   * Constructeur du contrôle SelectIcons
   * @param {SelectPatternConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * 
   * @param {Number} index Indice de l'élément
   * @param {Boolean} silent Si vrai, n'envoie pas d'événement change
   */
  selectOption(index, silent = false) {
    // Fait le changement sans envoyer d'événement
    // pour changer la valeur de l'input après
    super.selectOption(index, silent);

    const chosenOption = this.optionsContent.querySelector("[role=option][aria-selected='true'] > span");
    if (chosenOption) {
      this.choice.style.maskImage = chosenOption.style.maskImage
    }
  }

  /**
   * Transforme un motif dans un format prédéfini de chaîne
   * de charactère en objet.
   * 
   * Le format est le suivant : `"motif,angle"`.
   * @param {String} value Valeur en chaîne de charactère
   * @returns {PatternValue} Valeur du motif
   */
  getPatternValue(value) {
    const array = value.split(";");
    const patternOption = {
      pattern: array[0],
      angle: array[1] ? parseInt(array[1]) : 0,
    }
    return patternOption;
  }

  /**
   * @param {String} value Valeur du choix (dépend de la propriété)
   * @param {String} label Libellé à afficher
   * @param {Number} index Indice de l'élément (utile pour les raccourcis claviers)
   * @override Ajoute le style de l'élément
   */
  addChoice(value, label, index) {
    const option = super.addChoice(value, label, index);
    const choice = option.querySelector("span");
    const patternOption = this.getPatternValue(value);
    const pattern = new ol_style_FillPattern(patternOption);

    choice.style.maskImage = patternOption.pattern ? 'url("' + pattern.getImage().toDataURL()+'")' : ''

    return option
  }
}

export default SelectPattern;