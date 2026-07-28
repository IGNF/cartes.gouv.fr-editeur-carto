import getUid from '../utils/getUid.js';
import Modal from '../control/Modal/Modal.js'

const styleLibDialog = new Modal({
  id: getUid('style-lib-modal'),
  parent: document.body.querySelector('main'),
});

styleLibDialog.dialog.dataset.frConcealingBackdrop = false;

export default styleLibDialog;