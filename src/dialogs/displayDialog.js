import ol_ext_element from 'ol-ext/util/element.js';
import content from '../page/display/display.html?raw';

const resolvedContent = content.replaceAll('href="/icon/', `href="${import.meta.env.BASE_URL}icon/`);

const displayDialog = ol_ext_element.create('dialog', {
  id: 'display-modal',
  className: 'fr-modal',
  'aria-labelledby': 'fr-theme-modal-title',
  html: resolvedContent,
  parent: document.body.querySelector('main'),
})

export default displayDialog;