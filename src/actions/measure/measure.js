/**
 * @file Gère les mesures sur la carte.
 */

import Bar from "ol-ext/control/Bar.js";
import Toggle from "ol-ext/control/Toggle.js";
import i18next from "../../i18n/index";

const distanceLabel = document.createElement("span");
distanceLabel.textContent = i18next.t("actions:measure.distance");
const isochroneLabel = document.createElement("span");
isochroneLabel.textContent = i18next.t("actions:measure.isochrone");

// Interaction de mesure
let distanceMeasure = new Toggle({
    className: "dsfr-btn",
    html: '<i class="fr-mr-1w ri-1x ri-ruler-line"></i>' + distanceLabel.outerHTML,
    classButton: "fr-btn fr-btn--tertiary fr-btn--icon-left ",
});

let surfaceMeasure = new Toggle({
    className: "dsfr-btn",
    html: i18next.t("actions:measure.surface"),
    classButton: "fr-btn fr-btn--tertiary fr-icon-ign-surface fr-btn--icon-left ",
});

let isochrone = new Toggle({
    className: "dsfr-btn",
    html: '<i class="fr-mr-1w ri-1x ri-map-pin-5-line"></i>' + isochroneLabel.outerHTML,
    classButton: "fr-btn fr-btn--tertiary fr-btn--icon-left ",
});

function createBar(target) {
    let bar = new Bar({
        className: "dsfr-btn-group fr-btns-group fr-btns-group--icon-left",
        target: target,
        toggleOne: true,
        controls: [distanceMeasure, surfaceMeasure, isochrone],
    });

    return bar;
}
export { createBar };
