import Action from './Action';
import openMapAction from './openMap/openMap';
import shareMapAction from './shareMap/shareMap';
import saveMapAction from './saveMap/saveMap';
import renameMapAction from './renameMap/renameMap';
import importCatalogAction from './importCatalog/importCatalog';
import importLocalAction from './importLocal/importLocal';
import importFlowAction from './importFlow/importFlow';
import editLayerStyleAction from './editLayerStyle/editLayerStyle';

import getDialog from './dialogs';
import loginAction from './login/login';
import Modal from '../control/Modal/Modal';


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

  let dialog = getDialog(dialogId);

  if (!dialog) return;

  if (action instanceof Action) {
    action.setAction(dialog);
  } else if (action) {
    dialog.setContent(action);
  }

  // N'agit pas sur les modales dsfr
  if (!(dialog instanceof Modal)) {
    if (pressed === false || pressed === 'false') {
      dialog.close();
    } else {
      dialog.open();
    }
  }
}

export default openAction;