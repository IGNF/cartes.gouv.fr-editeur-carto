import Action from "../Action.js";
import i18next from "../../i18n/index";
import carte from "../../carte.js";
import Alert from "../../control/Alert/Alert";

import content from "./shareMap.html?raw";
import { translateHtml } from "../../i18n/translateHtml";
import "./shareMap.scss";
import { getViewURL } from "../../utils/urls.js";

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action
 */
let dialog;

/**
 * Fonction appelée avant l'ouverture du dialog.
 * Vérifie que la carte existe et a un ID.
 * Si non, ajoute une alerte.
 *
 * @returns {boolean} true si la carte existe, false sinon
 */
function beforeOpen() {
    const id = carte.get("id");
    if (!id) {
        Alert.addAlert(
            {
                closeLabel: i18next.t("notifications:dismiss"),
                type: Alert.TYPES.ERROR,
                id: "alert--map-not-saved",
                title: i18next.t("actions:share-map.notSavedTitle"),
                description: i18next.t("actions:share-map.notSaved"),
            },
            true
        );

        return false;
    }
    return true;
}

/**
 * Fonction à l'ouverture du dialog.
 *
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
    dialog = e.target;

    // Add copy event to buttons
    let copyBtns = dialog.querySelectorAll("button.copy");
    copyBtns.forEach((btn) => {
        btn.addEventListener("click", copy);
    });
    // Enter map info in the dialog
    // const url = new URL(config.viewer.replace("$ID", carte.get("id")), window.location.href);
    // const url = config.server + 'carte/' + carte.get('id') + '/' + carte.getTitle();
    const url = getViewURL(carte.get("id"));
    dialog.querySelector("#share-link").value = url;
    dialog.querySelector("#share-iframe").value = `<iframe
  width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
  sandbox="allow-forms allow-scripts allow-same-origin"
  src="${url}">
  allowfullscreen>
</iframe>`;
}

function copy(e) {
    const button = e.currentTarget;
    let dataCopy = button.dataset.copy;
    let input = document.getElementById(dataCopy);

    if (input) {
        // Copie la valeur
        navigator.clipboard.writeText(input.value);

        // Change l'icône et le texte affiché
        const icon = document.createElement("span");
        icon.className = "fr-ml-1w ri-check-line";
        button.replaceChildren(i18next.t("actions:share-map.copied") + " ", icon);

        // Remet le bouton à son état initial après 3 secondes
        setTimeout(() => {
            icon.className = "fr-ml-1w ri-file-copy-line";
            button.replaceChildren(i18next.t("actions:share-map.copy") + " ", icon);
        }, 3000);
    }
}

const shareMapAction = new Action({
    id: "share-map",
    title: i18next.t("actions:share-map.title"),
    content: translateHtml(content),
    beforeOpen: beforeOpen,
    onOpen: onOpen,
});

export default shareMapAction;
