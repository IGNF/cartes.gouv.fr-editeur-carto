/**
 * @file Formulaire pour le style d'un objet
 */

import FlatStyleForm from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import InputColor from './InputColor.js';
import SelectIcons from './SelectIcons.js';

// Création du formulaire de style
const styleForm = new FlatStyleForm();

// POINT //
styleForm.addInput({
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

styleForm.addInput({
  label: 'Couleur',
  property: 'point-color',
  input: new InputColor(),
});

styleForm.addInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'point-radius',
  type: "number",
});

styleForm.addBreak('point-form');
styleForm.addInput({
  label: 'Bordure',
  property: 'point-stroke-color',
  input: new InputColor()
});

styleForm.addInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'point-stroke-width',
  type: "number",
});

styleForm.addBreak('point-stroke');

const inputIcons = new SelectIcons({
  label: 'Symbole',
  property: 'point-glyph',
  type: 'icon',
  fonts: ["remixicon"],
})
styleForm.addInput({
  property: 'point-glyph',
  input: inputIcons,
});
styleForm.addInput({
  label: 'Couleur',
  property: 'point-symbol-color',
  input: new InputColor()
});
styleForm.addBreak('point-symbol');

// POLYGONE //


// const patternObject = new SelectPattern();
// patternObject.setFlatStyleForm(styleForm);

const inputPattern = styleForm.addInput({
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

styleForm.addInput({
  label: 'Couleur',
  property: 'fill-color',
  input: new InputColor()
});

const inputFillSize = styleForm.addInput({
  label: 'Taille',
  property: 'fill-pattern-scale',
  type: "number",
});

styleForm.addBreak('fill-style');
const inputFillColor = new InputColor();
styleForm.addInput({
  label: 'Fond',
  property: 'fill-pattern-color',
  input: inputFillColor
});
styleForm.addBreak('fill-patern');

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


// LIGNE / POLYGONE //

styleForm.addInput({
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
styleForm.addInput({
  label: 'Couleur',
  property: 'stroke-color',
  input: new InputColor()
});
styleForm.addInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'stroke-width',
  type: "number",
});

// LIGNE //

styleForm.addBreak('line-arrow');
styleForm.addInput({
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

styleForm.addInput({
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

export default styleForm;