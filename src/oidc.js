import { createOidc } from "oidc-spa/core";
import { z } from "zod";

console.log(import.meta.env)
console.log(`${import.meta.env.IAM_URL}/realms/${import.meta.env.IAM_REALM}`,
  import.meta.env.IAM_CLIENT_ID);

const prOidc = createOidc({
  // See: https://docs.oidc-spa.dev/v/v9/providers-configuration/provider-configuration
  
  implementation: "real",
  issuerUri: `${import.meta.env.IAM_URL}/realms/${import.meta.env.IAM_REALM}`,
  // issuerUri: "http://localhost:8000",
  clientId: import.meta.env.IAM_CLIENT_ID,

  debugLogs: true,

  // See: https://docs.oidc-spa.dev/v/v9/features/auto-login
  autoLogin: true,

  decodedIdTokenSchema: z.object({
       preferred_username: z.string(),
       email: z.string(),
    }),
})

if( prOidc instanceof Error ){

    const oidcInitializationError = prOidc;
    
    // Use this to distinguish a misconfiguration from a temporary auth-server outage.
    // NOTE: below references should use `oidcInitializationError`.
    console.log(oidcInitializationError.isAuthServerLikelyDown);
    
    // Developer-only diagnostic with likely cause and fix.
    // Do not display this to end users.
    console.log(oidcInitializationError.message);
    
    alert("Our auth is down, sorry :(");
    
    // Halt the app in a typed-safe way (nothing renders until you decide otherwise).
    await new Promise(() => {});
}

export async function getOidc(){
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
        accessToken
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

