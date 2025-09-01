import Modal from './control/Modal/Modal.js'

const loginDialog = new Modal({
  id: 'login-modal',
  parent: document.body.querySelector('main'),
})

export default loginDialog;
