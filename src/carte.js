// Ma Carte
import { carte } from "./story.js";

import ModifyingInteraction from "geopf-extensions-openlayers/src/packages/Interactions/Modifying.js";
import switcher from "./mcutils/layerSwitcher.js";
import notification from "./control/Notification/notification.js";
import i18next from "./i18n/index";
import "./mcutils/Feature.js";

// Only one selction when editing features
carte.getSelect().multi_ = false;

const modify = new ModifyingInteraction({
    select: carte.getSelect(),
});
carte.getMap().addInteraction(modify);
carte._interactions.modify = modify;

carte.getMap().addControl(notification);

// Copy/paste feature with Ctrl+C / Ctrl+V
modify.on(["cut", "delete"], (e) => {
    const features = e.features || e.deleted;
    // undo notification
    notification.info(i18next.t("notifications:map.deleted", { count: features.length }), () => {
        notification.hide();
        features.forEach((f) => {
            f.layer.getSource().addFeature(f.feature);
        });
    });
});

// Paste feature with Ctrl+V
modify.on(["paste"], (e) => {
    const features = [];
    const layer = switcher.getSelectedLayer();
    // Check layer
    if (!layer || layer.get("type") !== "Vector") {
        notification.warning(i18next.t("notifications:map.layerCannotAddFeatures"), () => {});
        return;
    }
    // copy features
    e.features.forEach((f) => {
        const feature = f.feature.clone();
        features.push({ layer: layer, feature: feature });
        layer.getSource().addFeature(feature);
    });
    // undo notification
    const info = i18next.t("notifications:map.copied", { count: features.length });
    notification.info(info, () => {
        notification.hide();
        features.forEach((f) => {
            f.layer.getSource().removeFeature(f.feature);
        });
    });
});

// Duplicate feature
modify.on(["duplicate"], (e) => {
    const features = e.features || [];
    // undo notification
    const info = i18next.t("notifications:map.copied", { count: features.length });
    notification.info(info, () => {
        notification.hide();
        features.forEach((f) => {
            f.layer.getSource().removeFeature(f.feature);
        });
    });
});

export { notification };
export default carte;
