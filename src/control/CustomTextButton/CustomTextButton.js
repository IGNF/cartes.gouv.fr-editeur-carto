// import OpenLayers control base and GeoPF utils
import TextButton from 'ol-ext/control/TextButton'
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

import './CustomTextButton.scss'

const logger = Logger.getLogger("CustomTextButton");

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
    options = options || {};
    options.className = options.className + ' ol-custom-text-button' 

    super(options);

    // Ajoute des options supplémentaires au bouton
    if (options.textClasses) {
      options.textClasses = options.textClasses instanceof Array ? options.textClasses : [options.textClasses];
      this.button_.classList.add(...options.textClasses);
    }

    // Ajoute des attributs supplémentaires au bouton
    options.textAttributes = options.textAttributes ? options.textAttributes : {};
    for (let attr in options.textAttributes) {
      this.button_.setAttribute(attr, options.textAttributes[attr]);
    }
  }
}

Object.assign(CustomTextButton.prototype, Widget);

export default CustomTextButton;

// Expose CustomTextButton as ol.control.CustomTextButton (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomTextButton = CustomTextButton;
}