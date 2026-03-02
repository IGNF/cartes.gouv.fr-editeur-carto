import FlatStyleForm from './FlatStyleForm.js';
import InputColor from './InputColor.js';

// Création du formulaire de style
const labelForm = new FlatStyleForm();

labelForm.addInput("Texte", "text-value", "textarea");

labelForm.addBreak("text");

labelForm.addInput('Couleur', 'text-fill-color', new InputColor());

labelForm.addCustomInput({
  label: 'Taille',
  labelInfo: '(pt)',
  property: 'text-size',
});

export default labelForm;