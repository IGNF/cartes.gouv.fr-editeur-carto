import Action from "../Action.js";
import i18next from '../../i18n/index';
import { getControlLabels } from '../../i18n/controlLabels';
import ol_ext_element from "ol-ext/util/element.js";
import PopupForm from "../../control/StyleDialog/popupForm.js";
import VectorStyle from "mcutils/layer/VectorStyle.js";

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
    this.popupForm = new PopupForm({ labels: getControlLabels() });
    dialog.getDialogContent().innerHTML = "";
    this.popupForm.on("style", (e) => {
      this.popupForm.setPopupContent(editLayerPopupAction.layer, e.property, e.value);
    });
  }
  this.popupForm.setLayer(editLayerPopupAction.layer);
  const content = this.popupForm.getContent();
  const layer = editLayerPopupAction.layer
  if (layer && (layer instanceof VectorStyle || /WMTS|Statistique|MVT|PBF/.test(layer.get('type'))
      || (layer.getSource() && layer.getSource().getFeatureInfo && layer.get('queryable'))
  )) {
    dialog.getDialogContent().appendChild(content);
    content.querySelector("input").focus();
  } else {
    const warning = ol_ext_element.create('div', {
      className: 'fr-alert fr-alert--warning fr-alert--sm'
    });
    ol_ext_element.create('p', {
      text: i18next.t('actions:edit-layer-popup.notQueryable'),
      parent: warning
    });
    dialog.getDialogContent().replaceChildren(warning);
  }
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
