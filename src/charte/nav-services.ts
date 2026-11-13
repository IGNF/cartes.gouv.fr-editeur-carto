import charte from "./charte.js";
import i18next from "../i18n/i18n";

const servicesLabel = document.createElement("span");
servicesLabel.textContent = i18next.t("charte:navigation.services.label");

// Menu
const service = charte.getHeaderMenu({
    action: "services",
    html: '<i class="fr-mr-1w ri-lg ri-grid-fill"></i>' + servicesLabel.outerHTML,
    text: i18next.t("charte:navigation.services.label"),
});

service.addMenu([
    {
        type: "link",
        label: i18next.t("charte:navigation.services.exploreMaps"),
        icon: "fr-icon-road-map-line",
        href: "/explorer-les-cartes",
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.services.searchData"),
        icon: "fr-icon-search-line",
        href: "/rechercher-une-donnee/search",
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.services.publishData"),
        icon: "fr-icon-database-line",
        href: "/publier-une-donnee",
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.services.createMap"),
        icon: "fr-icon-brush-line",
        href: "/creer-une-carte",
        beta: true,
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.services.extract"),
        icon: "fr-icon-extract",
        href: "/extraction",
        beta: true,
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.services.collaborate"),
        icon: "fr-icon-message-2-line",
        href: "/guichet-collaboratif",
        beta: true,
    },
    {
        type: "option",
        label: i18next.t("charte:navigation.services.discover"),
        title: i18next.t("charte:navigation.services.discover"),
        href: "/decouvrir",
        icon: "fr-icon-external-link-line fr-btn--icon-right",
    },
]);
