export const env = import.meta.env

const dashboardEnv: DashboardEditeurEnv = (typeof window !== "undefined" && window.__DASHBOARD_EDITEUR_ENV) || {};

// Expose les variables d'environnement (permet de les surcharger au déploiement)
export const apiURL = dashboardEnv.apiUrl ?? env.API_URL ?? "";
export const viewerURL = dashboardEnv.viewerUrl ?? env.VIEWER_URL ?? "";
export const redirectUri = dashboardEnv.redirectUri ?? env.REDIRECT_URI ?? "";
export const iamClientId = dashboardEnv.iamClientId ?? env.IAM_CLIENT_ID ?? "";
export const iamRealm = dashboardEnv.iamRealm ?? env.IAM_REALM ?? "";
export const iamUrl = dashboardEnv.iamUrl ?? env.IAM_URL ?? "";
