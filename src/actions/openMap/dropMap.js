import i18next from "../../i18n/i18n";
import carte from "../../carte.js";
import * as importLocal from "../importLocal/importLocal.js";
import Alert from "../../control/Alert/Alert";

import "./dropMap.css";
import getUid from "mcutils/format/layer/getUid";

// Drop zone
let dragtout;
const dropZone = document.body.querySelector('[data-role="map"]') || document.body.querySelector('[data-role="storymap"]');

// Show drop zone on file drag
["dragenter", "dragover"].forEach((evt) => {
    dropZone.addEventListener(evt, () => {
        clearTimeout(dragtout);
        dropZone.dataset.drop = "";
    });
});
// Remove drop zone on leave
dropZone.addEventListener("dragleave", () => {
    dragtout = setTimeout(() => delete dropZone.dataset.drop, 100);
});
dropZone.addEventListener("dragend", () => {
    delete dropZone.dataset.drop;
});

// Drop files
dropZone.addEventListener("drop", (e) => {
    if (e.target.type !== "file") e.preventDefault();
    delete dropZone.dataset.drop;
    const files = e.dataTransfer.files;
    if (files.length) {
        setTimeout(() => loadFiles([...files]), 200);
    }
});

// Prevent drop on document (but input:file)
["dragover", "drop"].forEach((evt) => {
    window.addEventListener(evt, (e) => {
        if (e.target.tagName !== "INPUT" || e.target.type !== "file") {
            e.preventDefault();
        }
    });
});

/** Load file on drop
 * @param {FileList} files
 */
async function loadFiles(files) {
    const file = files.pop();
    if (!file) return;
    // Only .carte files
    if (file.name.endsWith(".carte")) {
        const reader = new FileReader();
        // Load carte
        reader.onload = function () {
            const json = JSON.parse(reader.result);
            carte.read(json);
        };
        // Error handler : corrupted file content, etc ... : do not add it to the map
        reader.addEventListener("error", () => {
            console.error(`Error occurred reading file: ${file.name}`);
        });
        // read
        reader.readAsText(file);
    } else {
        // Test chargement
        try {
            console.log("Trying to import file:", file);
            if (importLocal.checkFile(file)) {
                const promises = await importLocal.importFile(file);

                promises.forEach((promise) => {
                    if (promise.status === "fulfilled") {
                        const layer = promise.value;
                        if (layer.getSource().getFeatures().length) {
                            carte.addLayer(layer);
                            Alert.addAlert(
                                {
                                    closeLabel: i18next.t("notifications:dismiss"),
                                    type: Alert.TYPES.SUCCESS,
                                    id: "alert--drop-success-" + getUid(),
                                    description: i18next.t("actions:import-local.layerAdded", {
                                        title: layer.get("title"),
                                        interpolation: { escapeValue: false },
                                    }),
                                    small: true,
                                },
                                true
                            );
                        } else {
                            Alert.addAlert(
                                {
                                    closeLabel: i18next.t("notifications:dismiss"),
                                    type: Alert.TYPES.WARNING,
                                    id: "alert--drop-warning-" + getUid(),
                                    description: i18next.t("actions:import-local.emptyLayer", {
                                        title: layer.get("title"),
                                        interpolation: { escapeValue: false },
                                    }),
                                    small: true,
                                },
                                true
                            );
                        }
                    } else {
                        //handleError(promise.reason, form, file, true);
                        Alert.addAlert(
                            {
                                closeLabel: i18next.t("notifications:dismiss"),
                                type: Alert.TYPES.ERROR,
                                id: "alert--drop-error-" + getUid(),
                                description: i18next.t("actions:import-local.importFailed", {
                                    title: file.name,
                                    interpolation: { escapeValue: false },
                                }),
                                small: true,
                            },
                            true
                        );
                    }
                });
                loadFiles(files);
            }
        } catch (err) {
            if (err) {
                Alert.addAlert(
                    {
                        closeLabel: i18next.t("notifications:dismiss"),
                        type: Alert.TYPES.ERROR,
                        id: "alert--drop-error-" + getUid(),
                        description: i18next.t("actions:import-local.importFailed", {
                            title: file.name,
                            interpolation: { escapeValue: false },
                        }),
                        small: true,
                    },
                    true
                );
            }
            loadFiles(files);
        }
    }
}
