/**
 * @file Formulaire pour l'étiquette d'un objet
 */
import InputColor from './InputColor.js';
import BaseEvent from 'ol/events/Event.js';
import ExtendedFlatStyleForm from './ExtendedFlatStyleForm.js';
import { StyleEvent } from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';

/**
 * @typedef {Object} LabelFormOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [preview = false] Faux par défaut. Si vrai, affiche la preview. L'affichage de la preview est contrôlé par la méthode `showPreview(bool)`.
 * @property {Boolean} [selectGeomType = false] Faux par défaut. Si vrai, affiche le sélecteur pour changer le type d'objet à modifier. L'affichage de la sélection est contrôlé par la méthode `showSelectGeomType(bool)`.
 * @property {import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} [type] Si donné, utilise la méthode setGeom(type) sur le formulaire pour modifier directement le type.
 * @property {Boolean} [generalType = true] Vrai par défaut. Si vrai, le type de géométrie n'influe pas sur le formulaire et seul 3 inputs sont ajoutés. Sinon, les propriétés flat-style sont précédés du type de géométrie et ne sont affichés que si le type de géométrie est donné.
 */


class LabelForm extends ExtendedFlatStyleForm {
  /**
   * @param {LabelFormOptions} options Options du constructeur
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * @param {LabelFormOptions} options Options du constructeur
   * @override
   */
  _initialize(options) {
    super._initialize(options);

    options.generalType ??= true;
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @param {LabelFormOptions} options Options du constructeur
   * @abstract
   * @protected
   */
  _addCustomInputs(options) {
    if (options.generalType === false) {
      this._addLabelInputs("Point");
      this._addLabelInputs("LineString");
      this._addLabelInputs("Polygon");
    } else {
      this._addLabelInputs();
    }
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `Point`
   * @param {"Point"|"LineString"|"Polygon"} [type] Si donné, ajoute un préfixe aux propriétés flat-style
   * @private
   */
  _addLabelInputs(type) {
    // Ajoute un préfix si nécessaire
    let prefix = "";
    switch (type) {
      case 'Point':
        prefix = "point-";
        break;
      case 'LineString':
        prefix = "line-";
        break;
      case 'Polygon':
        prefix = "fill-";
        break;
      default:
        break;
    }

    /** @type {HTMLTextAreaElement} */
    const label = this.addInput({
      label: "Texte",
      property: `${prefix}text-value`,
      type: "textarea"
    });
    // Update label value on keyup with a delay to avoid too many updates
    let tout, value = label.value;
    label.addEventListener('keyup', () => {
      if (label.value === value) return;
      clearTimeout(tout);
      tout = setTimeout(() => {
        this.dispatchEvent(new StyleEvent(`${prefix}text-value`, label.value));
        value = label.value;
      }, 300);
    });
    label.addEventListener('change', () => {
      clearTimeout(tout);
    });

    // break
    this.addBreak(`${prefix}text`,);

    // Couleur et taille du texte
    this.addInput({
      label: 'Couleur',
      property: `${prefix}text-fill-color`,
      input: new InputColor()
    });

    this.addInput({
      label: 'Taille',
      labelInfo: '(px)',
      property: `${prefix}text-size`,
      type: 'number',
    });

  }

}

// Création du formulaire de style
const labelForm = new LabelForm();

export default labelForm;
export { LabelForm };