/**
 * @file Formulaire pour l'étiquette d'un objet
 */

import FlatStyleForm from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import InputColor from './InputColor.js';
import BaseEvent from 'ol/events/Event.js';

// Création du formulaire de style
const labelForm = new FlatStyleForm();

const label = labelForm.addInput({
  label: "Texte",
  property: "text-value",
  type: "textarea"
});
// Update label value on keyup with a delay to avoid too many updates
let tout, value = label.value;
label.addEventListener('keyup', () => {
  if (label.value === value) return;
  clearTimeout(tout);
  tout = setTimeout(() => {
    labelForm.dispatchEvent(new BaseEvent({ type: 'style', property: 'text-value', value: label.value }));
    value = label.value;
  }, 300);
});
label.addEventListener('change', () => {
  clearTimeout(tout);
});

// break
labelForm.addBreak("text");

// Couleur et taille du texte
labelForm.addInput({
  label: 'Couleur',
  property: 'text-fill-color',
  input: new InputColor()
});

labelForm.addInput({
  label: 'Taille',
  labelInfo: '(px)',
  property: 'text-size',
  type: 'number',
});

export default labelForm;