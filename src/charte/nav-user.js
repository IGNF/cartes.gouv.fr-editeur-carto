import charte from "./charte.js";
import "./nav-user.scss";
import { getOidc } from "../oidc";
import i18next from "../i18n/index";

// Menu
export const account = charte.getHeaderMenu({
  icon: "fr-icon-account-fill",
  action: "connect",
  text: i18next.t('charte:navigation.account.label'),
});

/* User menu */
account.addMenu([
  {
    type: "description",
    action: "user",
  },
  {
    type: "link",
    label: i18next.t('charte:navigation.account.dashboard'),
    action: "board",
    href: "/tableau-de-bord",
    icon: "fr-icon-dashboard-3-line",
  },
  {
    type: "link",
    label: i18next.t('charte:navigation.account.myAccount'),
    action: "account",
    href: "/mon-compte",
    icon: "fr-icon-user-line",
  },
  {
    type: "option",
    action: "disconnect",
    label: i18next.t('charte:navigation.account.logout'),
    title: i18next.t('charte:navigation.account.logout'),
    href: "#",
    icon: "fr-icon-logout-box-r-line",
  },
]);

(async () => {
  const oidc = await getOidc();

  const decodedIdToken = oidc.getDecodedIdToken();

  charte.getHeaderMenu({ action: "connect" }).setMenu("user", {
    label: decodedIdToken.preferred_username,
    info: decodedIdToken.email,
  });
})();

// Attend que le DSFR soit prêt pour la duplication du header
document.documentElement.addEventListener("dsfr.start", () => {
  // Bouton de déconnexion
  let disconnect = account.getMenu("disconnect");
  disconnect.forEach((btn) => {
    btn.link.addEventListener("click", async () => {
      const oidc = await getOidc();
      oidc.logout({ redirectTo: "specific url", url: "/" });
    });
  });
});
