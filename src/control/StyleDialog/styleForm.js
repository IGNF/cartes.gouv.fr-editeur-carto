/**
 * @file Formulaire pour le style d'un objet
 */

import { StyleEvent } from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import ExtendedFlatStyleForm from './ExtendedFlatStyleForm.js';
import InputColor from './InputColor.js';
import SelectIcons from './SelectIcons.js';
import { getControlLabels } from '../../i18n/controlLabels';

/**
 * @typedef {Object} StyleFormOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [preview = false] Si vrai, affiche la preview. L'affichage de la preview est contrôlé par la méthode `showPreview(bool)`. 
 * @property {Boolean} [selectGeomType = false] Si vrai, affiche le sélecteur pour changer le type d'objet à modifier. L'affichage de la sélection est contrôlé par la méthode `showSelectGeomType(bool)`.
 * @property {Object<string, *>} [labels] Libellés traduits transmis au formulaire.
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
   * @param {Feature|Array<Feature>|import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} featureOrGeomName Feature ou type de géométrie
   * @override
  */
  setGeom(featureOrGeomName) {
    super.setGeom(featureOrGeomName);
    //
    if (this.isSelectGeomTypeShown()) {
      // Modifie l'option sélectionné seulement si on affiche le sélecteur
      const select = this.selectGeomType.querySelectorAll('input[type="radio"');
      select.forEach(input => {
        input.checked = this.getGeom().includes(input.value);
      });
    }
    const type = this.getGeom()?.split(' ').at(0);
    if (this.styleObj.get('type') !== type) {
      this.styleObj.set('type', type);
    }

    // Affiche les éléments correspondant aux surfaces
    // (style par défaut seulement)
    const strokeElements = this.getContent().querySelectorAll("[data-property^=stroke-]");
    const fillStrokeElements = this.getContent().querySelectorAll("[data-property^=fill-stroke-]");
    // Style par défaut : on affiche les inputs "fill-stroke..."
    if ((this.styleObj.isDefault || this.styleObj?.showGeom) && this.getGeom()?.split(' ').includes("Polygon")) {
      strokeElements.forEach(elem => elem.classList.add("fr-hidden"));
      fillStrokeElements.forEach(elem => elem.classList.remove("fr-hidden"));
    } else {
      // Sinon, affichage normal
      strokeElements.forEach(elem => elem.classList.remove("fr-hidden"));
      fillStrokeElements.forEach(elem => elem.classList.add("fr-hidden"));
    }

    this.updatePreview();
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @param {StyleFormOptions} options Options du constructeur
   * @abstract
   * @protected
   */
  _addCustomInputs(options) {
    this.setTitle(this.labels.properties ?? 'Propriétés');
    this._addLabelInfo(this.labels.symbol ?? 'Symbole');
    this._addPointInputs(options);
    this._addLineStringInputs(options);
    this._addPolygonInputs(options);
    // label
    this._addLabelInfo(this.labels.text ?? 'Texte');
    this._addLabelInputs();
    if (options.generalType === false) {
      this._addLabelInputs("Point");
      this._addLabelInputs("LineString");
      this._addLabelInputs("Polygon");
    }
  }


  /**
   * Méthode ajoutant un label d'information dans le formulaire.
   * @private
   */
  _addLabelInfo(title) {
    const span = document.createElement('span');
    span.innerText = title;
    span.className = 'fr-hint-text';
    this.element.appendChild(span);
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `Point`
   * @private
   */
  _addPointInputs() {
    this.addInput({
      label: this.labels.shape ?? 'Forme',
      property: 'point-form',
      type: "form",
      options: this.labels.shapes ?? {
        none: 'Sans',
        marker: 'Marqueur',
        circle: 'Cercle',
        square: 'Carré',
        triangle: 'Triangle',
      }
    });

    this.addInput({
      label: this.labels.color ?? 'Couleur',
      property: 'point-color',
      input: new InputColor({ labels: this.labels }),
    });

    this.addInput({
      label: this.labels.size ?? 'Taille',
      labelInfo: '(px)',
      property: 'point-radius',
      type: "number",
    });

    this.addBreak('point-form');
    this.addInput({
      label: this.labels.border ?? 'Bordure',
      property: 'point-stroke-color',
      input: new InputColor({ labels: this.labels })
    });

    this.addInput({
      label: this.labels.size ?? 'Taille',
      labelInfo: '(px)',
      property: 'point-stroke-width',
      type: "number",
    });

    this.addBreak('point-stroke');

    const inputIcons = new SelectIcons({
      label: this.labels.symbol ?? 'Symbole',
      property: 'point-glyph',
      type: 'icon',
      fonts: ["remixicon"],
      noIconLabel: this.labels.noIcon,
    })
    this.addInput({
      property: 'point-glyph',
      input: inputIcons,
    });
    this.addInput({
      label: this.labels.color ?? 'Couleur',
      property: 'point-symbol-color',
      input: new InputColor({ labels: this.labels })
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
      label: this.labels.border ?? 'Bordure',
      property: 'stroke-line-dash',
      options: this.labels.dashes ?? {
        "": "Continue",
        "5,5": "Tiret",
        "0,5": "Pointillé",
        "10,5,0,5": "Tirets irréguliers",
      },
      type: "stroke",
    });
    this.addInput({
      label: this.labels.color ?? 'Couleur',
      property: 'stroke-color',
      input: new InputColor({ labels: this.labels })
    });
    this.addInput({
      label: this.labels.size ?? 'Taille',
      labelInfo: '(px)',
      property: 'stroke-width',
      type: "number",
    });

    this.addBreak('line-stroke');
    this.addInput({
      label: this.labels.start ?? 'Début',
      // disabled: true,
      property: 'line-arrow-start',
      options: this.labels.arrows ?? {
        "": "Simple",
        "triangle": "Flèche",
        "circle": "Rond",
        "square": "Carré",
      },
      type: "arrow",
    });

    this.addInput({
      label: this.labels.end ?? 'Fin',
      property: 'line-arrow-end',
      options: this.labels.arrows ?? {
        "": "Simple",
        "triangle": "Flèche",
        "circle": "Rond",
        "square": "Carré",
      },
      type: "arrow",
    });
    this.addBreak('line-arrow');
  }

  /**
   * Méthode ajoutant les inputs pour les géométries de type `Polygon`
   * @private
   */
  _addPolygonInputs() {
    // POLYGONE //
    this.addInput({
      label: this.labels.border ?? 'Bordure',
      property: 'fill-stroke-line-dash',
      options: this.labels.dashes ?? {
        "": "Continue",
        "5,5": "Tiret",
        "0,5": "Pointillé",
        "10,5,0,5": "Tirets irréguliers",
      },
      type: "stroke",
    });
    this.addInput({
      label: this.labels.color ?? 'Couleur',
      property: 'fill-stroke-color',
      input: new InputColor({ labels: this.labels })
    });
    this.addInput({
      label: this.labels.size ?? 'Taille',
      labelInfo: '(px)',
      property: 'fill-stroke-width',
      type: "number",
    });
    this.addBreak('fill-stroke');

    const inputPattern = this.addInput({
      label: this.labels.pattern ?? 'Motif',
      property: 'fill-pattern-config',
      options: this.labels.patterns ?? {
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
      label: this.labels.color ?? 'Couleur',
      property: 'fill-color',
      input: new InputColor({ labels: this.labels })
    });

    const inputFillSize = this.addInput({
      label: this.labels.size ?? 'Taille',
      property: 'fill-pattern-scale',
      type: "number",
    });

    this.addBreak('fill-style');
    const inputFillColor = new InputColor({ labels: this.labels });
    this.addInput({
      label: this.labels.background ?? 'Fond',
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
      label: this.labels.text ?? "Texte",
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
      label: this.labels.color ?? 'Couleur',
      property: `${prefix}text-fill-color`,
      input: new InputColor({ labels: this.labels })
    });

    this.addInput({
      label: this.labels.size ?? 'Taille',
      labelInfo: '(px)',
      property: `${prefix}text-size`,
      type: 'number',
    });

  }

  /**
   * Récupère le style flat du formulaire
   * @returns {Object} Objet représentant le flat style
   */
  getFormFlatStyle() {
    const current = this.styleObj.getFlatStyle();
    // Remove text properties
    Object.keys(current).forEach(key => {
      if (/text-/.test(key)) {
        delete current[key];
      }
    })
    return current;
  }

}

// Création du formulaire de style
const styleForm = new StyleForm({ hasreset: true, labels: getControlLabels() });

export default styleForm;
export { StyleForm };