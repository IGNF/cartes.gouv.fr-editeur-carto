import getUid from './utils/getUid.js';
import Modal from './control/Modal/Modal.js'

const modal = new Modal({
  id: getUid('main-modal'),
});

export default modal;