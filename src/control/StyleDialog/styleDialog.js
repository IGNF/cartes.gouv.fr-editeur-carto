import { Dialog } from 'geopf-extensions-openlayers';
import StyleForm from './styleForm.js';
import InputColor from './InputColor.js';

// Création du formulaire de style
const styleForm = new StyleForm();

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
/* // Méthode temporaire
styleForm.addCustomSelect({
  label: 'Sélection',
  property: 'point-color',
  type: 'color',
  options: {
    "#ffcc33": "Jaune or",
    "#ffb03b": "Jaune orangé",
    "#ff7f00": "Orange",
    "#ff0000": "Rouge",
    "#ff8fc8": "Rose clair",
    "#ff24ff": "Magenta",
    "#2fde30": "Vert vif",
    "#97c005": "Vert anis",
    "#008900": "Vert foncé",
    "#00ff9a": "Vert menthe",
    "#12d8b6": "Turquoise",
    "#00ae91": "Vert sarcelle",
    "#00ffff": "Cyan",
    "#0a76f6": "Bleu",
    "#000091": "Bleu foncé",
    "#cc8bf9": "Violet clair",
    "#9a00ff": "Violet",
    "#bc6630": "Marron",
    "#ffffff": "Blanc",
    "#cdcdcd": "Gris clair",
    "#787878": "Gris",
    "#424242": "Gris foncé",
    "#000000": "Noir",
    "#00000000": "Sans couleur"
  }
});
*/
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

// Création du Dialog avec navigation tertiaire
const styleDialog = new Dialog({
  id: "style-dialog",
  title: "Dialog",
  position: "left",
  items: [
    {
      label: "Style",
      content: styleForm.getContent(),
      onOpen: (...args) => console.log(...args),
      title: "Configuration du style"
    },
    {
      label: "Texte",
      content: "<p>Onglet Texte</p>",
      title: "Configuration du texte"
    },
    {
      label: "Infobulle",
      content: "<p>Onglet Infobulle</p>",
      title: "Configuration de l'infobulle"
    },
    {
      label: "Attributs",
      content: "<p>Onglet Attributs</p>",
      title: "Configuration des attributs"
    }
  ],
  labelTabNav: "Navigation de configuration",

});

export default styleDialog;
export { styleForm };