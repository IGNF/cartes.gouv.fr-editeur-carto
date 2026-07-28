import Action from '../../actions/Action.js';
import content from './symbolLib.html?raw';
import getUid from '../../utils/getUid.js';
import Collection from 'ol/Collection.js';
import element from 'ol-ext/util/element.js';
import Legend from 'ol-ext/legend/Legend.js';
import Sortable from "sortablejs";

import carte from '../../carte.js';

import './symbolLib.scss';
import symbolLibHTML from './symbolLib.html?raw';
import symbolLibItem from './symbolLibItem.html?raw';

let sortable = null;

/** Bibliotheque de symbole
 */
const symbolLibAction = new Action({
  id: 'symbolLib',
  title: 'Bibliothèque de symboles',
  content: content,
  buttons: [{
    label: 'Editer',
    kind: 1,
    // 'data-action': 'editStyle',
    // 'aria-controls': introDialog.getId(),
    callback: (e) => {
      // TODO : ouvrir la bibliothèque de symboles
      console.log("TODO : ouvrir l'editeur de styles");
    }
  }, {
    label: 'Appliquer',
    className: 'applySymbol',
    kind: 1,
    close: true,
    callback: (e) => {
      console.log("TODO : appliquer le symbole sélectionné");
    }
  }],
  onOpen: function(e) {
    // Affichage des symboles disponibles
    setSymbols(carte.getSymbolLib());
  },
});

/** Afficher les symboles disponibles dans la bibliothèque
 * 
 * @param {Collection} symbols 
 */
function setSymbols(symbolLib) {
  const modal = symbolLibAction.getDialog();
  modal.getDialogContent().innerHTML = symbolLibHTML.replace(/-ID/g, '-' + getUid());
  const symbolList = modal.getDialogContent().querySelector('.symbol-lib-item-list');
  // Sortable
  if (sortable) {
    sortable.destroy();
  }
  sortable = Sortable.create(symbolList, {
    handle: ".drag-btn",
    draggable: ".symbol-lib-item",
    filter: ".not-draggable",
    animation: 200,
    // Call event function on drag and drop
    onEnd: (e) => {
      if (e.oldIndex === e.newIndex) return;
      const item = symbolLib.removeAt(e.oldIndex);
      symbolLib.insertAt(e.newIndex, item);
      symbolList.querySelectorAll('.symbol-lib-item').forEach((elt, i) => {
        elt.dataset.sortableId = i;
      });
    }
  });
  // Items
  symbolLib.forEach((item, i) => {
    const prop = item.getProperties();
    const elt = element.create('div', {
      className: 'symbol-lib-item' + (prop.feature ? '' : ' symbol-lib-title'),
      'data-sortable-id': i,
      html: symbolLibItem.replace(/-ID/g, '-' + getUid()),
      parent: symbolList
    });
    // Image de la légende
    const preview = elt.querySelector('.style-container__preview');
    preview.appendChild(item.getImage(true));
    // Title
    elt.querySelector('[data-attr="title"]').innerText = item.get('name') || '';
    // delete button
    elt.querySelector('.delete-symbol-lib-btn').addEventListener('click', (e) => {
      symbolLib.remove(item);
      setSymbols(symbolLib);
    });
    // edit button
    elt.querySelector('.symbol-lib-container__mask input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        elt.querySelector('.validate-symbol-lib-name-btn').click();
      }
      if (e.key === 'Escape') {
        elt.querySelector('.cancel-symbol-lib-name-btn').click();
      }
    });
    elt.querySelector('.edit-symbol-lib-name-btn').addEventListener('click', (e) => {
      elt.classList.add('edit');
      elt.querySelector('.symbol-lib-container__mask input').value = item.get('name') || '';
      elt.querySelector('.symbol-lib-container__mask input').focus();
    });
    elt.querySelector('.cancel-symbol-lib-name-btn').addEventListener('click', (e) => {
      elt.classList.remove('edit');
    });
    elt.querySelector('.validate-symbol-lib-name-btn').addEventListener('click', (e) => {
      elt.classList.remove('edit');
      item.set('name', elt.querySelector('.symbol-lib-container__mask input').value);
      elt.querySelector('[data-attr="title"]').innerText = item.get('name') || '';
    });
    // Boutons de déplacement
    elt.querySelectorAll('[data-direction]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const inc = btn.dataset.direction === 'up' ? -1 : 1;
        const oldIndex = parseInt(elt.dataset.sortableId);
        const newIndex = oldIndex + inc;
        if (newIndex < 0 || newIndex >= symbolLib.getLength()) return;
        const item = symbolLib.removeAt(oldIndex);
        symbolLib.insertAt(newIndex, item);
        setSymbols(symbolLib);
        // focus on bouton déplacé
        setTimeout(() => {
          modal.getDialogContent().querySelectorAll('.symbol-lib-item')[newIndex].querySelector('[data-direction="'+btn.dataset.direction+'"]').focus(); 
        });
      });
    });
  });

}

export default symbolLibAction;