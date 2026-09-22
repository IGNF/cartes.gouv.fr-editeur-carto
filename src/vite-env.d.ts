interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly API_URL: string
  readonly IAM_URL: string
  readonly IAM_REALM: string
  readonly IAM_CLIENT_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Pour éviter les erreurs typescripts
interface DashboardEditeurEnv {
    readonly iamUrl?: string;
    readonly iamRealm?: string;
    readonly iamClientId?: string;
    readonly apiUrl?: string;
}

interface Window {
    readonly __DASHBOARD_EDITEUR_ENV?: DashboardEditeurEnv;
}
