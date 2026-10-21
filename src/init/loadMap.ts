import { api } from "../api";
import Alert from "../control/Alert/Alert";
import introDialog from "../dialogs/introDialog";
import { getOidc } from "../oidc";
import { carte } from "../story";
import { setInert, unsetInert } from "../utils/inert";
import i18next from "../i18n/index";

export type SearchParams = {
    /** Id de la carte */
    edit?: string;
};

// Pour activer le typage forcé dans VsCode
type TypedSearchParams = Omit<URLSearchParams, "get" | "has" | "getAll"> & {
    get(name: keyof SearchParams): string | null;
    has(name: keyof SearchParams): boolean;
    getAll(name: keyof SearchParams): string[];
};

export function loadMap() {
    const params = new URLSearchParams(window.location.search) as TypedSearchParams;
    const editId = params.get("edit");

    // On récupère la carte si l'utilisateur a les droits
    if (editId) {
        setInert(carte);
        Alert.addAlert(
            {
                closeLabel: i18next.t("notifications:dismiss"),
                type: Alert.TYPES.INFO,
                id: "alert--loading",
                description: i18next.t("notifications:map.loading"),
                small: true,
            },
            true
        );
        getOidc()
            .then(async () => {
                const { data: metadata, status: metadataStatus } = await api.map.getMapEditByEditId(editId);
                const { data: map, status } = await api.map.getMapFileByEditId(editId);
                if (metadataStatus !== 200) {
                    console.error(`Erreur récupération métadonnée carte: ${status}`);
                    throw new Error(metadata.message);
                } else if (status !== 200) {
                    console.error(`Erreur récupération fichier carte : ${status}`);
                    throw new Error(map.message);
                } else {
                    // La carte et ses métadonnées ont pu être chargée
                    // @ts-ignore car les propriétés once etc. sont mal gérées avec mcutils
                    carte.once("read", () => {
                        // Ajoute les métadonnées
                        carte.set("id", metadata.view_id);
                        carte.set("atlas", metadata);

                        Alert.addAlert(
                            {
                                closeLabel: i18next.t("notifications:dismiss"),
                                type: Alert.TYPES.SUCCESS,
                                id: "alert--load-success",
                                description: i18next.t("notifications:map.loadSuccess"),
                                small: true,
                            },
                            true
                        );
                        carte.dispatchEvent("save");
                    });
                    carte.read(map);
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.addAlert(
                    {
                        closeLabel: i18next.t("notifications:dismiss"),
                        type: Alert.TYPES.ERROR,
                        id: "alert--load-error",
                        title: i18next.t("notifications:map.requestError"),
                        description: i18next.t("notifications:map.loadError", {
                            id: editId,
                            interpolation: { escapeValue: false },
                        }),
                    },
                    true
                );
            })
            // Réactive les interactions avec la carte
            .finally(() => {
                // Si le dialogue est fermé, on rend la carte interactive
                introDialog.isOpen() ?? unsetInert(carte);
            });
    } else {
        carte.read(`${import.meta.env.BASE_URL}${import.meta.env.BASE_URL.endsWith("/") ? "" : "/"}carte/template.carte`);
    }
}
