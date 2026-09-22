import { createOidc } from "oidc-spa/core";
import { z } from "zod";
import { iamClientId, iamRealm, iamUrl } from "./env";

const prOidc = createOidc({
  // See: https://docs.oidc-spa.dev/v/v9/providers-configuration/provider-configuration

  issuerUri: `${iamUrl}/realms/${iamRealm}`,
  // issuerUri: "http://localhost:8000",
  clientId: iamClientId,

  debugLogs: true,

  // See: https://docs.oidc-spa.dev/v/v9/features/auto-login
  autoLogin: true,

  decodedIdTokenSchema: z.object({
    preferred_username: z.string(),
    email: z.string(),
  }),
});

if (prOidc instanceof Error) {

  alert("L'authentification ne fonctionne pas. Veuillez réessayer ultérieurement.");

  // Halt the app in a typed-safe way (nothing renders until you decide otherwise).
  await new Promise(() => {});
}

export async function getOidc() {
  const oidc = await prOidc;
  return oidc;
}

/**
 * Retourne juste le header Authorization avec le token OIDC
 * Utile pour passer à des requêtes personnalisées
 * Retourne undefined si l'utilisateur n'est pas connecté
 */
export const getAuthHeader = async () => {
  const oidc = await getOidc();

  if (!oidc.isUserLoggedIn) {
    return undefined;
  }

  const {
    // The accessToken is what you'll use as a Bearer token to
    // authenticate to your APIs
    accessToken,
  } = await oidc.getTokens();

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
/**
 * Retourne juste le header Authorization avec le token OIDC
 * Utile pour passer à des requêtes personnalisées
 * Retourne undefined si l'utilisateur n'est pas connecté
 */
export const getUserInfo = async () => {
  const oidc = await getOidc();

  if (!oidc.isUserLoggedIn) {
    return undefined;
  }

  return oidc.getDecodedIdToken();
};
