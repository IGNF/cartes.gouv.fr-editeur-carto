import charte from "./charte.js";
import "./nav-user.scss";
import { getOidc } from "../oidc";
import i18next from "../i18n/i18n.js";
import { redirectUri } from "@/env.js";

// Menu
export const connect = charte.getHeaderButton({
    icon: "fr-icon-account-fill",
    action: "connect",
    label: i18next.t("charte:navigation.account.login"),
    type: "button",
});

export const account = charte.getHeaderMenu({
    icon: "fr-icon-account-fill",
    action: "connect",
    text: i18next.t("charte:navigation.account.label"),
});
const accountBtn = account.element as HTMLElement;
accountBtn.style.display = "none";

// /* User menu */
account.addMenu([
    {
        type: "description",
        action: "user",
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.account.dashboard"),
        action: "board",
        href: "/tableau-de-bord",
        icon: "fr-icon-dashboard-3-line",
    },
    {
        type: "link",
        label: i18next.t("charte:navigation.account.myAccount"),
        action: "account",
        href: "/mon-compte",
        icon: "fr-icon-user-line",
    },
    {
        type: "option",
        action: "disconnect",
        label: i18next.t("charte:navigation.account.logout"),
        title: i18next.t("charte:navigation.account.logout"),
        href: "#",
        icon: "fr-icon-logout-box-r-line",
    },
]);

(async () => {
    const oidc = await getOidc();

    if (oidc.isUserLoggedIn === true) {
        const decodedIdToken = oidc.getDecodedIdToken();

        account.setMenu("user", {
            label: decodedIdToken.preferred_username,
            info: decodedIdToken.email,
        });

        // Affiche / cache les boutons correspondants
        accountBtn.style.display = "flex";
        connect.style.display = "none";
    } else {
        // Affiche / cache les boutons correspondants
        accountBtn.style.display = "none";
        connect.style.display = "flex";

        // Se connecte au clic
        connect.addEventListener("click", () => {
            oidc.login({
                doesCurrentHrefRequiresAuth: false,
                redirectUrl: import.meta.env.PROD ? redirectUri : import.meta.env.BASE_URL,
            });
        });
    }
})();

// Attend que le DSFR soit prêt pour la duplication du header
document.documentElement.addEventListener("dsfr.start", () => {
    // Bouton de déconnexion
    let disconnect = account.getMenu("disconnect");
    disconnect.forEach((btn) => {
        btn.link?.addEventListener("click", async () => {
            const oidc = await getOidc();

            if (oidc.isUserLoggedIn) {
                oidc.logout({ redirectTo: "specific url", url: import.meta.env.PROD ? redirectUri : import.meta.env.BASE_URL });
            }
        });
    });
});
