import Action from "../Action.js";
import i18next from "../../i18n/index";
import content from "./importFlow.html?raw";
import { translateHtml } from "../../i18n/translateHtml";
import "./importFlow.scss";

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action
 */
// let dialog;

/**
 * Fonction à l'ouverture du dialog.
 *
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen() {
    // dialog = e.target
}

const importFlowAction = new Action({
    id: "import-flow",
    title: i18next.t("actions:import-flow.title"),
    icon: "ri-global-line",
    onOpen: onOpen,
    content: translateHtml(content),
});

export default importFlowAction;
