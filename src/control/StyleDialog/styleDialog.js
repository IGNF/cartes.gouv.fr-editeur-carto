import { Dialog } from 'geopf-extensions-openlayers';
import StyleForm from './styleForm';
import InputColor from './InputColor.js';

// Création du formulaire de style
const styleForm = new StyleForm();
// styleForm.addInput('Forme', 'point-form', 'select', {
//   none: 'sans',
//   marker: 'Marqueur',
//   circle: 'Cercle',
//   square: 'Carré',
//   triangle: 'Triangle',
//   blazon: 'Blason'
// });


styleForm.addCustomSelect({
  label: 'Forme',
  property: 'point-form',
  options: {
    none: 'sans',
    marker: 'Marqueur',
    circle: 'Cercle',
    square: 'Carré',
    triangle: 'Triangle',
    blazon: 'Blason'
  }
});

// styleForm.addInput('Couleur', 'point-color', 'color');
/*
styleForm.addCustomSelect({
  label: 'Sélection',
  property: 'point-color',
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

// styleForm.addInput('Bordure', 'point-stroke-color', 'color');

styleForm.addCustomSelect({
  label: 'Bordure',
  property: 'point-stroke-color',
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
styleForm.addCustomInput({
  label: 'Taille',
  property: 'point-stroke-width',
});

styleForm.addBreak('point-stroke');

// styleForm.addInput('Symbole', 'point-glyph', 'select', {
//   'std-circle': 'cercle',
//   'ign-commerce-cafe': 'Café',
//   'ign-loisir-theatre': 'Théatre',
//   'ign-sport-marche': 'Marche',
//   'ign-service-handicap': 'Handicape'
// });;
styleForm.addCustomSelect({
  label: 'Symbole',
  property: 'point-glyph',
  options: {
  'std-circle': 'cercle',
  'ign-commerce-cafe': 'Café',
  'ign-loisir-theatre': 'Théatre',
  'ign-sport-marche': 'Marche',
  'ign-service-handicap': 'Handicape'
  }
});
// styleForm.addInput('Couleur', 'point-symbol-color', 'color');

styleForm.addCustomSelect({
  label: 'Couleur',
  property: 'point-symbol-color',
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
styleForm.addBreak('point-symbol');

// styleForm.addInput('Intérieur', 'fill-color', 'color');

styleForm.addCustomSelect({
  label: 'Intérieur',
  property: 'fill-color',
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

styleForm.addBreak('fill-style');

// styleForm.addInput('Ligne', 'stroke-color', 'color');

styleForm.addCustomSelect({
  label: 'Ligne',
  property: 'stroke-color',
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
styleForm.addCustomInput({
  label: 'Taille',
  property: 'stroke-width',
});

// styleForm.addDefaultInput({
//   label: 'Défaut',
//   property: 'point-test',
// });


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