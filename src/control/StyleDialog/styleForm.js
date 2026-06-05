/**
 * @file Formulaire pour le style d'un objet
 */

import ExtendedFlatStyleForm from './ExtendedFlatStyleForm.js';
import InputColor from './InputColor.js';
import SelectIcons from './SelectIcons.js';

/**
 * @typedef {Object} StyleFormOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [preview = false] Si vrai, affiche la preview. L'affichage de la preview est contrôlé par la méthode `showPreview(bool)`. 
 * @property {Boolean} [selectGeomType = false] Si vrai, affiche le sélecteur pour changer le type d'objet à modifier. L'affichage de la sélection est contrôlé par la méthode `showSelectGeomType(bool)`.
 * @property {import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} [type] Si donné, utilise la méthode setGeom(type) sur le formulaire pour modifier directement le type.
 */

class StyleForm extends ExtendedFlatStyleForm {

  /**
   * @param {StyleFormOptions} options Options du constructeur
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @param {StyleFormOptions} options Options du constructeur
   * @abstract
   * @protected
   */
  _addCustomInputs(options) {
    this._addPointInputs(options);
    this._addLineStringInputs(options);
    this._addPolygonInputs(options);
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `Point`
   * @private
   */
  _addPointInputs() {
    this.addInput({
      label: 'Forme',
      property: 'point-form',
      type: "form",
      options: {
        none: 'Sans',
        marker: 'Marqueur',
        circle: 'Cercle',
        square: 'Carré',
        triangle: 'Triangle',
      }
    });

    this.addInput({
      label: 'Couleur',
      property: 'point-color',
      input: new InputColor(),
    });

    this.addInput({
      label: 'Taille',
      labelInfo: '(px)',
      property: 'point-radius',
      type: "number",
    });

    this.addBreak('point-form');
    this.addInput({
      label: 'Bordure',
      property: 'point-stroke-color',
      input: new InputColor()
    });

    this.addInput({
      label: 'Taille',
      labelInfo: '(px)',
      property: 'point-stroke-width',
      type: "number",
    });

    this.addBreak('point-stroke');

    const inputIcons = new SelectIcons({
      label: 'Symbole',
      property: 'point-glyph',
      type: 'icon',
      fonts: ["remixicon"],
    })
    this.addInput({
      property: 'point-glyph',
      input: inputIcons,
    });
    this.addInput({
      label: 'Couleur',
      property: 'point-symbol-color',
      input: new InputColor()
    });
    this.addBreak('point-symbol');
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `LineString`
   * @private
   */
  _addLineStringInputs() {

    // LIGNE ET POLYGONE
    this.addInput({
      label: 'Bordure',
      property: 'stroke-line-dash',
      options: {
        "": "Continue",
        "5,5": "Tiret",
        "0,5": "Pointillé",
        "10,5,0,5": "Tirets irréguliers",
      },
      type: "stroke",
    });
    this.addInput({
      label: 'Couleur',
      property: 'stroke-color',
      input: new InputColor()
    });
    this.addInput({
      label: 'Taille',
      labelInfo: '(px)',
      property: 'stroke-width',
      type: "number",
    });

    this.addBreak('line-arrow');
    this.addInput({
      label: 'Début',
      // disabled: true,
      property: 'line-arrow-start',
      options: {
        "": "Simple",
        "triangle": "Flèche",
        "circle": "Rond",
        "square": "Carré",
      },
      type: "arrow",
    });

    this.addInput({
      label: 'Fin',
      property: 'line-arrow-end',
      options: {
        "": "Simple",
        "triangle": "Flèche",
        "circle": "Rond",
        "square": "Carré",
      },
      type: "arrow",
    });
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `Polygon`
   * @private
   */
  _addPolygonInputs() {
    // POLYGONE //
    const inputPattern = this.addInput({
      label: 'Motif',
      property: 'fill-pattern-config',
      options: {
        "": "Plein",
        "hatch;0": "Lignes verticales",
        "hatch;90": "Lignes horizontales",
        "hatch;45": "Diagonales (droite)",
        "hatch;135": "Diagonales (gauche)",
        "cross;1": "Quadrillage",
        "dot;1": "Points",
        "tile;1": "Carrés",
        "caps": "Triangles",
        "crosses": "Croix",
        "wave": "Vagues",
        "forest2": "Arbres",
      },
      type: "pattern"
    });

    this.addInput({
      label: 'Couleur',
      property: 'fill-color',
      input: new InputColor()
    });

    const inputFillSize = this.addInput({
      label: 'Taille',
      property: 'fill-pattern-scale',
      type: "number",
    });

    this.addBreak('fill-style');
    const inputFillColor = new InputColor();
    this.addInput({
      label: 'Fond',
      property: 'fill-pattern-color',
      input: inputFillColor
    });
    this.addBreak('fill-patern');

    /* Disable pattern options when no patter */
    inputPattern.input.addEventListener('change', e => {
      if (e.target.value) {
        inputFillColor.disable(false);
        inputFillSize.input.disabled = false;
      } else {
        inputFillColor.disable(true);
        inputFillSize.input.disabled = true;
      }
    });
  }

}

// Création du formulaire de style
const styleForm = new StyleForm();

export default styleForm;
export { StyleForm };