import Action from '../Action.js';
import content from './importFlow.html?raw';
import './importFlow.scss';
import carte from '../../carte.js';

function onOpen(e) {
  let dialog = importFlowAction.getDialog();
}

const importFlowAction = new Action({
  title: 'Importer un flux',
  icon: 'ri-global-line',
  onOpen: onOpen,
  content: content,
})

export default importFlowAction;