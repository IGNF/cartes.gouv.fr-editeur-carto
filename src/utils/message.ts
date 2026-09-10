/**
 * @file Fichier s'occupant des messages d'erreurs sur des inputs.
 *
 */

import getUid from "./getUid.js";

const messageClasses = {
    warning: "--warning",
    info: "--info",
    valid: "--valid",
    error: "--error",
};

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
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input Input sur lequel ajouter le message.
 * @param {String} message Message à ajouter.
 * @param {Object} options Options à ajouter
 * @param {Boolean} options.type Optionnel. Définit le type de message.
 * Valeur acceptée : `valid`, `info`, `warning`. Par défaut, message d'erreur
 * @param {String} options.closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 * @param {true} options.append Optionnel. Si vrai, ajoute le message
 * aux autres messages. Sinon, enlève les messages existants. Par défaut `false`.
 */
function addMessage(input: any, message: any, options: any) {
    options = options ? options : {};
    options.closest = options.closest ? options.closest : "div";
    options.type = Object.keys(messageClasses).includes(options.type) ? options.type : "error";
    // Classe à ajouter au message
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    let msgClass = messageClasses[options.type];
    // switch (options.type) {
    //   case 'warning': {
    //     msgClass = '--warning';
    //     break;
    //   }
    //   case 'info': {
    //     msgClass = '--info';
    //     break;
    //   }
    //   case 'valid': {
    //     msgClass = '--valid';
    //     break;
    //   }
    //   default: {
    //     msgClass = '--error';
    //     break;
    //   }
    // }
    // Classe à enlever sur l'élément englobant
    const removedClass = Object.values(messageClasses);
    // ['--valid', '--error', '--info', '--warning'];

    // Récupère les éléments importants
    const msgId = input.getAttribute("aria-describedby");
    let element = input.closest(options.closest);
    let msg = element.querySelector(`#${msgId}`);
    if (!element) return;

    // Ajoute les classes à l'élément
    let elementClass = element.classList.item(0);
    removedClass.forEach((k) => element.classList.remove(elementClass + k));
    element.classList.add(elementClass + msgClass);

    // Ajoute le message en enlevant les autres
    if (!options.append) msg.replaceChildren();
    const p = document.createElement("p");
    p.classList.add("fr-message", `fr-message${msgClass}`);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    p.id = getUid(`fr-message${msgClass}`);
    p.textContent = message;
    msg.appendChild(p);

    // Ajoute aussi à l'input en cas d'erreur
    options.type === "error" && input.setCustomValidity(message);
}

/**
 * Fonction permettant d'enlever un message
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input Input sur lequel ajouter le message.
 * @param {String} closest Optionnel. Définit le tag de l'élément sur lequel
 * mettre la classe d'erreur. Par défaut 'div'.
 */
function removeMessage(input: any, closest = "div") {
    // Récupère les éléments importants
    const msgId = input.getAttribute("aria-describedby");
    let element = input.closest(closest);
    let msg = element.querySelector(`#${msgId}`);
    if (!element) return;

    // Retrait des classes
    let elementClass = element.classList.item(0);
    const removedClass = Object.values(messageClasses);
    removedClass.forEach((k) => element.classList.remove(elementClass + k));
    input.setCustomValidity("");

    msg.replaceChildren();
}

export { addMessage, removeMessage };
