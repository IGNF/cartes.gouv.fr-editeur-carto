import { Dialog } from 'geopf-extensions-openlayers';
import StyleForm from './styleForm';


// Création du formulaire de style
const styleForm = new StyleForm();
styleForm.addInput('Forme', 'point-form', 'select', {
  none: 'sans',
  marker: 'Marqueur',
  circle: 'Cercle',
  square: 'Carré',
  triangle: 'Triangle',
  blazon: 'Blason'
});
styleForm.addInput('Couleur', 'point-color', 'color');
styleForm.addInput('Taille', 'point-radius', 'number');

styleForm.addBreak('point-form');

styleForm.addInput('Bordure', 'point-stroke-color', 'color');
styleForm.addInput('Taille', 'point-stroke-width', 'number');

styleForm.addBreak('point-stroke');

styleForm.addInput('Symbole', 'point-glyph', 'select', {
  'std-circle': 'cercle',
  'ign-commerce-cafe': 'Café',
  'ign-loisir-theatre': 'Théatre',
  'ign-sport-marche': 'Marche',
  'ign-service-handicap' : 'Handicape'
});
styleForm.addInput('Couleur', 'point-symbol-color', 'color');

styleForm.addBreak('point-symbol');

styleForm.addInput('Intérieur', 'fill-color', 'color');

styleForm.addBreak('fill-style');

styleForm.addInput('Ligne', 'stroke-color', 'color');
styleForm.addInput('Taille', 'stroke-width', 'number');

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