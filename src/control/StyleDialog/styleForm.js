import Dialog from 'geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js';
import FlatStyleForm from './FlatStyleForm.js';
import InputColor from './InputColor.js';

// Création du formulaire de style
const styleForm = new FlatStyleForm();

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
  property: 'point-radius',
});

styleForm.addBreak('point-form');
styleForm.addInput('Couleur', 'point-stroke-color', new InputColor());

styleForm.addCustomInput({
  label: 'Taille',
  property: 'point-stroke-width',
});

styleForm.addBreak('point-stroke');

styleForm.addCustomSelect({
  label: 'Symbole',
  property: 'point-glyph',
  type: 'icon',
  fonts : ["remixicon"],
});
styleForm.addInput('Couleur', 'point-symbol-color', new InputColor());
styleForm.addBreak('point-symbol');

styleForm.addInput('Intérieur', 'fill-color', new InputColor());
styleForm.addBreak('fill-style');

styleForm.addInput('Ligne', 'stroke-color', new InputColor());
styleForm.addCustomSelect({
  label: 'Bordure',
  property: 'stroke-line-dash',
  options: {
    "": "Continue",
    "5,5": "Tiret",
    "0,5": "Pointillé",
    "10,5,0,5": "Tirets irréguliers",
  },
  type: "dash",
});
styleForm.addCustomInput({
  label: 'Taille',
  property: 'stroke-width',
});

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