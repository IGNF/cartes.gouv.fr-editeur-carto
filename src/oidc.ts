import { createOidc, type OidcInitializationError } from "oidc-spa/core";
import { z } from "zod";
import { iamClientId, iamRealm, iamUrl, redirectUri } from "./env";

const prOidc = createOidc({
  // See: https://docs.oidc-spa.dev/v/v9/providers-configuration/provider-configuration

  issuerUri: `${iamUrl}/realms/${iamRealm}`,
  // issuerUri: "http://localhost:8000",
  clientId: iamClientId,
  // Permet de gérer la redirection dans le cas de l'appli déployé
  // (sinon renvoi sur "/", donc sur l'entrée carto)
  BASE_URL: import.meta.env.PROD ? redirectUri : import.meta.env.BASE_URL,

  debugLogs: import.meta.env.DEV,

  // See: https://docs.oidc-spa.dev/v/v9/features/auto-login
  autoLogin: true,

  decodedIdTokenSchema: z.object({
    preferred_username: z.string(),
    email: z.string(),
  }),
}).catch((error) => error as OidcInitializationError);

if (prOidc instanceof Error) {
  const oidcInitializationError = prOidc;

  // Use this to distinguish a misconfiguration from a temporary auth-server outage.
  // NOTE: below references should use `oidcInitializationError`.
  console.log(oidcInitializationError.isAuthServerLikelyDown);

  // Developer-only diagnostic with likely cause and fix.
  // Do not display this to end users.
  import.meta.env.DEV && console.log(oidcInitializationError.message);

  alert(
    "L'authentification ne fonctionne pas. Veuillez réessayer ultérieurement.",
  );

  // Halt the app in a typed-safe way (nothing renders until you decide otherwise).
  await new Promise<never>(() => {});
}

export async function getOidc() {
  const oidc = await prOidc;

  if (oidc instanceof Error || !oidc.isUserLoggedIn) {
    return undefined;
  }

  return oidc;
}

/**
 * Retourne juste le header Authorization avec le token OIDC
 * Utile pour passer à des requêtes personnalisées
 * Retourne undefined si l'utilisateur n'est pas connecté
 */
export const getAuthHeader = async () => {
  const oidc = await getOidc();

  if (oidc instanceof Error || !oidc.isUserLoggedIn) {
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

  return oidc.getDecodedIdToken();
};
