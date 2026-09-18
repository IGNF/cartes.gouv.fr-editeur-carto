import Action from "../actions/Action.js";
import loginDialog from "../dialogs/loginDialog.js";
import charte from "./charte.js";
import "./nav-user.scss";
import { getOidc, getUserInfo } from "../oidc.js";
import { api } from "../api/index";

// Menu
export const account = charte.getHeaderMenu({
  icon: "fr-icon-account-fill",
  action: "connect",
  text: "Mon espace",
});

/* User menu */
account.addMenu([
  {
    type: "description",
    action: "user",
  },
  {
    type: "link",
    label: "Tableau de bord",
    action: "board",
    href: "/tableau-de-bord",
    icon: "fr-icon-dashboard-3-line",
  },
  {
    type: "link",
    label: "Mon compte",
    action: "account",
    href: "/mon-compte",
    icon: "fr-icon-user-line",
  },
  {
    type: "option",
    action: "disconnect",
    label: "Se déconnecter",
    title: "Se déconnecter",
    href: "#",
    icon: "fr-icon-logout-box-r-line",
  },
]);

(async () => {
  const oidc = await getOidc();

  // oidc-spa exports Keycloak-specific utilities:
  const { createKeycloakUtils, isKeycloak } = await import("oidc-spa/keycloak");

  const keycloakUtils = isKeycloak({ issuerUri: oidc.issuerUri })
    ? createKeycloakUtils({ issuerUri: oidc.issuerUri })
    : undefined;
  
  // Pas besoin de vérifier si l'utilisateur est connecté car toujours le cas
  // avec oidc.withAutoLogin: true

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
