/**
 * @file Fichier s'occupant des messages d'erreurs sur des inputs.
 * 
 */

import getUid from "./getUid.js";

/**
 * Ajoute une erreur lié à un input / select.
 * 
 * L'input doit avoir un élément pour le message, défini par
 * l'attribut `aria-describedby`.
 * 
 * L'input doit être compris dans un autre élément, dont le
 * tag est défini par le paramètre `closest`.
 * La classe de cet élément doit contenir 'groupe' ou doit être
 * 'fr-fieldset' et sera utilisée pour ajouter la classe globale
 * de validation ou d'erreur.
 * 
 * Si error est vrai, ajoute un message d'erreur.
 * Sinon, ajouter un message de succès.
 * 
 * @param {Element} input Input sur lequel ajouter le message.
 * @param {String} message Message à ajouter.
 * @param {Object} options Options à ajouter
 * @param {Boolean} options.error Optionnel. Définit si c'est une erreur ou un succès
 * @param {String} options.closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 * @param {true} options.append Optionnel. Si vrai, ajoute le message
 * aux autres messages. Sinon, enlève les messages existants. Par défaut `false`.
 */
function addMessage(input, message, options) {
  options = options ? options : {};
  options.closest = options.closest ? options.closest : 'div';
  options.error = options.error === undefined ? true : options.error;
  // Classe à ajouter au message
  const msgClass = options.wait ? '--info' : (options.error ? '--error' : '--valid');
  // Classe à enlever sur l'élément englobant
  const removedClass = options.error ? '--valid' : '--error';

  // Récupère les éléments importants
  const msgId = input.getAttribute('aria-describedby');
  let element = input.closest(options.closest);
  let msg = element.querySelector(`#${msgId}`);
  if (!element) return;

  // Ajoute les classes à l'élément
  let elementClass = element.classList.item(0);
  element.classList.add(elementClass + msgClass);
  element.classList.remove(elementClass + removedClass);

  // Ajoute le message en enlevant les autres
  if (!options.append) msg.replaceChildren();
  const p = document.createElement('p');
  p.classList.add('fr-message', `fr-message${msgClass}`);
  p.id = getUid(`fr-message${msgClass}`);
  p.textContent = message;
  msg.appendChild(p)
}

/**
 * 
 * @param {Element} input Input sur lequel ajouter le message.
 * @param {String} closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 */
function removeMessage(input, closest = 'div') {
  // Récupère les éléments importants
  const msgId = input.getAttribute('aria-describedby');
  let element = input.closest(closest);
  let msg = element.querySelector(`#${msgId}`);
  if (!element) return;

  let elementClass = element.classList.item(0);
  element.classList.remove(elementClass + '--valid', elementClass + '--error');

  msg.replaceChildren();
}

export default { addMessage, removeMessage };