import { getUid } from './charte/utils';
import Modal from './control/Modal/Modal'

const modal = new Modal({
  id: getUid('main-modal'),
});

export default modal;