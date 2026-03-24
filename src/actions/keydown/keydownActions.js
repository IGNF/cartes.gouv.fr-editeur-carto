import Action from '../Action.js';
import modal from '../../dialogs/modal.js';

/** Handle keydown action
 * Open or save carte on Ctrl+S / Cmd+S and Ctrl+O / Cmd+O
 */
document.addEventListener('keydown', evt => {
  // Ignore if focused on input or dialog is open
  if (evt.target.tagName === "INPUT" 
      || evt.target.tagName === "TEXTAREA" 
      || evt.target.isContentEditable
      || document.querySelector('[data-fr-js-modal="true"]:open') !== null
      || document.querySelector("dialog:modal") !== null
  ) {
    return;
  }

  // handle Ctrl keys
  if ((evt.ctrlKey || evt.metaKey)) {
    switch (evt.key) {
      // save map with Ctrl+S / Cmd+S
      case 's': {
        evt.preventDefault();
        Action.open(modal.getId(), 'save-map');
        break;
      }
      // Open map with Ctrl+O / Cmd+O
      case 'o': {
        evt.preventDefault();
        Action.open(modal.getId(), 'open-map');
        break;
      }
      default: break;
    }
  }
});

