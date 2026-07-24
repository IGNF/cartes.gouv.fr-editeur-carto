import BaseObject from "ol/Object.js";
import element from 'ol-ext/util/element.js';
import Sortable from "sortablejs";
import Legend from 'ol-ext/legend/Legend.js';

import './legend.scss';
import html from './legend.html?raw';
import itemHtml from './legend-item.html?raw';

let id = 0;

/**
 * @classdesc
 * Gestionnaire de légende pour la storymap
 */
class LegendContainer extends BaseObject {
  /**
   * @param {*} options
   */
  constructor(options = {}) {
    super(options);
    this._story = options.story;

    this.content = element.create('form', {
      className: 'legend',
      html: html.replace(/-ID/g, '-' + id++),
      'aria-label': 'Configuration de la légende',
    });
    this.content.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // Gestion des événements (when ready)
    this.getItem('visible').addEventListener('change', (e) => {
      this.showLegend(e.target.checked);
    });
    this.getItem('title').addEventListener('input', (e) => {
      const legend = this._story.getCarte().getControl('legend').getLegend();
      legend.setTitle(e.target.value);
    });
    this.getItem('lineHeight').addEventListener('input', (e) => {
      const legend = this._story.getCarte().getControl('legend').getLegend();
      legend.set('lineHeight', parseInt(e.target.value));
    });
      
    this._legendList = this.content.querySelector('.legend-item-list');
    this._sortable = Sortable.create(this._legendList, {
      handle: ".drag-btn",
      draggable: ".legend-item",
      filter: ".not-draggable",
      animation: 200,
      // Call event function on drag and drop
      onEnd: (e) => {
        if (e.oldIndex === e.newIndex) return;
        const items = carte.getControl('legend').getLegend().getItems();
        const item = items.removeAt(e.oldIndex);
        items.insertAt(e.newIndex, item);
        this.content.querySelectorAll('.legend-item').forEach((elt, i) => {
          elt.dataset.sortableId = i;
        });
      }
    });

    // Add legend items
    this.content.querySelector('.add-item-btn').addEventListener('click', (e) => {
    });
    // Add legend title
    this.content.querySelector('.add-title-btn').addEventListener('click', (e) => {
      const legend = carte.getControl('legend').getLegend();
      legend.addItem({title: 'Titre de la section'});
      this.refreshList();
    });
  }

  /** Item correspondant à un attribut
   * @param {string} attr Attribut à récupérer
   * @returns {HTMLElement}
   */
  getItem(attr) {
    return this.content.querySelector('[data-attr="' + attr + '"]');
  }

  /** Afficher la légende et autoriser les modifications
   * @param {import("mcutils/StoryMap.js").default} story StoryMap à utiliser
   * @param {boolean} show Afficher la légende ou non
   */
  showLegend(show) {
    const carte = this._story.getCarte();
    // Show control on carte
    carte.showControl('legend', show);
    carte.getControl('legend').show();
    // Update form
    const checkbox = this.getItem("visible");
    checkbox.checked = show;
    // const showControls = checkbox.ariaControlsElements;
    const showControls = checkbox.getAttribute('aria-controls').split(' ');
    showControls.forEach((el, i) => {
      const element = document.getElementById(el);
      showControls[i] = element;
    });
    showControls.forEach(el => {
      el.disabled = !show;
    });
  }

  /**
   * Initialise les valeurs du formulaire depuis l'etat courant de la story.
   */
  initForm() {
    const carte = this._story.getCarte();
    this.showLegend(carte.hasControl('legend'));

    this.refreshList();
  }

  /** Refresh the legend list
   */
  refreshList() {
    const legend = carte.getControl('legend').getLegend();
    this.getItem('title').value = legend.getTitle() || '';
    this.getItem('lineHeight').value = legend.get('lineHeight') || '';

    this._legendList.innerHTML = '';
    legend.getItems().forEach((item, i) => {
      const prop = item.getProperties();
      const elt = element.create('div', {
        className: 'legend-item' + (prop.feature ? '' : ' legend-title'),
        'data-sortable-id': i,
        html: itemHtml.replace(/-ID/g, '-' + id++),
        parent: this._legendList
      });
      // Image de la légende
      const preview = elt.querySelector('.style-container__preview canvas');
      prop.size = [preview.width, preview.height];
      prop.margin = 0;
      Legend.getLegendImage(prop, preview);
      // Title
      const title = (item.get('title') || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/, '<br/>');
      elt.querySelector('[data-attr="title"]').innerHTML = title;
      // delete button
      elt.querySelector('.delete-legend-btn').addEventListener('click', (e) => {
        legend.getItems().removeAt(elt.dataset.sortableId);
        this.refreshList();
      });
      // edit button
      elt.querySelector('.edit-legend-name-btn').addEventListener('click', (e) => {
        elt.classList.add('edit');
        elt.querySelector('.legend-container__mask textarea').value = item.get('title') || '';
        elt.querySelector('.legend-container__mask textarea').focus();
      });
      elt.querySelector('.cancel-legend-name-btn').addEventListener('click', (e) => {
        elt.classList.remove('edit');
      });
      elt.querySelector('.validate-legend-name-btn').addEventListener('click', (e) => {
        elt.classList.remove('edit');
        item.setTitle(elt.querySelector('.legend-container__mask textarea').value);
        const title = (item.get('title') || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/, '<br/>');
        elt.querySelector('[data-attr="title"]').innerHTML = title;
      });
      // Boutons de déplacement
      elt.querySelectorAll('[data-direction]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const items = legend.getItems();
          const inc = btn.dataset.direction === 'up' ? -1 : 1;
          const oldIndex = parseInt(elt.dataset.sortableId);
          const newIndex = oldIndex + inc;
          if (newIndex < 0 || newIndex >= items.getLength()) return;
          const item = items.removeAt(oldIndex);
          items.insertAt(newIndex, item);
          this.refreshList();
          // focus on bouton déplacé
          setTimeout(() => {
            this._legendList.querySelectorAll('.legend-item')[newIndex].querySelector('[data-direction="'+btn.dataset.direction+'"]').focus(); 
          });
        });
      });
    });
  }
}

export default LegendContainer; 
