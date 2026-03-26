import Carte from 'mcutils/Carte.js';
import {
  GeoportalZoom,
  SelectingInteraction,
} from 'geopf-extensions-openlayers/src/index.js';
import SelectMultiple from 'mcutils/ol/SelectMultiple.js';
import {gpfStyleFn, gpfShownStyleFn} from './gpfStyleFn.js';
import './gpfStyleFn.js';

import CarteFormat from './CarteFormat.js';

/** GPP Carte overwrite Carte options / controls
 */
class GPPCarte extends Carte {
  /** Constructor
   * @param {*} options
   *  @param {string|Element} [options.target]
   *  @param {string} options.key GPP api key
   *  @param {string} options.url carte file url
   *  @param {string} options.id carte id
   */
  constructor(options) {
    super(options);

    // SelectInteraction overwrite
    SelectMultiple.prototype.clear = SelectingInteraction.prototype.clear;

    // Remove ScaleLine from canvas
    this.getControl('scaleLine').element.style.visibility = '';
    this.getMap().render();
    this.getSelect().multi_ = false;

    this.selectedLayer = null;

    /* Update style with blue points */
    this.getSelect().style_ = gpfStyleFn({
      features: this.getSelect().getFeatures(),
      // type: 'zoom',
      points: true
    }); 
    this.getSelect().shownStyle_ = gpfShownStyleFn({
      features: this.getSelect().getFeatures(),
      // type: 'zoom',
      points: true
    }); 

    // Remove controls
    const keyToExcludes = [
      'dialog',
      'title',
      'mousePosition',
      'permalink',
      'scaleLine',
      'ctrlbar',
      'printDlg',
      // 'layerSwitcher',
      'legend',
      'legendBt',
      // 'attribution',
    ];

    // Remove existing controls
    for (const key in this._controls) {
      if (!keyToExcludes.includes(key)) {
        this.removeControl(key)
      }
    }
    // Set GPP controls
    const controls = {
      zoom: new GeoportalZoom({
        position: 'bottom-right'
      })
    };

    // Add GPP controls
    Object.keys(controls).forEach(key => {
      try {
        this.addControl(key, controls[key]);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * Get Carte title
   * @param {boolean} noTitle if true, return empty string if no title is set (instead of "Carte sans titre")
   * @returns {string}
   */
  getTitle(noTitle=false) {
    let title = '';
    if (this.get('atlas')) {
      title = this.get('atlas').title;
    } else {
      title = this.get('title')
    }
    return title || (noTitle ? '' : 'Carte sans titre');
  }

  /** Add a new control
   * @param {string} name
   */
  addControl(controlName, control) {
    if (!this._controls[controlName]) {
      this._controls[controlName] = control;
      this.map.addControl(control);
    } else {
      throw new Error('Un contrôle du même nom existe déjà');
    }
  }

  /**
   * Remove an existing control
   * @param {string} controlName name of the control
   */
  removeControl(controlName) {
    const ctrl = this._controls[controlName];
    if (ctrl) {
      this.map.removeControl(ctrl);
      delete this._controls[controlName];
    } else {
      console.warn(`Aucun contrôle avec le nom "${controlName}" existe`);
    }
  }

  /** Carte is ready
   */
  setReady() {
    Carte.prototype.setReady.call(this);
    // Remove ScaleLine from canvas
    this.getControl('scaleLine').element.style.visibility = '';
    this.getMap().render();
    this.getControl('zoom').element.style.position = 'absolute';
  }

  /**
   * 
   * @param {import("ol/layer").Layer} layer 
   * @param {boolean} zoom
   */
  addLayer(layer, zoom = true) {
    // const layers = this.getMap().getLayers();
    // layers.insertAt(layers.getLength(), layer);
    let map = this.getMap();
    map.addLayer(layer);

    if (zoom && map.getView() && map.getSize() && layer.getExtent) {
      let extent = layer.getExtent();
      if (!extent) {
        let source = layer.getSource();
        if (source && source.getExtent) {
          extent = source.getExtent();
        } else {
          extent = source.getTileGrid().getExtent();
        }
      }
      if (extent && extent[0] !== Infinity) {
        map.getView().fit(extent, {
          size: map.getSize(),
          minResolution: 10,
          duration: 1000,
        });
      }
    }
  }

  /** Write
   * @param {boolean} uncompressed
   * @returns {Object} json object
   */
  write(uncompressed) {
    const format = new CarteFormat;
    return format.write(this, uncompressed);
  }

  /** Read the carte (using CarteFormat)
   * @param {string|*} options carte url or carte options object
   * @param {AtlasDef} [atlas={}]
   */
  read(options, atlas) {
    if (typeof(options) === 'string') {
      fetch(options)
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          this.read(json, atlas);
        })
        .catch(e => {
          this.dispatchEvent(e);
        });

      return;
    }

    // Start reading
    this.dispatchEvent({ type: 'read:start' });

    // set atlas definition
    this.set('atlas', atlas || {});
    
    // Read carte
    const format = new CarteFormat;
    format.read(this, options);
    // The title
    this._controls.title.setTitle(this.map.get('title'));

    // Ready
    this.setReady();
    this.dispatchEvent({
      type: 'read'
    });
  };
}

export default GPPCarte