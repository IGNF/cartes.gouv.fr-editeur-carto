import FlatStyleForm from './FlatStyleForm.js';
import InputColor from './InputColor.js';

// Création du formulaire de style
const styleForm = new FlatStyleForm();

// POINT //

styleForm.addCustomSelect({
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

styleForm.addInput('Couleur', 'point-color', new InputColor());

styleForm.addCustomInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'point-radius',
});

styleForm.addBreak('point-form');
styleForm.addInput('Bordure', 'point-stroke-color', new InputColor());

styleForm.addCustomInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'point-stroke-width',
});

styleForm.addBreak('point-stroke');

styleForm.addCustomSelect({
  label: 'Symbole',
  property: 'point-glyph',
  type: 'icon',
  fonts: ["remixicon"],
});
styleForm.addInput('Couleur', 'point-symbol-color', new InputColor());
styleForm.addBreak('point-symbol');

// POLYGONE //

styleForm.addInput('Couleur', 'fill-color', new InputColor());
styleForm.addBreak('fill-style');

// const patternObject = new SelectPattern();
// patternObject.setFlatStyleForm(styleForm);

styleForm.addCustomSelect({
  label: 'Motif',
  property: 'fill-pattern-config',
  options: {
    "": "Rempli",
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
styleForm.addInput('Fond', 'fill-pattern-color', new InputColor());
styleForm.addCustomInput({
  label: 'Taille',
  property: 'fill-pattern-scale',
});
styleForm.addBreak('fill-patern');

// LIGNE / POLYGONE //

styleForm.addCustomSelect({
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
styleForm.addInput('Couleur', 'stroke-color', new InputColor());
styleForm.addCustomInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'stroke-width',
});

// LIGNE //

styleForm.addBreak('line-arrow');
styleForm.addCustomSelect({
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

styleForm.addCustomSelect({
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