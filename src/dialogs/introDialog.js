import Dialog from '../control/Dialog/Dialog'

const introDialog = new Dialog({
  id: 'ConnectDialog',
  dialogClass: 'intro-dialog',
  className: 'menu-info menu-connect',
  // html: Dialog.defaultHTML(), 
  parent: document.body.querySelector('main'),
});

export default introDialog