import Bar from "ol-ext/control/Bar.js";
import Button from "ol-ext/control/Button.js";
import carte from "../../carte.js";
import i18next from "../../i18n/i18n";
import formImageUrl from "./form.svg";
import "./form.scss";
import { formIcon, formUrl } from "@/env.js";

const icon = formIcon ?? "";

let html: HTMLElement | undefined = undefined;
if (icon === "jedonnemonavis") {
    const img = document.createElement("img");
    img.src = formImageUrl;
    img.alt = "";
    img.width = 24;
    img.height = 24;
    html = img;
}

const formBtn = new Button({
    className: `form-button ${icon === "jedonnemonavis" && "je-donne-mon-avis"}`,
    classButton: `fr-btn fr-btn--tertiary-no-outline ${icon}`,
    // title: i18next.t("common:externalRef", { title: i18next.t("controls:ui.form") }),
    attributes: {
        // aria-label complet pour les lecteurs d'écran, libellé court pour la tooltip
        "aria-label": i18next.t("common:externalRef", { title: i18next.t("controls:ui.form") }),
        "data-tooltip": i18next.t("controls:ui.form"),
    },
    html: html,
    handleClick: () => {
        window.open(formUrl, "_blank", "noopener,noreferrer");
    },
});

const bar = new Bar({
    className: "temp-form-button",
    controls: [formBtn],
});

carte.addControl("formButton", bar);
bar.setPosition("bottom-left");
