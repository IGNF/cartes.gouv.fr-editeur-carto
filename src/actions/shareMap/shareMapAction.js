import Action from '../Action.js';
import carte from '../../carte.js';
import config from 'mcutils/config/config.js';
import modal from '../../dialogs/modal.js';
import Alert from '../../control/Alert/Alert.js';

import content from './shareMap.html?raw';
import './shareMap.scss';

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target

  const id = carte.get('id');
  if (!id) {
    setTimeout(() => dialog.close(), 0);

    Alert.addAlert({
      type: Alert.TYPES.ERROR,
      id: "alert--map-not-saved",
      title: 'Impossible de partager la carte',
      description: "Enregistrez d'abord votre carte pour générer un lien de partage.",
    }, true);

    return false;
  }

  dialog.querySelector('[data-action="nomap"]').classList.add('fr-hidden');
  // Add copy event to buttons
  let copyBtns = dialog.querySelectorAll('button.copy');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', copy)
  });
  // Enter map info in the dialog
  const url = new URL(config.viewer.replace("$ID", carte.get("id")), window.location.href);
  // const url = config.server + 'carte/' + carte.get('id') + '/' + carte.getTitle();
  dialog.querySelector('#share-link').value = url;
  dialog.querySelector('#share-iframe').value = `<iframe
  width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
  sandbox="allow-forms allow-scripts allow-same-origin"
  src="${url}">
  allowfullscreen>
</iframe>`;
}

function copy(e) {
  let dataCopy = e.target.dataset.copy;
  let input = document.getElementById(dataCopy);

  if (input) {
    // Copie la valeur
    navigator.clipboard.writeText(input.value);

    // Change l'icône et le texte affiché
    let copied = 'Copié <span class="fr-ml-1w ri-check-line"></span>'
    e.target.innerHTML = copied;

    // Remet le bouton à son état initial après 3 secondes
    setTimeout(() => e.target.innerHTML = 'Copier <span class="fr-ml-1w ri-file-copy-line"></span>', 3000);
  }
}

const shareMapAction = new Action({
  id: 'share-map',
  title: 'Partager',
  content: content,
  onOpen: onOpen
});

export default shareMapAction;