import i18next from "./index";
import type controlsFr from "./locales/fr/controls.json";

export type ControlLabels = typeof controlsFr.ui & {
    add: string;
    apply: string;
    save: string;
    search: string;
    cancel: string;
    validate: string;
};

/** Fournit les libellés traduits aux contrôles, qui conservent leurs valeurs par défaut. */
export function getControlLabels(): ControlLabels {
    return {
        ...i18next.t<string, { returnObjects: true }, typeof controlsFr.ui>("controls:ui", { returnObjects: true }),
        add: i18next.t("common:add"),
        apply: i18next.t("common:apply"),
        save: i18next.t("common:save"),
        search: i18next.t("common:search"),
        cancel: i18next.t("common:cancel"),
        validate: i18next.t("common:validate"),
    };
}
