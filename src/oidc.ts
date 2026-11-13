import { createOidc } from "oidc-spa/core";
import { z } from "zod";
import { createMockOidc } from "oidc-spa/core-mock";
import { iamClientId, iamRealm, iamUrl, redirectUri } from "./env";
// import i18next from "./i18n/i18n";

const decodedIdTokenSchema = z.object({
    preferred_username: z.string(),
    email: z.string(),
});

// Créé un mock si besoin
const prOidc = import.meta.env.VITE_OIDC_USE_MOCK
    ? createMockOidc({
          // Optional:
          mockedParams: {
              issuerUri: `${iamUrl}/realms/${iamRealm}`,
              // issuerUri: "http://localhost:8000",
              clientId: iamClientId,
          },
          mockedTokens: {
              decodedIdToken: {
                  email: "mock.email@test.com",
                  preferred_username: "Mocked User",
              } satisfies z.infer<typeof decodedIdTokenSchema>,
              // accessToken: "mocked access token",
              // ...
          },

          // autoLogin: true,
          isUserInitiallyLoggedIn: false,
      })
    : createOidc({
          // See: https://docs.oidc-spa.dev/v/v9/providers-configuration/provider-configuration

          issuerUri: `${iamUrl}/realms/${iamRealm}`,
          // issuerUri: "http://localhost:8000",
          clientId: iamClientId,
          // Permet de gérer la redirection dans le cas de l'appli déployé
          // (sinon renvoi sur "/", donc sur l'entrée carto)
          BASE_URL: import.meta.env.PROD ? redirectUri : import.meta.env.BASE_URL,

          debugLogs: import.meta.env.DEV,

          // See: https://docs.oidc-spa.dev/v/v9/features/auto-login
          autoLogin: false,

          decodedIdTokenSchema: decodedIdTokenSchema,
      });

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
 * Retourne les informations du jeton d'identité OIDC
 * Retourne undefined si l'utilisateur n'est pas connecté
 */
export const getUserInfo = async () => {
    const oidc = await getOidc();

    if (!oidc.isUserLoggedIn) {
        return undefined;
    }

    return oidc.getDecodedIdToken();
};
