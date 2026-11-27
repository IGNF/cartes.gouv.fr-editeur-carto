import "./version.js";
import i18next from "./i18n/i18n";
import "./charte/dsfr.js";
import "./charte/navigation.js";
import "./actions/actions.js";

import "./oidc";
import story from "./story.js";
import carte from "./carte.js";
import "./utils/storyToMapChanges.js";

import introDialog from "./dialogs/introDialog.js";
import connectAction from "./actions/connect/connectAction.js";

import switcher from "./mcutils/layerSwitcher.js";
import search from "./mcutils/search.js";

import "./page/page.js";

// Custom CSS
import "remixicon/fonts/remixicon.css";
import "./css/index.scss";
import { getOidc } from "./oidc";

document.title = i18next.t("pages:document.title");
document.querySelector('meta[name="description"]').setAttribute("content", i18next.t("pages:document.description"));

// Ajout des contrôles
carte.once("read", () => {
    carte.addControl("layerSwitcher", switcher);
    carte.addControl("search", search);
    carte.getMap().getOverlayContainerStopEvent().style.cursor = "auto";
});

/**
 * UNIQUEMENT EN TEST, SI LOGIN NON SOUHAITÉ
 */
// introDialog.setAction(connectActionTest);

introDialog.setAction(connectAction);
(async () => {
    const buttons = introDialog.querySelectorAll(`${introDialog.selectors.BUTTON_GROUP} button, ${introDialog.selectors.BUTTON_GROUP} a`);

    const oidc = await getOidc();
    if (oidc.isUserLoggedIn === false) {
        buttons.forEach((/** @type {HTMLButtonElement} */ btn) => {
            const isHidden = btn.classList?.contains("fr-hidden");
            btn.classList?.toggle("fr-hidden", isHidden);
        });
    } else {
        buttons.forEach((/** @type {HTMLButtonElement} */ btn, key, parent) => {
            const isHidden = btn.classList?.contains("fr-hidden");
            btn.classList?.toggle("fr-hidden", !isHidden);
            // Met le focus sur le dernier bouton visible
            isHidden && parent.length - 1 === key && btn.focus({ focusVisible: true });
        });
    }
})();

const params = new URLSearchParams(window.location.search);
if (params.get("edit")) {
    introDialog.close();
    setTimeout(() => introDialog.querySelector(".intro-dialog_footer button.createMap").click(), 500);
}

/* DEBUG */
if (import.meta.env.DEV) {
    window.story = story;
    window.carte = carte;
}
/**/
