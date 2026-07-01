import Action from "../Action.js";
import ol_ext_element from "ol-ext/util/element.js";
import PopupForm from "../../control/StyleDialog/popupForm.js";

import "./editLayerPopup.scss";

/**
 * Fonction à l'ouverture du dialog.
 *
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  const dialog = e.target;

  // Ajoute / modifie du contenu
  dialog.setDialogTitle(editLayerPopupAction.layer?.get('title'));

  // Initialise le formulaire
  if (!this.popupForm) {
    this.popupForm = new PopupForm();
    dialog.getDialogContent().innerHTML = "";
    this.popupForm.on("style", (e) => {
      this.popupForm.setPopupContent(editLayerPopupAction.layer, e.property, e.value);
    });
  }
  this.popupForm.setLayer(editLayerPopupAction.layer);
  const content = this.popupForm.getContent();
  dialog.getDialogContent().appendChild(content);
  content.querySelector("input").focus();
}

const editLayerPopupAction = new Action({
  id: "edit-layer-popup",
  content: ol_ext_element.create("div", {
    className: "edit-layer-poup-content",
  }),
  icon: "fr-icon-chat-quote-line",
  size: "md",
  onOpen: onOpen,
});

export default editLayerPopupAction;
