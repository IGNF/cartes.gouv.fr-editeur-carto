import Action from '../Action.js';
import content from './importCatalog.html?raw';
import carte from '../../carte.js';
import ol_ext_element from 'ol-ext/util/element';
import './importCatalog.scss';
import { htmlToNode } from '../../charte/utils.js';

function onOpen(e) {
  let dialog = importCatalogAction.getDialog();
}

const importCatalogAction = new Action({
  title: 'Catalogue de cartes',
  icon: 'fr-icon-ign-map-line',
  content: content,
  onOpen: onOpen
})

export default importCatalogAction;