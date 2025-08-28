// import OpenLayers control base and GeoPF utils
import TextButton from 'ol-ext/control/TextButton.js';
// import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

// const logger = Logger.getLogger("CustomTextButton");

/**
 * @classdesc
 * CustomTextButton – Extends ol-ext button to create a button with the map name
 * Compatible with GeoPF control patterns (initialize / _initContainer split)
 * 
 * @constructor
 * @alias ol.control.CustomTextButton
 * @type {ol.control.CustomTextButton}
 * @param {Object}  [options] - 
 *  @param {String} [options.className] class of the control
 *  @param {String} [options.title] title of the control
 *  @param {String} [options.name] an optional name, default none
 *  @param {String} [options.html] html to insert in the control
 *  @param {function} [options.handleClick] callback when control is clicked (or use change:active event)
 * @param {String[]} [options.textClasses]  - extra classes on main button
 *
 * @extends {ol.control.TextButton}
 */
class CustomTextButton extends TextButton {
  constructor(options) {
    super(options);

    this._options = options;
  }
}

export default CustomTextButton;

// Expose CustomTextButton as ol.control.CustomTextButton (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomTextButton = CustomTextButton;
}