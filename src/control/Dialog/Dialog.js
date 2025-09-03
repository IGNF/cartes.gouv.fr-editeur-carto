import AbstractDialog from "./AbstractDialog.js";

import defaultHTML from './defaultDialog.html?raw';

/** @classdesc 
 * Un simple dialogue avec : une barre de titre un contenu et un footer vide
 */
class Dialog extends AbstractDialog {
  /**
   * @param {./DialogOptions} [dialogClass] 
   */
  constructor (options) {
    // Default options
    options = Object.assign(options || {})
    options.dialogClass = options.dialogClass || 'ign-dialog'
    options.parent = options.parent | document.body.querySelector('main') | document.body
    if (!options.html) {
      options.html = defaultHTML.replace(/CLASSNAME/g, options.dialogClass)
    }
    // Create
    super(options)
  }
}

export default Dialog