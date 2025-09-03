
import api from 'mcutils/api/api.js';
import account from '../../charte/nav-user.js'
import content from './login.html?raw'
import Action from '../Action.js';

/**
 * @type {import('../../control/Dialog/Dialog.js').default}
 * Dialog utilisé par l'action 
 */
let dialog;

/**
 * Fonction à l'ouverture du dialog.
 * 
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/Dialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target
  let form = dialog.querySelector('form');
  form.addEventListener('submit', login);
}

function login(e) {
  e.preventDefault();

  let form = e.target
  const formData = new FormData(form);

  const username = formData.get('username')?.trim();
  const password = formData.get('password')?.trim();
  const rememberMe = formData.get('remember');

  // Helper: update error messages
  function setError(fieldId, message) {
    const fieldGroup = form.querySelector(`#${fieldId}-messages`);
    const input = form.querySelector(`#${fieldId}`);
    fieldGroup.innerHTML = `<p class="fr-error-text">${message}</p>`;
    input?.setAttribute('aria-invalid', 'true');
  }

  function clearError(fieldId) {
    const fieldGroup = form.querySelector(`#${fieldId}-messages`);
    const input = form.querySelector(`#${fieldId}`);
    fieldGroup.innerHTML = '';
    input?.removeAttribute('aria-invalid');
  }

  let hasError = false;

  if (!username) {
    setError('username', 'Veuillez renseigner un identifiant.');
    hasError = true;
  } else {
    clearError('username');
  }

  if (!password) {
    setError('password-input', 'Veuillez renseigner un mot de passe.');
    hasError = true;
  } else {
    clearError('password-input');
  }

  if (hasError) return;

  api.login(username, password, (e) => {
    if (e) {
      account.setMenu('user', {
        label: e.username,
        info: e.email
      });
      api.rememberMe(!!rememberMe)
      dialog.close();
    } else {
      setError('login-fieldset', 'Le couple nom utilisateur / mot de passe est incorrect.');
    }
  })
}

const loginAction = new Action({
  id: 'login',
  title: 'Connexion au service',
  content: content,
  buttons: [
    {
      label: "Se connecter",
      kind: 0,
      type: 'submit',
      form: 'login',
    },
    {
      label: "Annuler",
      kind: 1,
      close: true
    }
  ],
  onOpen: onOpen,
});

export default loginAction;