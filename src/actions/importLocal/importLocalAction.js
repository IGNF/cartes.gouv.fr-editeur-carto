import Action from "../Action.js";
import i18next from "../../i18n/index";
import content from "./importLocal.html?raw";
import { translateHtml } from "../../i18n/translateHtml";
import "./importLocal.scss";
import carte from "../../carte.js";
import { addMessage, removeMessage } from "../../utils/message.js";

import * as importLocal from "./importLocal.js";
import * as errors from "../../utils/errors.js";

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
    dialog = e.target;

    let form = dialog.querySelector("form");
    form.addEventListener("submit", submitForm);

    let input = dialog.querySelector('input[type="file"]');
    input.accept = importLocal.accepted.join(",");
    input.addEventListener("change", (e) => removeMessage(e.target));
}

/**
 * Gère l'envoi du formulaire.
 *
 * @param {SubmitEvent} e Événement submit du formulaire.
 */
async function submitForm(e) {
    e.preventDefault();
    let form = e.target;
    let input = form.querySelector("input");
    let inputFile = input.files.item(0);
    const formData = new FormData(form);
    const file = formData.get("file");

    try {
        if (importLocal.checkFile(inputFile)) {
            addMessage(input, i18next.t("actions:import-local.loading"), { type: "info", append: false });
            const submit = form.querySelector('[type="submit"]');
            submit.disabled = true;

            const promises = await importLocal.importFile(file);

            removeMessage(input);
            // setTimeout(() => form.querySelector('[type="submit"]').disabled = false, 500);

            promises.forEach((promise) => {
                if (promise.status === "fulfilled") {
                    const layer = promise.value;
                    if (layer.getSource().getFeatures().length) {
                        carte.addLayer(layer);
                        addMessage(
                            input,
                            i18next.t("actions:import-local.layerAdded", {
                                title: layer.get("title"),
                                interpolation: { escapeValue: false },
                            }),
                            { type: "valid", append: true }
                        );
                    } else {
                        addMessage(
                            input,
                            i18next.t("actions:import-local.emptyLayer", {
                                title: layer.get("title"),
                                interpolation: { escapeValue: false },
                            }),
                            { type: "warning", append: true }
                        );
                    }
                } else {
                    handleError(promise.reason, form, file, true);
                }
            });
            submit.disabled = false;
        }
    } catch (err) {
        handleError(err, form, file);
    }
}

/**
 * Gère les erreurs en affichant les bons messages.
 *
 * @param {Error} err Erreur à gérer
 * @param {HTMLFormElement} form Formulaire d'import
 * @param {File} file Fichier dont l'erreur provient
 * @param {boolean} [append] Optionnel. Ajoute le message d'erreur si vrai.
 * Par défaut : `false`
 */
function handleError(err, form, file, append = false) {
    let options = {
        append: append,
    };
    let input = form.querySelector("input");
    switch (true) {
        case err instanceof errors.MissingFileError:
            addMessage(input, i18next.t("actions:import-local.missingFile"), options);
            break;

        case err instanceof errors.UnsupportedExtensionError:
            addMessage(
                input,
                i18next.t("actions:import-local.unsupportedFormat", {
                    format: err.message,
                    interpolation: { escapeValue: false },
                }),
                options
            );
            break;

        case err instanceof errors.EmptyLayerError:
            addMessage(
                input,
                i18next.t("actions:import-local.emptyFile", {
                    fileName: err.message,
                    interpolation: { escapeValue: false },
                }),
                options
            );
            break;

        case err instanceof errors.MissingFileInZipError:
            addMessage(
                input,
                i18next.t("actions:import-local.missingArchiveFile", {
                    fileName: err.message,
                    interpolation: { escapeValue: false },
                }),
                options
            );
            break;

        default:
            addMessage(
                input,
                i18next.t("actions:import-local.importFailed", {
                    fileName: file.name,
                    interpolation: { escapeValue: false },
                }),
                options
            );
            console.error(err);
            break;
    }
    form.querySelector('[type="submit"]').disabled = false;
}

const importLocalAction = new Action({
    id: "import-local",
    title: i18next.t("actions:import-local.title"),
    icon: "ri-file-upload-line",
    onOpen: onOpen,
    content: translateHtml(content),
});

export default importLocalAction;
