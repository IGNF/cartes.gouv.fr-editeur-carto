import Action from '../../actions/Action.js';
import content from './symbolLib.html?raw';
import getUid from '../../utils/getUid.js';
import Collection from 'ol/Collection.js';
import element from 'ol-ext/util/element.js';
import Legend from 'ol-ext/legend/Legend.js';
import Sortable from "sortablejs";
import SymbolLib from 'mcutils/style/SymbolLib.js';
import { flatToIgnStyle } from "../../control/StyleDialog/styleToFlatStyle.js";

import carte from '../../carte.js';

import './symbolLib.scss';
import symbolLibHTML from './symbolLib.html?raw';
import symbolLibItem from './symbolLibItem.html?raw';

let sortable = null;


class SymbolLibAction extends Action {
  constructor(options = {}) {
    // Affichage des symboles disponibles
    options.onOpen = (e) => {
      this.setSymbols();
    };
    super(options);
    this.uid = getUid();
  }
  /** Open in a dialog
   * @param {Dialog} dialog
   * @param {Object} options
   *  @param {string} [options.typeGeom] - type of geometry to filter symbols (default: all)
   *  @param {Object} [options.styleObj] - style object to edit 
   *  @param {Collection} [options.symbolLib] - symbol library to edit (default: carte.getSymbolLib())
   */
  open(dialog, options = {}) {
    this.styleObj = options.styleObj || null;
    this.typeGeom = options.typeGeom || this.styleObj?.get('type') || null;
    this.symbolLib = options.symbolLib || carte.getSymbolLib();
    this.selectedSymbol = null;
    this._onSelect = options.onSelect || null;
    // Open action
    Action.open(dialog, this.id);
  }
  /** Afficher les symboles disponibles dans la bibliothèque
   */
  setSymbols() {
    const modal = symbolLibAction.getDialog();
    modal.getDialogContent().innerHTML = symbolLibHTML.replace(/-ID/g, '-' + this.uid);
    // Add exisiting symbol to the library
    if (this.styleObj) {
      const addBtn = element.create('button', {
        type: 'button',
        className: 'fr-btn addCurrentSymbol fr-btn--secondary',
        parent: modal.getDialogContent().querySelector('.symbol-lib-action-btns'),
        click: (e) => {
          symbolLib.push(currentSymbol);
          this.styleObj = null;
          this.setSymbols();
          // Focus on the new symbol to edit its name
          setTimeout(() => {
            modal.getDialogContent().querySelector('.symbol-lib-item-list .symbol-lib-item:last-child .edit-symbol-lib-name-btn').click();
          });
        }
      });
      const currentSymbol = new SymbolLib({
        type: this.styleObj.type,
        name: '',
        style: flatToIgnStyle(this.styleObj.getFlatStyle())
      });
      addBtn.appendChild(currentSymbol.getImage(true));
      element.create('span', {
        html: 'Ajouter le symbole',
        parent: addBtn
      });
    }
    // Show symbols in the dialog
    const symbolLib = this.symbolLib;
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
      // Filter by geometry type
      if (this.typeGeom && item.getType() !== this.typeGeom) return;
      // Create item element
      const prop = item.getProperties();
      const elt = element.create('div', {
        className: 'symbol-lib-item' + (prop.feature ? '' : ' symbol-lib-title'),
        'data-sortable-id': i,
        html: symbolLibItem.replace(/-ID/g, '-' + getUid()),
        parent: symbolList,
        click: (e) => {
          this.selectedSymbol = item;
          symbolList.querySelectorAll('.symbol-lib-item').forEach(elt => elt.classList.remove('selected'));
          elt.classList.add('selected');
        },
        on: {
          dblclick: (e) => {
            if (this._onSelect) {
              this.getDialog().close();
              this._onSelect(this.selectedSymbol);
            }
          }
        }
      });
      if (item === this.selectedSymbol) {
        elt.classList.add('selected');
      }
      // Image de la légende
      const preview = elt.querySelector('.style-container__preview');
      preview.appendChild(item.getImage(true));
      // Title
      elt.querySelector('[data-attr="title"]').innerText = item.get('name') || '';
      // delete button
      elt.querySelector('.delete-symbol-lib-btn').addEventListener('click', (e) => {
        symbolLib.remove(item);
        this.setSymbols();
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
          this.setSymbols();
          // focus on bouton déplacé
          setTimeout(() => {
            modal.getDialogContent().querySelectorAll('.symbol-lib-item')[newIndex].querySelector('[data-direction="'+btn.dataset.direction+'"]').focus(); 
          });
        });
      });
    });
    // Message si aucun symbole disponible
    if (symbolList.querySelectorAll('.symbol-lib-item').length === 0) {
      element.create('div', {
        className: 'fr-alert fr-alert--info fr-info--small',
        html: 'Aucun symbole disponible ' + (this.typeGeom ? 'pour le type de géométrie' : ''),
        parent: symbolList
      });
    }
  }
}


/** Bibliotheque de symbole
 */
const symbolLibAction = new SymbolLibAction({
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
      if (symbolLibAction._onSelect && symbolLibAction.selectedSymbol) {
        symbolLibAction._onSelect(symbolLibAction.selectedSymbol);
      }
    }
  }]
});


export default symbolLibAction;