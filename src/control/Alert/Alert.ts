import ControlExtended from "geopf-extensions-openlayers/src/packages/Controls/Control.js";
import { getUid } from "../../utils/utils.js";
import "./Alert.scss";

/** Types d'alertes DSFR disponibles. */
export const AlertTypes = {
  /** Information non bloquante. */
  INFO: "info",
  /** Avertissement demandant l'attention de l'utilisateur. */
  WARNING: "warning",
  /** Erreur nécessitant une action de l'utilisateur. */
  ERROR: "error",
  /** Confirmation d'une action réussie. */
  SUCCESS: "success",
} as const;

/** Valeurs de type acceptées par une alerte DSFR. */
export type AlertType = (typeof AlertTypes)[keyof typeof AlertTypes];

export type AlertSize = "sm" | "md";

/** Surface publique d'une alerte fournie à un gestionnaire de fermeture. */
export interface AlertInstance {
  getElement(): HTMLElement;
}

type AlertAppearance = {
  /** Type DSFR de l'alerte. Incompatible avec icon. */
  type?: AlertType;
  /** Icône DSFR personnalisée. Incompatible avec type. */
  icon?: string;
};

type AlertBaseOptions = {
  /** Identifiant de l'alerte. Généré automatiquement s'il est absent. */
  id?: string;
  /** Classe CSS supplémentaire. */
  className?: string;
  /** Affiche un bouton de fermeture. */
  closable?: boolean;
  /** Libellé du bouton de fermeture. */
  closeLabel?: string;
  /** Action personnalisée au clic sur le bouton de fermeture. */
  onClick?: (event: MouseEvent, alert: AlertInstance) => void;
  /** Élément cible du contrôle. */
  target?: HTMLElement | string;
};

/** Options d'une alerte DSFR de taille moyenne. */
export type MediumAlertOptions = AlertBaseOptions &
  AlertAppearance & {
    small?: false;
    /** Obligatoire pour une alerte de taille moyenne. */
    title: string;
    description?: string;
  };

/** Options d'une alerte DSFR de petite taille. */
export type SmallAlertOptions = AlertBaseOptions &
  AlertAppearance & {
    small: true;
    title?: string;
    /** Obligatoire pour une alerte de petite taille. */
    description: string;
  };

/** Options compatibles avec le composant d'alerte DSFR. */
export type AlertOptions = MediumAlertOptions | SmallAlertOptions;

type ResolvedAlertOptions = AlertOptions & {
  id: string;
  className: string;
  closable: boolean;
  closeLabel: string;
};

/**
 * @classdesc
 * Composant d'alerte DSFR.
 * @see {@link https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/alerte | Composant Alerte DSFR}
 */
class Alert extends ControlExtended implements AlertInstance {
  // Expose les valeurs de type pour éviter les littéraux en dur côté appelant.
  static readonly TYPES = Object.freeze(AlertTypes);

  static readonly CONTAINER_ID = "alerts-container";

  private options: ResolvedAlertOptions;

  private closeButton: HTMLButtonElement | null = null;

  /**
   * Retourne le conteneur des alertes (créé à la demande).
   */
  static getContainer(): HTMLElement {
    let container = document.getElementById(Alert.CONTAINER_ID);
    if (container) {
      return container;
    }

    container = document.createElement("div");
    container.id = Alert.CONTAINER_ID;
    container.className = "alerts-container";

    (document.body.querySelector("main") ?? document.body).appendChild(
      container,
    );
    return container;
  }

  /**
   * Ajoute une alerte au conteneur global bas-gauche.
   * @param alertOrOptions Alerte ou options pour en créer une.
   * @param removeSameAlert Si vrai, retire les alertes ayant le même identifiant.
   */
  static addAlert(
    alertOrOptions: Alert | AlertOptions,
    removeSameAlert = false,
  ): Alert {
    const alert =
      alertOrOptions instanceof Alert
        ? alertOrOptions
        : new Alert(alertOrOptions);

    // Retire les alertes ayant le même id
    if (removeSameAlert === true) {
      const alerts = document.querySelectorAll(`div#${alert.getElement().id}`);
      alerts.forEach((alert) => alert.remove());
    }

    Alert.getContainer().appendChild(alert.getElement());
    return alert;
  }

  /**
   * Supprime la dernière alerte ajoutée au conteneur.
   */
  static removeLastAlert(): boolean {
    const container = document.getElementById(Alert.CONTAINER_ID);
    if (!container || !container.lastElementChild) {
      return false;
    }

    container.removeChild(container.lastElementChild);
    return true;
  }

  /**
   * Supprime une alerte via son identifiant.
   * @param id Identifiant de l'alerte à supprimer.
   */
  static removeAlert(id: string): boolean {
    if (!id) {
      return false;
    }

    const alertElement = document.getElementById(id);
    if (!alertElement || !alertElement.parentNode) {
      return false;
    }

    alertElement.parentNode.removeChild(alertElement);
    return true;
  }

  /**
   * @param options Options de l'alerte.
   */
  constructor(options: AlertOptions) {
    Alert.validateOptions(options);
    const element = document.createElement("div");

    // Initialise notamment `this.element`
    super({
      element: element,
      target: options.target,
    });

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param options Options de l'alerte.
   */
  protected override _initialize(options: AlertOptions): void {
    const alertId = options?.id || getUid("alert", this.element);

    this.options = {
      id: alertId,
      className: "",
      closable: true,
      closeLabel: "Masquer le message",
      ...options,
    } as ResolvedAlertOptions;
  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param options Options de l'alerte.
   */
  protected override _initContainer(options: AlertOptions): void {
    void options;
    // Récupère les paramètres utiles
    const {
      className,
      id,
      type,
      icon,
      title,
      small,
      description,
      closable = true,
      closeLabel = "Masquer le message",
      onClick,
    } = this.options;

    this.element.className = className;
    this.element.id = id;
    this.element.classList.add("fr-alert");
    this.closeButton = null;

    if (type) {
      // Classe DSFR correspondant à l'alerte
      this.element.classList.add(`fr-alert--${type}`);
    }

    if (small) {
      this.element.classList.add("fr-alert--sm");
    }

    if (type) {
      // Rôle ARIA pour alertes ajoutées dynamiquement (reco DSFR).
      this.element.setAttribute("role", this.getAriaRole(type));
    } else {
      this.element.removeAttribute("role");
    }

    this.element.innerHTML = "";

    if (!type && icon) {
      // Icône DSFR ajoutée seulement si pas de type d'alerte
      this.element.classList.add(icon);
    }

    // Ajout du titre
    if (title) {
      const titleElement = document.createElement("h3");
      titleElement.classList.add("fr-alert__title");
      titleElement.textContent = title;
      this.element.appendChild(titleElement);
    }

    // Ajout de la description
    if (description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = description;
      this.element.appendChild(descriptionElement);
    }

    if (closable) {
      this.closeButton = document.createElement("button");
      this.closeButton.type = "button";
      this.closeButton.classList.add("fr-btn--close", "fr-btn");
      this.closeButton.title = closeLabel;
      this.closeButton.textContent = closeLabel;

      if (typeof onClick === "function") {
        // Fonction de fermeture personnalisée.
        this.closeButton.onclick = (event: MouseEvent) => {
          onClick(event, this);
        };
      } else {
        // Supression directe de l'alerte dans le DOM.
        this.closeButton.onclick = () => this.element.remove();
      }

      this.element.appendChild(this.closeButton);
    }
  }

  /**
   * Retourne l'élément principal du contrôle.
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * @param type Type de l'alerte.
   * @returns Rôle ARIA correspondant.
   */
  getAriaRole(type: AlertType | undefined): "alert" | "status" {
    if (type === Alert.TYPES.ERROR || type === Alert.TYPES.WARNING) {
      return "alert";
    }
    return "status";
  }

  /**
   * Vérifie les options et renvoie des erreurs si besoin
   * @param options Options du constructeur
   */
  private static validateOptions(options: AlertOptions): void {
    const rawOptions = options as AlertOptions & { icon?: string };

    if (rawOptions.type && rawOptions.icon) {
      throw new Error(
        "Une alerte DSFR ne peut pas définir simultanément type et icon.",
      );
    }

    if (rawOptions.small) {
      if (!rawOptions.description) {
        throw new Error(
          "La description est obligatoire pour une alerte DSFR de taille sm.",
        );
      }
    } else if (!rawOptions.title) {
      throw new Error(
        "Le titre est obligatoire pour une alerte DSFR de taille md.",
      );
    }
  }
}

export default Alert;
