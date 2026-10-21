import Action from '../../actions/Action.js';
import content from './symbolLib.html?raw';
import getUid from '../../utils/getUid.js';
import element from 'ol-ext/util/element.js';
import Sortable from "sortablejs";
import SymbolLib from 'mcutils/style/SymbolLib.js';
import { flatToIgnStyle, ignStyleToFlatStyle } from "../../control/StyleDialog/styleToFlatStyle.js";
import EditStyle from "../../control/LayerStyle/EditStyle.js";
import StyleObj from '../../control/LayerStyle/StyleObj.js';
import { defaultIgnStyle } from 'mcutils/style/ignStyleFn.js';

import carte from '../../carte.js';
import i18next from '../../i18n/index';
import { translateHtml } from '../../i18n/translateHtml';
import { getControlLabels } from '../../i18n/controlLabels';

import './symbolLib.scss';
import symbolLibHTML from './symbolLib.html?raw';
import symbolLibItem from './symbolLibItem.html?raw';

let sortable = null;


class SymbolLibAction extends Action {
  constructor(options = {}) {
    options.onOpen = () => {
      // Display title
      const dlog = this.getDialog();
      const header = dlog.querySelector('.fr-modal__header');
      const btn = header.querySelector('.main-modal__close-btn');
      btn.innerText = '';
      if (!header.querySelector('.fr-icon-book-open-line')) {
        const icon = document.createElement('span');
        icon.className = 'fr-icon fr-icon--sm fr-icon-book-open-line';
        header.insertBefore(icon, btn);
        header.insertBefore(dlog.querySelector('.fr-modal__title'), btn);
      }
      // Affichage des symboles disponibles
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
        labels: getControlLabels(),
      });
      // Color picker popup is moved to the dialog
      this.popup = [];
      this.editStyle.element.querySelectorAll('[id^="color-picker-popup-"]').forEach(el => {
        this.popup.push(el);
      });
      this.editStyle.element.querySelectorAll('.style-popup div[id^="style-popup-"]').forEach(el => {
        this.popup.push(el);
      });
      // 
      this.editStyle.on('rollback-style', () => {
        this.setSymbols();
      });
      this.editStyle.on('apply-style', (e) => {
        const style = this.editStyle.styleForm.styleObj.getFlatStyle();
        const style2 = this.editStyle.labelForm.styleObj.getFlatStyle();
        Object.keys(style2).forEach((key) => {
          if (!style[key]) style[key] = style2[key];
        });
        const ignStyle = flatToIgnStyle(style, e.styleObj.get('type'));
        console.log('Applying style:', style);
        if (this.editStyle.item) {
          this.editStyle.item._type = e.styleObj.get('type');
          this.editStyle.item.setIgnStyle(ignStyle);
          this.editStyle.item.set('name', e.styleObj.get('name'));
          this.setSymbols();
        } else {
          // Add new symbol to the library
          this.addSymbol(new SymbolLib({
            type: e.styleObj.get('type'),
            name: e.styleObj.get('name'),
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
        name: options.styleObj.get('name'),
        style: flatToIgnStyle(options.styleObj.getFlatStyle())
      });
      this.symbolLib.push(currentSymbol);
      // Focus on the new symbol to edit its name
      this.editLastItem(false);
    }
    // Open action
    Action.open(dialog, this.id);
  }
  /** Edit the last item in the library (to edit its name)
   */
  editLastItem(edit=false) {
    setTimeout(() => {
      const parent = this.getDialog().getDialogContent().parentNode.parentNode;
      parent.scrollTop = parent.scrollHeight;
      if (edit) {
        this.getDialog().getDialogContent().querySelector('.symbol-lib-item-list .symbol-lib-item:last-child .edit-symbol-lib-name-btn').click();
      } else {
        this.getDialog().getDialogContent().querySelector('.symbol-lib-item-list .symbol-lib-item:last-child').click();
      }
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
    ['.applySymbol', '.duplicateSymbol'].forEach(i => {
      const btn = modal.getDialog().querySelector(i);
      if (btn) {
        btn.disabled = item ? false : true;
      }
    })
  }

  /** Add a symbol to the library
   * @param {SymbolLib} symbol - symbol to add
   */
  addSymbol(symbol) {
    const currentSymbol = new SymbolLib({
      type: symbol.getType(),
      name: symbol.get('name'),
      style: symbol.getIgnStyle()
    });
    this.symbolLib.push(currentSymbol);
    this.setSymbols();
    // Focus on the new symbol to edit its name
    this.editLastItem(false);
  }

  /** Afficher les symboles disponibles dans la bibliothèque
   * @param {string} [filter] geometry type to filter the symbols by (e.g., 'Point', 'LineString', 'Polygon')
   */
  setSymbols(filter='all') {
    const modal = symbolLibAction.getDialog();
    modal.getDialogContent().innerHTML = translateHtml(symbolLibHTML).replace(/-ID/g, '-' + this.uid);
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
      if (filter !== 'all' && item.getType() !== filter) return;
      // Filter by geometry type
      if (this.typeGeom && item.getType() !== this.typeGeom) return;
      // Create item element
      const prop = item.getProperties();
      const elt = element.create('div', {
        className: 'symbol-lib-item' + (prop.feature ? '' : ' symbol-lib-title'),
        'data-sortable-id': i,
        html: translateHtml(symbolLibItem).replace(/-ID/g, '-' + getUid()),
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
        elt.click();
        this.showEditStyle(item);
        e.stopPropagation();
      });
      // delete button
      elt.querySelector('.duplicate-symbol-lib-btn').addEventListener('click', (e) => {
        symbolLibAction.addSymbol(item)
        this.setSymbols();
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
        text: i18next.t(this.typeGeom ? 'actions:symbolLib.emptyForGeometry' : 'actions:symbolLib.empty'),
        parent: symbolList
      });
    }

    // Boutons d'action pour la bibliothèque de symboles
    const btns = modal.getDialogContent().querySelector('.symbol-lib-action-btns');
    // Ajouter un nouveau style
    const btnContainer = document.createElement('div');
    btnContainer.className = 'fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-md';
    btns.appendChild(btnContainer);
    const addBtn = document.createElement('button');
    addBtn.className = 'fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left fr-btn--tertiary-no-outline';
    addBtn.innerText = i18next.t('actions:symbolLib.add');
    addBtn.addEventListener('click', () => {
      this.editStyle.header.querySelector('button').textContent = i18next.t('actions:symbolLib.returnToStyles');
      symbolLibAction.showEditStyle();
    });
    btnContainer.appendChild(addBtn);

    // Type de geometrie
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'style-form__select-geom fr-fieldset';
    btns.appendChild(fieldset);
    const geomTypes = [
      { type: 'all', key: 'actions:symbolLib.all'},
      { type: 'Point', key: 'actions:symbolLib.points'},
      { type: 'LineString', key: 'actions:symbolLib.lines'},
      { type: 'Polygon', key: 'actions:symbolLib.surfaces'}
    ]
    const name = 'symbol-lib-geomType-' + getUid();
    geomTypes.forEach(gt => {
      const container = document.createElement('div');
      container.className = 'fr-fieldset__element';
      fieldset.appendChild(container);
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.checked = (gt.type === filter);
      input.id = name + '-' + gt.type;
      input.value = gt.type;
      input.addEventListener('change', () => {
        this.setSymbols(input.value);
      });
      container.appendChild(input);
      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.className = 'fr-label';
      // Permet de traduire
      label.innerText = i18next.t(gt.key);
      container.appendChild(label);
    });

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
      flatStyle: flatStyle,
      name: item ? item.get('name') : ''
    });
    styleObj.isDefault = true;
    styleObj.showGeom = !item && !this.typeGeom;
    console.log('Style object showGeom:', styleObj.showGeom);
    console.log('Showing edit style for item:', item, 'with styleObj:', styleObj);
    this.editStyle.element.querySelector('.apply-btn').innerText = item
      ? i18next.t('common:apply')
      : i18next.t('actions:symbolLib.add');
    this.editStyle.setStyleObj(styleObj);
    this.editStyle.item = item;
    this.editStyle.setVisible(true);
    // Hide or show the geometry selection based on the style object's showGeom property
    modal.getDialog().dataset.edit = '';
    if (!styleObj.showGeom) {
      modal.getDialogContent().querySelector('.symbol-lib-item-form .style-form__select-geom').classList.add('fr-hidden');
    } else {
      modal.getDialogContent().querySelector('.symbol-lib-item-form .style-form__select-geom').classList.remove('fr-hidden');
    }
    modal.getDialogContent().querySelector('.style-name').disabled = false;
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
  title: i18next.t('actions:symbolLib.title'),
  content: content,
/*
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
*/
});


export default symbolLibAction;