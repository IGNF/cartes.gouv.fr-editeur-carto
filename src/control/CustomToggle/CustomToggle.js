// import OpenLayers control base and GeoPF utils
import Toggle from 'ol-ext/control/Toggle'
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

import './CustomToggle.scss'

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
 * @param {String[]} [options.buttonClasses]  - extra classes on main button
 *
 * @extends {ol.control.Toggle}
 */
class CustomToggle extends Toggle {
  constructor(options) {
    options = options || {};
    options.className = options.className + ' ol-custom-toggle'

    super(options);

    // Ajoute des options supplémentaires au bouton
    if (options.buttonClasses) {
      options.buttonClasses = options.buttonClasses instanceof Array ? options.buttonClasses : [options.buttonClasses];
      this.button_.classList.add(...options.buttonClasses);
    }
    // Ajoute des attributs supplémentaires au bouton
    options.buttonAttributes = options.buttonAttributes ? options.buttonAttributes : {};
    for (let attr in options.buttonAttributes) {
      this.button_.setAttribute(attr, options.buttonAttributes[attr]);
    }
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