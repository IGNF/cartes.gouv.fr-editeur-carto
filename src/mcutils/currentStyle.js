import { defaultIgnStyle } from 'mcutils/style/ignStyleFn.js';
import carte from "../carte.js";
import labelForm from '../control/StyleDialog/labelForm.js';
import styleForm from '../control/StyleDialog/styleForm.js';
import { flatToIGNKeyValue } from '../control/StyleDialog/styleToFlatStyle.js';

let currentStyle = {};

Object.entries(defaultIgnStyle).forEach(([key, value]) => {
  currentStyle[key] = value;
});

// Change le style courant à la sélection
carte.getSelect().on("select", () => {
  const features = carte.getSelect().getFeatures().getArray();
  if (features.length) {
    const newStyle = features[0].getIgnStyle?.();
    currentStyle = Object.assign(currentStyle, newStyle);
  }
})

// Le change aussi à la modification du formulaire
const styles = [labelForm, styleForm];
styles.forEach(form => {
  form.on("style", (e) => {
    // Live change
    if (e.property) {
      const { key, value } = flatToIGNKeyValue(e.property, e.value);
      currentStyle[key] = value;
    }
  })
})

/**
 * Retourne une copie du style courant
 * @returns {Object} Copie du style courant
 */
function getCurrentStyle() {
  return Object.assign({}, currentStyle);
}

export default getCurrentStyle;
