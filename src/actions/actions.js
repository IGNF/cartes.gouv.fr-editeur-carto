import Action from './Action.js';
import openMapAction from './openMap/openMapAction.js';
import shareMapAction from './shareMap/shareMapAction.js';
import saveMapAction from './saveMap/saveMapAction.js';
import renameMapAction from './renameMap/renameMapAction.js';
import importCatalogAction from './importCatalog/importCatalogAction.js';
import importLocalAction from './importLocal/importLocalAction.js';
import importFlowAction from './importFlow/importFlowAction.js';
import editLayerStyleAction from './editLayerStyle/editLayerStyleAction.js';
import loginAction from './login/loginAction.js';
import Dialog from '../control/Dialog/Dialog.js';

let actions = {
  'open-map': openMapAction,
  'rename-map': renameMapAction,
  'save-map': saveMapAction,
  'share-map': shareMapAction,
  'import-catalog': importCatalogAction,
  'import-flow': importFlowAction,
  'import-local': importLocalAction,
  'edit-layer-style': editLayerStyleAction,
  'login': loginAction,
}

/**
 * Gère l'ouverture d'une action au clic sur un bouton ou un toggle
 * 
 * @param {PointerEvent} e 
 */
let openAction = function (e) {
  // Pour gérer le cas du toggle
  const target = e.target || e.detail.target;

  const actionName = target.dataset.action;
  const dialogId = target.getAttribute('aria-controls');
  const pressed = target.ariaPressed;
  const action = actions[actionName];

  let dialog = Dialog.getDialog(dialogId);
  if (!dialog) return;

  if (action instanceof Action) {
    action.setAction(dialog);
  }

  if (pressed === false || pressed === 'false') {
    dialog.close();
  } else {
    dialog.open();
  }
}

export default openAction;