import { Dialog } from 'geopf-extensions-openlayers';
import StyleForm from './styleForm';


// Création du formulaire de style
const styleForm = new StyleForm();
styleForm.addInput('Couleur', 'strokeColor', 'color');
styleForm.addInput('Taille', 'strokeWidth', 'number');

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