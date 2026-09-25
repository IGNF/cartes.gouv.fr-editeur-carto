import { viewerURL } from "../env"

/**
 * Retourne l'URL de la carte à voir
 * @param id Id de la carte à voir
 */
export const getViewURL = (id: string): string => {
  // Fin du lien
  const end = `${viewerURL.endsWith("/") ? "" : "/"}?map=${id}`;
  if (viewerURL.startsWith("http")) {
    // Chemin absolu
    return `${viewerURL}${end}`;
  } else {
    return new URL(viewerURL + end, window.location.href).toString();
  }
}
