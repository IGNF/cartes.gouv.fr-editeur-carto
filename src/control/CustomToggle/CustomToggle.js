// import OpenLayers control base and GeoPF utils
import Toggle from 'ol-ext/control/Toggle'
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

const logger = Logger.getLogger("CustomToggle");

/**
 * @classdesc
 * CustomToggle – Extends ol-ext toggle to create a button with the map name
 * Compatible with GeoPF control patterns (initialize / _initContainer split)
 * 
 * @constructor
 * @alias ol.control.CustomToggle
 * @type {ol.control.CustomToggle}
 * @param {Object}  options
 * @param {String} [options.id]               - custom id suffix
 * @param {Boolean}[options.collapsed=true]   - start collapsed (dialog closed)
 * @param {String} [options.title="Modal"]   - dialog title (aria‑label & heading)
 * @param {HTMLElement|String} [options.dialogElement] - initial dialog content
 *
 * @extends {ol.control.Toggle}
 */
class CustomToggle extends Toggle {
  constructor(options) {
    super(options);

    this._options = options;
  }

  toggle() {
    super.toggle()
    this.button_.setAttribute('aria-pressed', this.getActive())
  }
}

Object.assign(CustomToggle.prototype, Widget);

export default CustomToggle;

// Expose CustomToggle as ol.control.CustomToggle (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomToggle = CustomToggle;
}