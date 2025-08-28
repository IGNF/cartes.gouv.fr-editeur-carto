// import OpenLayers control base and GeoPF utils
import Button from 'ol-ext/control/Button.js';
// import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

// const logger = Logger.getLogger("CustomButton");

/**
 * @classdesc
 * CustomButton – Extends ol-ext button to create a button with the map name
 * Compatible with GeoPF control patterns (initialize / _initContainer split)
 * 
 * @constructor
 * @alias ol.control.CustomButton
 * @type {ol.control.CustomButton}
 * @param {Object}  [options] - 
 *  @param {String} [options.className] class of the control
 *  @param {String} [options.title] title of the control
 *  @param {String} [options.name] an optional name, default none
 *  @param {String} [options.html] html to insert in the control
 *  @param {function} [options.handleClick] callback when control is clicked (or use change:active event)
 *
 * @extends {ol.control.Button}
 */
class CustomButton extends Button {
  constructor(options) {
    super(options);

    this._options = options;
  }
}

export default CustomButton;

// Expose CustomButton as ol.control.CustomButton (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomButton = CustomButton;
}