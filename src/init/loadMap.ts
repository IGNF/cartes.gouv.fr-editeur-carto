import { api } from "../api";
import Alert from "../control/Alert/Alert";
import { getOidc } from "../oidc";
import { carte } from "../story";
import { setInert, unsetInert } from "../utils/inert";

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

const params = new URLSearchParams(window.location.search) as TypedSearchParams;
const editId = params.get("edit");

// On récupère la carte si l'utilisateur a les droits
if (editId) {
    setInert(carte);
    Alert.addAlert(
        {
            type: Alert.TYPES.INFO,
            id: "alert--loading",
            description: "Carte en cours de chargement",
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
                            type: Alert.TYPES.SUCCESS,
                            id: "alert--load-success",
                            description: "Carte chargée avec succès",
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
                    type: Alert.TYPES.ERROR,
                    id: "alert--load-error",
                    title: "Une erreur est survenue",
                    description: `Impossible de charger la carte dont l'id est "${editId}". Veuillez réessayer plus tard`,
                },
                true
            );
        })
        // Réactive les interactions avec la carte
        .finally(() => unsetInert(carte));
} else {
    carte.read(`${import.meta.env.BASE_URL}${import.meta.env.BASE_URL.endsWith("/") ? "" : "/"}carte/template.carte`);
}
