// import OpenLayers control base and GeoPF utils
import Button from 'ol-ext/control/Button'
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";

import './CustomButton.scss'

const logger = Logger.getLogger("CustomButton");

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
 * @param {String[]} [options.buttonClasses]  - extra classes on main button
 *
 * @extends {ol.control.Button}
 */
class CustomButton extends Button {
  constructor(options) {
    options = options || {};
    options.className = options.className + ' ol-custom-button'

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
}

Object.assign(CustomButton.prototype, Widget);

export default CustomButton;

// Expose CustomButton as ol.control.CustomButton (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.CustomButton = CustomButton;
}