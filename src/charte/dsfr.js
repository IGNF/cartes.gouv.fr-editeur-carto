import charte from "./charte.js";
import displayDialog from "../dialogs/displayDialog.js";
import i18next from "../i18n/index";

// Set service info
charte.setService({
    service: i18next.t("charte:header.service.name") + " ",
    href: "./",
    title: i18next.t("charte:header.service.title"),
    baseline: i18next.t("charte:header.service.baseline"),
    operator: {
        logo: "https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo.svg",
        darkLogo: "https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo-dark.svg",
    },
    badge: {
        text: i18next.t("charte:header.service.createBadge"),
        colorClass: "fr-badge--yellow-tournesol",
        icon: "fr-icon-brush-fill",
    },
});

charte.setDescription(i18next.t("charte:footer.description"));

// Partner list / logo
charte.addPartner({
    alt: i18next.t("charte:footer.partners.ign"),
    url: "https://www.ign.fr/",
    img: "https://data.geopf.fr/annexes/ressources/footer/ign.png",
    main: true,
});
charte.addPartner({
    alt: i18next.t("charte:footer.partners.publicTransformationMinistry"),
    url: "https://www.transformation.gouv.fr/",
    img: "https://data.geopf.fr/annexes/ressources/footer/min_fp.jpg",
});
charte.addPartner({
    alt: i18next.t("charte:footer.partners.ecologicalTransitionMinistry"),
    url: "https://www.ecologie.gouv.fr/",
    img: "https://data.geopf.fr/annexes/ressources/footer/min_ecologie.jpg",
});
charte.addPartner({
    alt: i18next.t("charte:footer.partners.cnig"),
    url: "https://cnig.gouv.fr/",
    img: "https://data.geopf.fr/annexes/ressources/footer/rf_cnig.jpg",
});

// Main links
charte.addContentLink({
    href: "https://www.info.gouv.fr/",
});
charte.addContentLink({
    href: "https://service-public.gouv.fr/",
});
charte.addContentLink({
    href: "https://legifrance.gouv.fr/",
});
charte.addContentLink({
    href: "https://data.gouv.fr/",
});

// Footer links
charte.addFooterLink({
    title: i18next.t("charte:footer.links.sitemap"),
    href: "https://cartes.gouv.fr/plan-du-site",
});
charte.addFooterLink({
    title: i18next.t("charte:footer.links.accessibility"),
    href: "https://cartes.gouv.fr/accessibilite",
});
charte.addFooterLink({
    title: i18next.t("charte:footer.links.legalNotice"),
    href: "https://cartes.gouv.fr/mentions-legales",
});
charte.addFooterLink({
    title: i18next.t("charte:footer.links.termsOfUse"),
    href: "https://cartes.gouv.fr/cgu",
});
charte.addFooterLink({
    title: i18next.t("charte:footer.links.personalData"),
    href: "https://cartes.gouv.fr/donnees-personnelles",
});
charte.addFooterLink({
    title: i18next.t("charte:footer.links.cookies"),
    href: "#",
});
charte.addFooterButton(i18next.t("charte:footer.links.displaySettings"), {
    icon: "fr-icon-theme-fill",
    title: i18next.t("charte:footer.links.displaySettings"),
    "aria-controls": displayDialog.id,
    "data-fr-opened": false,
});
