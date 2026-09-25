import { viewerURL } from "../env"

/**
 * Retourne l'URL de la carte à voir
 * @param id Id de la carte à voir
 */
export const getViewURL = (id: string): string => {
  return `${viewerURL}${viewerURL.endsWith("/") ? "" : "/"}?map=${id}`;
}
