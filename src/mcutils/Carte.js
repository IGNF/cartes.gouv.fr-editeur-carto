import Carte from 'mcutils/Carte';
import {
  GeoportalZoom,
  SearchEngine,
} from 'geopf-extensions-openlayers';
import switcher from './layerSwitcher';
import Layer from 'ol/layer/Layer.js';

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

    // Remove ScaleLine from canvas
    this.getControl('scaleLine').element.style.visibility = ''
    this.getMap().render();
    const self = this;

    this.selectedLayer = null;

    // Remove controls      
    const keyToExcludes = [
      'dialog',
      'title',
      'mousePosition',
      'permalink',
      'scaleLine',
      'ctrlbar',
      'printDlg'
      // 'layerSwitcher',
      // 'legend',
      // 'attribution',
    ]
    // Remove existing controls
    for (const key in this._controls) {
      const ctrl = this._controls[key];
      if (!keyToExcludes.includes(key)) {
        this.map.removeControl(ctrl);
        delete this._controls[key];
      }
    }
    // Set GPP controls
    const controls = {
      layerSwitcher: switcher,
      search: new SearchEngine({
        collapsed: true,
        collapsible: true,
        position: 'center'
      }),
      zoom: new GeoportalZoom({
        position: 'bottom-right'
      })
    }

    // Add GPP controls
    Object.keys(controls).forEach(key => {
      try {
        this.addControl(key, controls[key])
      } catch (error) {
        console.error(error)
      }
    });
  }

  /** Add a new control
   * @param {string} name
   */
  addControl = function (controlName, control) {
    if (!this._controls[controlName]) {
      this._controls[controlName] = control;
      this.map.addControl(control);
    } else {
      throw new Error('Un contrôle du même nom existe déjà');
    }
  }

  /** Carte is ready
   */
  setReady = () => {
    Carte.prototype.setReady.call(this);
    // Remove ScaleLine from canvas
    this.getControl('scaleLine').element.style.visibility = ''
    this.getMap().render()
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
}

export default GPPCarte