/** Déclinaisons disponibles pour un bandeau d'information importante. */
export const NoticeTypes = {
    INFO: "info",
    WARNING: "warning",
    ALERT: "alert",
    WEATHER_ORANGE: "weather-orange",
    WEATHER_RED: "weather-red",
    WEATHER_PURPLE: "weather-purple",
    ATTACK: "attack",
    KIDNAPPING: "kidnapping",
    WITNESS: "witness",
    CYBERATTACK: "cyberattack",
} as const;

export type NoticeType = (typeof NoticeTypes)[keyof typeof NoticeTypes];

type StandardNoticeType = typeof NoticeTypes.INFO | typeof NoticeTypes.WARNING | typeof NoticeTypes.ALERT;

type RestrictedIconNoticeType =
    | typeof NoticeTypes.WEATHER_ORANGE
    | typeof NoticeTypes.WEATHER_RED
    | typeof NoticeTypes.WEATHER_PURPLE
    | typeof NoticeTypes.ATTACK
    | typeof NoticeTypes.KIDNAPPING
    | typeof NoticeTypes.WITNESS
    | typeof NoticeTypes.CYBERATTACK;

export type NoticeLinkOptions = {
    href: string;
    label: string;
    title?: string;
    target?: string;
    rel?: string;
};

type NoticeBaseOptions = {
    /** Titre obligatoire du bandeau. */
    title: string;
    description?: string;
    link?: NoticeLinkOptions;
    /** Affiche l'icône DSFR. Par défaut : true. */
    iconDisplayed?: boolean;
    /** Niveau du titre ou paragraphe lorsque le contexte ne permet pas un titre. */
    titleLevel?: 2 | 3 | 4 | 5 | 6 | "p";
    className?: string;
    /** Ajoute le bouton de fermeture DSFR. */
    closable?: boolean;
    closeLabel?: string;
};

export type NoticeOptions = NoticeBaseOptions &
    ({ type?: StandardNoticeType; iconDisplayed?: boolean } | { type: RestrictedIconNoticeType; iconDisplayed?: true });

const NOTICE_CLASSES: Record<NoticeType, string> = {
    [NoticeTypes.INFO]: "info",
    [NoticeTypes.WARNING]: "warning",
    [NoticeTypes.ALERT]: "alert",
    [NoticeTypes.WEATHER_ORANGE]: "weather-orange",
    [NoticeTypes.WEATHER_RED]: "weather-red",
    [NoticeTypes.WEATHER_PURPLE]: "weather-purple",
    [NoticeTypes.ATTACK]: "attack",
    [NoticeTypes.KIDNAPPING]: "kidnapping",
    [NoticeTypes.WITNESS]: "witness",
    [NoticeTypes.CYBERATTACK]: "cyberattack",
};

/** Fabrique le HTML d'un bandeau d'information importante DSFR. */
class Notice {
    static readonly TYPES = Object.freeze(NoticeTypes);

    private constructor() {}

    /** Retourne le HTML DSFR complet du bandeau, sans l'insérer dans la page. */
    static createNotice(options: NoticeOptions): HTMLDivElement {
        if (!options?.title?.trim()) {
            throw new Error("Le titre est obligatoire pour une notice DSFR.");
        }

        // Type de bandeau
        const type = options.type ?? NoticeTypes.INFO;
        const notice = document.createElement("div");
        notice.classList.add("fr-notice", `fr-notice--${NOTICE_CLASSES[type]}`);

        // L'icône peut être enlevée seulement sur les bandeaux "classiques"
        if (options.iconDisplayed === false && (type === NoticeTypes.WARNING || type === NoticeTypes.ALERT || type === NoticeTypes.INFO)) {
            notice.classList.add("fr-notice--no-icon");
        }

        options.className
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .forEach((className) => notice.classList.add(className));

        // La notice est ajoutée dynamiquement : on ajoute un rôle
        if (
            type === NoticeTypes.WARNING ||
            type === NoticeTypes.ALERT ||
            type.startsWith("weather-") ||
            type === NoticeTypes.ATTACK ||
            type === NoticeTypes.WITNESS ||
            type === NoticeTypes.CYBERATTACK
        ) {
            notice.setAttribute("role", "alert");
        } else {
            notice.setAttribute("role", "status");
        }

        // Construction du DOM
        const container = document.createElement("div");
        container.classList.add("fr-container");
        const body = document.createElement("div");
        body.classList.add("fr-notice__body");
        const content = document.createElement("div");
        const titleTag = options.titleLevel === "p" ? "p" : `h${options.titleLevel ?? 2}`;
        const titleElement = document.createElement(titleTag);
        titleElement.classList.add("fr-notice__title");
        titleElement.textContent = options.title;
        content.appendChild(titleElement);

        // Description du bandeau
        if (options.description) {
            const description = document.createElement("p");
            description.classList.add("fr-notice__desc");
            description.textContent = options.description;
            content.appendChild(description);
        }

        // Ajout d'un lien
        if (options.link) {
            const link = document.createElement("a");
            link.classList.add("fr-notice__link");
            link.href = options.link.href;
            link.textContent = options.link.label;
            if (options.link.title) {
                link.title = options.link.title;
            }
            if (options.link.target) {
                link.target = options.link.target;
            }
            if (options.link.rel) {
                link.rel = options.link.rel;
            } else if (link.target === "_blank") {
                link.rel = "noopener external";
            }
            content.appendChild(link);
        }

        body.appendChild(content);

        // Permet de fermer la notice
        if (options.closable) {
            const closeLabel = options.closeLabel ?? "Masquer le message";
            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.classList.add("fr-btn--close", "fr-btn");
            closeButton.title = closeLabel;
            closeButton.textContent = closeLabel;
            closeButton.setAttribute("onclick", "const notice = this.parentNode.parentNode.parentNode; notice.parentNode.removeChild(notice)");
            body.appendChild(closeButton);
        }

        container.appendChild(body);
        notice.appendChild(container);
        return notice;
    }
}

export default Notice;
