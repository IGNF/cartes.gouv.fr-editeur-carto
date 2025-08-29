import ol_ext_element from 'ol-ext/util/element.js';

import contentHTML from './connect.html?raw';
import './connect.scss';

import loginDialog from '../../loginDialog.js';
import modal from '../../modal.js';
import openAction from '../../actions/actions.js';

const dialogConnect = ol_ext_element.create('DIALOG', {
  id: 'ConnectDialog',
  className: 'menu-info menu-connect',
  'aria-modal': false,
  html: contentHTML,
  parent: document.body
});

document.body.dataset.disconnected = '';

let button = dialogConnect.querySelector('.disconnected > *');
button.setAttribute('aria-controls', loginDialog.getId());
button.setAttribute('data-fr-opened', false);
button.addEventListener('click', openAction);

let viewMaps = dialogConnect.querySelector('[data-action="open-map"]');
viewMaps.setAttribute('aria-controls', modal.getId());
viewMaps.setAttribute('data-fr-opened', false);
viewMaps.addEventListener('click', openAction);

dialogConnect.querySelector('.disconnected > *').addEventListener('click', () => {
  delete document.body.dataset.disconnected;

  // dialogConnect.querySelector('.connected button.create').focus();
  // e.preventDefault();
  // e.stopPropagation();
});
dialogConnect.querySelectorAll('.connected > button').forEach(button => {
  button.addEventListener('click', () => {
    dialogConnect.close();
  })
});

dialogConnect.show();

/* DEBUG */
window.dialogConnect = dialogConnect;

export default dialogConnect;