// import OpenLayers control base and GeoPF utils
import Bar from 'ol-ext/control/Bar'
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

import './CustomBar.scss'

const logger = Logger.getLogger("CustomBar");

/**
 * @classdesc
 * CustomBar – Extends ol-ext bar to create a button with the map name
 * Compatible with GeoPF control patterns (initialize / _initContainer split)
 * 
 * @constructor
 * @alias ol.control.CustomBar
 * @type {ol.control.CustomBar}
 * @param {Object}  options
 * @param {String} [options.id]               - custom id suffix
 * @param {Boolean}[options.collapsed=true]   - start collapsed (dialog closed)
 * @param {String} [options.title="Modal"]   - dialog title (aria‑label & heading)
 * @param {HTMLElement|String} [options.dialogElement] - initial dialog content
 * @param {String[]} [options.buttonClasses]  - extra classes on main button
 *
 * @extends {ol.control.Bar}
 */
class CustomBar extends Bar {
  constructor(options) {
    options = options || {};
    options.className = options.className + ' ol-custom-bar'

    super(options);
  }
}

Object.assign(CustomBar.prototype, Widget);

export default CustomBar;

// Expose CustomBar as ol.control.CustomBar (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomBar = CustomBar;
}