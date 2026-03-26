import Action from '../Action.js';
import modal from '../../dialogs/modal.js';

/** Handle keydown action
 * Open or save carte on Ctrl+S / Cmd+S and Ctrl+O / Cmd+O
 */
document.addEventListener('keydown', evt => {
  // Ignore if focused on input or modal is open
  /*
  const isInput = evt.target.tagName === "INPUT" 
    || evt.target.tagName === "TEXTAREA" 
    || evt.target.isContentEditable;
  */
  const isModalOpen = document.querySelector('[data-fr-js-modal="true"]:open') !== null
    || document.querySelector("dialog:modal") !== null;

  // handle Ctrl keys
  if ((evt.ctrlKey || evt.metaKey)) {
    switch (evt.key) {
      // save map with Ctrl+S / Cmd+S
      case 's': {
        evt.preventDefault();
        if (!isModalOpen) {
          Action.open(modal, 'save-map');
        }
        break;
      }
      // Open map with Ctrl+O / Cmd+O
      case 'o': {
        evt.preventDefault();
        if (!isModalOpen) {
          console.log('open map dialog', modal);
          Action.open(modal, 'open-map');
        }
        break;
      }
      default: break;
    }
  }
});

