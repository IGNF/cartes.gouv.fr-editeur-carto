import Action from '../../actions/Action.js';
import content from './symbolLib.html?raw';
import getUid from '../../utils/getUid.js';
import element from 'ol-ext/util/element.js';
import Sortable from "sortablejs";
import SymbolLib from 'mcutils/style/SymbolLib.js';
import { flatToIgnStyle, ignStyleToFlatStyle } from "../../control/StyleDialog/styleToFlatStyle.js";
import ExtendedFlatStyleForm from "../../control/StyleDialog/ExtendedFlatStyleForm.js";
import EditStyle from "../../control/LayerStyle/EditStyle.js";
import StyleObj from '../../control/LayerStyle/StyleObj.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { defaultIgnStyle } from 'mcutils/style/ignStyleFn.js';

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
   *  @param {Object} [options.styleObj] - style object to add to the library (default: none) 
   *  @param {Collection} [options.symbolLib] - symbol library to edit (default: carte.getSymbolLib())
   */
  open(dialog, options = {}) {
    // Initialize editStyle if not already done
    if (!this.editStyle) {
      this.editStyle = new EditStyle({
        visible: false,
        className: 'symbol-lib-edit-style',
      });
      // Color picker popup is moved to the dialog
      this.popup = this.editStyle.element.querySelectorAll('[id^="color-picker-popup-"]')
      // 
      this.editStyle.on('rollback-style', (e) => {
        this.setSymbols();
      });
      this.editStyle.on('apply-style', (e) => {
        const style = this.editStyle.styleForm.styleObj.getFlatStyle();
        const style2 = this.editStyle.labelForm.styleObj.getFlatStyle();
        Object.keys(style2).forEach((key) => {
          if (!style[key]) style[key] = style2[key];
        });
        const ignStyle = flatToIgnStyle(style, e.styleObj.get('type'));
        if (this.editStyle.item) {
          this.editStyle.item._type = e.styleObj.get('type');
          this.editStyle.item.setIgnStyle(ignStyle);
          this.setSymbols();
        } else {
          // Add new symbol to the library
          this.addSymbol(new SymbolLib({
            type: e.styleObj.get('type'),
            style: flatToIgnStyle(ignStyle, e.styleObj.get('type')),
          }));
        }
      });
    }
    // Set options
    this.typeGeom = options.typeGeom || this.styleObj?.get('type') || null;
    this.symbolLib = options.symbolLib || carte.getSymbolLib();
    this.selectedSymbol = null;
    this._onSelect = options.onSelect || null;
    // Add existing symbol to the library
    if (options.styleObj) {
      const currentSymbol = new SymbolLib({
        type: options.styleObj.get('type'),
        name: '',
        style: flatToIgnStyle(options.styleObj.getFlatStyle())
      });
      this.symbolLib.push(currentSymbol);
      // Focus on the new symbol to edit its name
      this.editLastItem();
    }
    // Open action
    Action.open(dialog, this.id);
  }
  /** Edit the last item in the library (to edit its name)
   */
  editLastItem() {
    setTimeout(() => {
      const parent = this.getDialog().getDialogContent().parentNode.parentNode;
      parent.scrollTop = parent.scrollHeight;
      this.getDialog().getDialogContent().querySelector('.symbol-lib-item-list .symbol-lib-item:last-child .edit-symbol-lib-name-btn').click();
    }, 100);
  }
  /** Select a symbol in the library
   * @param {HTMLElement} [elt] - element of the symbol to select
   * @param {SymbolLib} [item] - symbol to select
   */
  selectItem(elt, item) {
    const modal = symbolLibAction.getDialog();
    const symbolList = modal.getDialogContent().querySelector('.symbol-lib-item-list');
    symbolList.querySelectorAll('.symbol-lib-item').forEach(elt => elt.classList.remove('selected'));
    if (item) {
      this.selectedSymbol = item;
      elt.classList.add('selected');
    } else {
      this.selectedSymbol = null;
    }
    modal.getDialog().querySelector('.applySymbol').disabled = item ? false : true;
    modal.getDialog().querySelector('.duplicateSymbol').disabled = item ? false : true;
  }
  /** Add a symbol to the library
   * @param {SymbolLib} symbol - symbol to add
   */
  addSymbol(symbol) {
    const currentSymbol = new SymbolLib({
      type: symbol.getType(),
      name: '',
      style: symbol.getIgnStyle()
    });
    this.symbolLib.push(currentSymbol);
    this.setSymbols();
    // Focus on the new symbol to edit its name
    this.editLastItem();
  }
  /** Afficher les symboles disponibles dans la bibliothèque
   */
  setSymbols() {
    const modal = symbolLibAction.getDialog();
    modal.getDialogContent().innerHTML = symbolLibHTML.replace(/-ID/g, '-' + this.uid);
    delete modal.getDialog().dataset.edit;
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
    let hasSelection = false;
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
        click: () => this.selectItem(elt, item),
        on: {
          dblclick: () => {
            if (this._onSelect) {
              this.getDialog().close();
              this._onSelect(this.selectedSymbol);
            }
          }
        }
      });
      if (item === this.selectedSymbol) {
        this.selectItem(elt, item);
        hasSelection = true;
      }
      // Image de la légende
      const preview = elt.querySelector('.style-container__preview');
      preview.appendChild(item.getImage(true));
      // Title
      elt.querySelector('[data-attr="title"]').innerText = item.get('name') || '';
      // Open button
      elt.querySelector('.open-symbol-lib-btn').addEventListener('click', (e) => {
        this.showEditStyle(item);
        e.stopPropagation();
      });
      // delete button
      elt.querySelector('.delete-symbol-lib-btn').addEventListener('click', (e) => {
        symbolLib.remove(item);
        this.setSymbols();
        e.stopPropagation();
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
      elt.querySelector('.edit-symbol-lib-name-btn').addEventListener('click', () => {
        elt.classList.add('edit');
        elt.querySelector('.symbol-lib-container__mask input').value = item.get('name') || '';
        elt.querySelector('.symbol-lib-container__mask input').focus();
      });
      elt.querySelector('.cancel-symbol-lib-name-btn').addEventListener('click', () => {
        elt.classList.remove('edit');
      });
      elt.querySelector('.validate-symbol-lib-name-btn').addEventListener('click', () => {
        elt.classList.remove('edit');
        item.set('name', elt.querySelector('.symbol-lib-container__mask input').value);
        elt.querySelector('[data-attr="title"]').innerText = item.get('name') || '';
      });
      // Boutons de déplacement
      elt.querySelectorAll('[data-direction]').forEach(btn => {
        btn.addEventListener('click', () => {
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
    // No item selected
    if (!hasSelection) {
      this.selectItem();
    } 
    // Message si aucun symbole disponible
    if (symbolList.querySelectorAll('.symbol-lib-item').length === 0) {
      element.create('div', {
        className: 'fr-alert fr-alert--info fr-info--small',
        html: 'Aucun symbole disponible ' + (this.typeGeom ? 'pour le type de géométrie' : ''),
        parent: symbolList
      });
    }

    // Formulaire d'édition de style
    const formContainer = modal.getDialogContent().querySelector('.symbol-lib-item-form');
    formContainer.appendChild(this.editStyle.getElement());
    this.editStyle.setVisible(false);
  }
  /** Show the edit style form
   */
  showEditStyle(item) {
    const modal = symbolLibAction.getDialog();
    const typeGeom = item ? item.getType() : this.typeGeom || 'Point';
    const flatStyle = item ? ignStyleToFlatStyle(item.getIgnStyle(), typeGeom) : ignStyleToFlatStyle(defaultIgnStyle, 'Point');
    const styleObj = new StyleObj({
      type: typeGeom,
      flatStyle: flatStyle
    });
    console.log("styleObj", flatStyle, defaultIgnStyle);
    styleObj.isDefault = true;
    styleObj.showGeom = !item && !this.typeGeom;
    this.editStyle.element.querySelector('.apply-btn').innerText = item ? 'Appliquer' : 'Ajouter';
    this.editStyle.setStyleObj(styleObj);
    this.editStyle.item = item;
    this.editStyle.setVisible(true);
    modal.getDialog().dataset.edit = '';
    // Color picker popup is moved to the dialog to avoid being hidden by overflow:hidden
    let cpicker = modal.getDialog().querySelector('.dialog-colorpicker');
    if (!cpicker) {
      cpicker = element.create('div', {
        className: 'dialog-colorpicker ol-ext-colorpicker' + (window.EyeDropper ? ' eyedropper' : ''),
      });
      modal.getDialog().appendChild(cpicker);
      this.popup.forEach(p => {
        cpicker.appendChild(p);
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
    label: 'Ajouter',
    className: 'addSymbol',
    kind: 1,
    // 'data-action': 'editStyle',
    // 'aria-controls': introDialog.getId(),
    callback: () => {
      symbolLibAction.showEditStyle();
    }
  }, {
    label: 'Dupliquer',
    className: 'duplicateSymbol',
    kind: 1,
    callback: () => symbolLibAction.addSymbol(symbolLibAction.selectedSymbol)
  }, {
    label: 'Appliquer',
    className: 'applySymbol',
    kind: 1,
    close: true,
    callback: () => {
      if (symbolLibAction._onSelect && symbolLibAction.selectedSymbol) {
        symbolLibAction._onSelect(symbolLibAction.selectedSymbol);
      }
    }
  }]
});


export default symbolLibAction;