import Dialog from '../control/Dialog/Dialog.js'

const introDialog = new Dialog({
  id: 'ConnectDialog',
  dialogClass: 'intro-dialog',
  className: 'menu-info menu-connect',
  parent: document.body.querySelector('main'),
});

export default introDialog