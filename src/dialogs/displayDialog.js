import ol_ext_element from 'ol-ext/util/element.js';
import content from '../page/display/display.html?raw';

const displayDialog = ol_ext_element.create('dialog', {
  id: 'display-modal',
  className: 'fr-modal',
  'aria-labelledby': 'fr-theme-modal-title',
  html: content,
  parent: document.body.querySelector('main'),
})

export default displayDialog;