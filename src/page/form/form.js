import Bar from "ol-ext/control/Bar.js";
import Button from "ol-ext/control/Button.js";
import carte from "../../carte.js";
import i18next from "../../i18n/i18n";
import formImageUrl from "./form.svg";
import "./form.scss";

const formImage = document.createElement("img");
formImage.src = formImageUrl;
formImage.alt = "";
formImage.width = 24;
formImage.height = 24;

const formBtn = new Button({
    className: "form-button",
    classButton: "fr-btn fr-btn--tertiary-no-outline",
    title: i18next.t("controls:ui.form"),
    attributes: {
        "aria-label": i18next.t("controls:ui.form"),
    },
    html: formImage,
    handleClick: () => {
        window.open("https://macarte.ign.fr/", "_blank", "noopener,noreferrer");
    },
});

const bar = new Bar({
    className: "temp-form-button",
    controls: [formBtn],
});

carte.addControl("formButton", bar);
bar.setPosition("bottom-left");
