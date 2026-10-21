import carte from "../../carte.js";
import modal from "../../dialogs/modal.js";
import charte from "../../charte/charte.js";
import Charte from "../../charte/objects/Charte.js";
import Button from "ol-ext/control/Button.js";
import Bar from "ol-ext/control/Bar.js";
import Toggle from "ol-ext/control/Toggle.js";
import i18next from "../../i18n/index";

import Action from "../../actions/Action.js";

import "./step-bar.scss";
import { renameMapBtn, shareMapBtn } from "../file-bar/file-bar.js";

let onToggleMode = function () {
    let toggle = this;
    const currentMode = charte.getMode();
    const action = this.button_.getAttribute("data-action");
    if (currentMode === action) {
        // On a appuyé sur le même bouton : on laisse le toggle actif
        toggle.setActive(true);
    } else {
        // Désactive l'autre toggle (le mode change)
        currentToggle?.setActive(false);
        // Change le mode de l'appli
        charte.setMode(action);
        toggle.setActive(true);
    }
    currentToggle = toggle;
};

// Barre ajout de donnée
const creationLabel = document.createElement("span");
creationLabel.textContent = i18next.t("pages:steps.creation");
const layoutLabel = document.createElement("span");
layoutLabel.textContent = i18next.t("pages:steps.layout");

let createmap = new Toggle({
    html: '<i class="ri-pencil-line"></i>' + creationLabel.outerHTML,
    active: true,
    className: "action-button",
    classButton: "fr-btn fr-btn--tertiary-no-outline",
    attributes: {
        "aria-label": i18next.t("pages:steps.manageContent"),
        "data-action": Charte.modes.EDITOR,
    },
    onToggle: onToggleMode,
});

/**
 * @type {import("ol-ext/control/Toggle.js").default} Toggle actif
 */
let currentToggle = createmap;

let storymap = new Toggle({
    html: '<i class="ri-collage-line"></i>' + layoutLabel.outerHTML,
    className: "action-button",
    // autoActivate: true,
    classButton: "fr-btn fr-btn--tertiary-no-outline",
    attributes: {
        "aria-label": i18next.t("pages:steps.manageLayout"),
        "data-action": Charte.modes.STORYMAP,
    },
    onToggle: onToggleMode,
});

// Pour changer l'icône après
const saveIcon = "fr-icon-save-line";
const savedIcon = "fr-icon-check-line";

let save = new Button({
    className: "save-button",
    classButton: `fr-btn fr-btn--tertiary-no-outline ${saveIcon}`,
    attributes: {
        type: "button",
        "aria-label": i18next.t("common:save"),
        "data-action": "save-map",
        "aria-controls": modal.getId(),
        "data-fr-opened": "false",
    },
    handleClick: Action.open,
});

let share = new Button({
    className: "share-button",
    classButton: "fr-btn fr-btn--tertiary-no-outline fr-icon-share-2-line",
    attributes: {
        type: "button",
        "aria-label": i18next.t("common:share"),
        "data-action": "share-map",
        "aria-controls": modal.getId(),
        "data-fr-opened": "false",
    },
    handleClick: Action.open,
});

// Active / désactive certains boutons
carte.on("read", () => {
    const disabledButtons = [shareMapBtn, share, renameMapBtn];
    if (!carte.get("id")) {
        disabledButtons.forEach((btn) => {
            btn.setDisable(true);
            btn.button_.setAttribute("aria-label", btn === renameMapBtn ? i18next.t("pages:steps.saveBeforeRename") : i18next.t("pages:steps.saveBeforeShare"));
        });
    } else {
        disabledButtons.forEach((btn) => {
            btn.setDisable(false);
            btn.button_.setAttribute("aria-label", btn === renameMapBtn ? i18next.t("common:rename") : i18next.t("common:share"));
        });
    }
});

// À l'enregistrement, active certains boutons
carte.on("save", () => {
    const disabledButtons = [shareMapBtn, share, renameMapBtn];
    disabledButtons.forEach((btn) => {
        btn.setDisable(false);
        btn.button_.setAttribute("aria-label", btn === renameMapBtn ? i18next.t("common:rename") : i18next.t("common:share"));
    });

    // Change l'icône de sauvegarde vers `success` pendant 5 secondes
    save.button_.classList.remove(saveIcon);
    save.button_.classList.add(savedIcon);

    // Remet le bouton à son état initial après 3 secondes
    setTimeout(() => save.button_.classList.replace(savedIcon, saveIcon), 5000);
});

// Barre principale
let mainbar = new Bar({
    className: "ol-bar--fixed ol-bar--separator ol-bar--row step-bar",
    controls: [createmap, storymap, save, share],
});

carte.addControl("stepBar", mainbar);
mainbar.setPosition("top-right");
