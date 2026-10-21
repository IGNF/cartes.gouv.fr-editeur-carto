import charte from "./charte.js";
import i18next from "../i18n/index";

// Menu
const help = charte.getHeaderMenu({
    icon: "fr-icon-question-fill",
    action: "help",
    text: i18next.t("charte:navigation.help.label"),
});

help.addMenu([
    {
        type: "link",
        label: i18next.t("charte:navigation.help.faq"),
        icon: "fr-icon-question-mark",
        href: "/aide/fr/",
        external: true,
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.help.userGuide"),
        icon: "fr-icon-book-2-line",
        href: "/aide/fr/guides-utilisateur/presentation-utilisateur/generalites-utilisateur/",
        external: true,
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.help.contact"),
        icon: "fr-icon-mail-line",
        href: "/aide/fr/nous-ecrire",
        external: true,
    },
]);
