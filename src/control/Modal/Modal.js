import Utils from "geopf-extensions-openlayers/src/packages/Utils/Helper.js";

import contentHTML from './modal.html?raw';
import Dialog from '../Dialog/AbstractDialog.js';

class Modal extends Dialog {
  constructor(options) {
    super(options)
  }


  /**
   * Initie les sélecteurs CSS utiles dans le reste
   */
  initialize() {
    this.dialogClass = 'main-modal'

    super.initialize()

    // Override les valeurs initials
    let options = {
      className: this.dialogClass + ' fr-modal',
      'aria-labelledby': 'main-modal__title',
      html: contentHTML,
    }

    Utils.assign(this.options, options);


    this.selectors.FOOTER = '.fr-modal__footer';
    // this.selectors.OPEN_EVENT = 'dsfr.disclose';
    // this.selectors.CLOSE_EVENT = 'dsfr.conceal';
  }

  addButton(button) {
    super.addButton(button);
    // Enlève la classe 'fr-hidden' sur le footer au besoin
    const footer = this.querySelector(this.selectors.FOOTER)
    if (button) {
      footer.classList.remove('fr-hidden')
    } else {
      footer.classList.add('fr-hidden')
    }
  }

  /**
   * @param {Dialog} dialog 
   * @override
   */
  _close(dialog) {
    // Laisse le DSFR gérer la fermeture de la modale
    dialog.closeBtn.click();
  }


  /**
   * @override
   */
  _open() {
    // Laisse le DSFR gérer l'ouverture de la modale
  }


  /**
   * Ajoute ou remplace la fonction lancée à l'ouverture
   * du dialog.
   * 
   * @param {function(Modal)} onOpen Fonction à l'ouverture du dialog.
   */
  setOnOpen(onOpen) {
    super.setOnOpen(onOpen);

    // Vérifie si la modale était ouverte (elle s'ouvre avant
    // si openAction est ajouté à la création du bouton.
    // Sinon elle s'ouvre après)
    let dsfr = window.dsfr;
    if (typeof dsfr === 'function') {
      let modal = dsfr(this.getDialog()).modal
      if (modal && modal.isDisclosed) {
        // Envoie un événement pour l'ouverture du dialog
        this.dispatchEvent({
          type: this.selectors.OPEN_EVENT
        })
      }
    }
  }
}

export default Modal;
