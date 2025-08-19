import Dialog from "../control/Dialog/Dialog";
import leftPanel from "../leftPanel";
import rightPanel from "../rightPanel";
import modal from "../modal";
import loginDialog from "../loginDialog";

/**
 * Récupère les ids des dialogues utilisés dans l'éditeur.
 * 
 * @returns {Object} Objet avec pour clé les ids des dialogs
 * et en valeur les dialogs correspondants.
 */
function getAllIds() {
  let dialogsIds = {}

  // Enregistre les dialogs utilisés dans l'appli
  dialogsIds[leftPanel.getId()] = leftPanel;
  dialogsIds[rightPanel.getId()] = rightPanel;
  dialogsIds[modal.getId()] = modal;
  dialogsIds[loginDialog.getId()] = loginDialog;

  return dialogsIds;
}

/**
 * Renvoie le dialog correspondant à l'id en paramètre.
 * @param {string} id Id du dialog à récupérer
 * @returns {Dialog} Dialog correspondant.
 */
function getDialog(id) {
  const dialogsIds = getAllIds();
  let dialog = dialogsIds[id];
  return dialog;
}

export default getDialog;