import AbstractDialog from "./AbstractDialog";

import defaultHTML from './defaultDialog.html?raw';

class Dialog extends AbstractDialog {
  constructor (options) {
    options = Object.assign(options || {})
    options.dialogClass = options.dialogClass || 'ign-dialog'
    if (!options.html) {
      options.html = defaultHTML.replace(/CLASSNAME/g, options.dialogClass)
    }

    super(options)
  }
}

export default Dialog