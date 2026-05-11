import ControlExtended from 'geopf-extensions-openlayers/src/packages/Controls/Control';
import { getUid } from '../../utils/utils.js';
import './Alert.scss';

/**
 * @readonly Types d'alertes DSFR
 * @see {@link https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/alerte/code-de-l-alerte#declinaisons-d-alertes | Déclinaisons d'alertes - Alerte DSFR}
 * @enum {string}
 */
const AlertType = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

/**
 * @typedef {Object} AlertOptions
 * @property {string} [id] Identifiant de l'alerte. Généré automatiquement si absent.
 * @property {string} [className] Classe css supplémentaire.
 * @property {AlertType} [type] Type d'alerte.
 * @property {string} [icon] Icône DSFR (si pas de type d'alerte).
 * @property {'sm'|'md'} [size='md'] Taille de l'alerte.
 * @property {string} [title] Titre de l'alerte (obligatoire si size="md").
 * @property {string} [description] Description de l'alerte (obligatoire si size="sm").
 * @property {boolean} [closable=true] Affiche un bouton de fermeture.
 * @property {string} [closeLabel='Masquer le message'] Libellé du bouton de fermeture.
 * @property {(event: MouseEvent, alert: Alert) => void} [onClick] Callback personnalisé au clic sur le bouton de fermeture.
 * Par défaut, ferme l'alerte.
 * @property {HTMLElement|string} [target] Élément cible sur lequel ajouter le contrôle.
 */

/**
 * @classdesc
 * Composant d'alerte DSFR.
 * @see {@link https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/alerte | Composant Alerte DSFR}
 */
class Alert extends ControlExtended {
  // Expose les valeurs de type pour éviter les littéraux en dur côté appelant.
  static TYPES = Object.freeze(AlertType);

  static CONTAINER_ID = 'alerts-container';

  /**
   * Retourne le conteneur des alertes (créé à la demande).
   * @returns {HTMLElement}
   */
  static getContainer() {
    let container = document.getElementById(Alert.CONTAINER_ID);
    if (container) {
      return container;
    }

    container = document.createElement('div');
    container.id = Alert.CONTAINER_ID;
    container.className = 'alerts-container';

    document.body.querySelector('main').appendChild(container);
    return container;
  }

  /**
   * Ajoute une alerte au conteneur global bas-gauche.
   * @param {Alert|AlertOptions} alertOrOptions Alerte ou options pour en créer une
   * @param {Boolean} [removeSameAlert=false] Si vrai, retire les ayant le même id.
   * @returns {Alert}
   */
  static addAlert(alertOrOptions, removeSameAlert = false) {
    const alert = alertOrOptions instanceof Alert
      ? alertOrOptions
      : new Alert(alertOrOptions || {});
    
    // Retire les alertes ayant le même id
    if (removeSameAlert === true) {
      const alerts = document.querySelectorAll(`div#${alert.getElement().id}`);
      alerts.forEach(alert => alert.remove());
    }

    Alert.getContainer().appendChild(alert.getElement());
    return alert;
  }

  /**
   * Supprime la dernière alerte ajoutée au conteneur.
   * @returns {boolean}
   */
  static removeLastAlert() {
    const container = document.getElementById(Alert.CONTAINER_ID);
    if (!container || !container.lastElementChild) {
      return false;
    }

    container.removeChild(container.lastElementChild);
    return true;
  }

  /**
   * Supprime une alerte via son identifiant.
   * @param {string} id
   * @returns {boolean}
   */
  static removeAlert(id) {
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
   * @param {AlertOptions} options Options du constructeur
   */
  constructor(options) {
    const opts = options || {};
    const element = document.createElement('div');

    // Initialise notamment `this.element`
    super({
      element: element,
      target: opts.target,
    });

    this._initialize(opts);
    this._initContainer(opts);
    this._initEvents(opts);
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param {AlertOptions} options
   */
  _initialize(options) {
    const alertId = options?.id || getUid('alert', this.element);

    this.options = {
      id: alertId,
      className: '',
      type: undefined,
      size: 'md',
      title: undefined,
      description: undefined,
      closable: true,
      closeLabel: 'Masquer le message',
      ...options,
    };

  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param {AlertOptions} options
   */
  _initContainer(options) {
    // Récupère les paramètres utiles
    const {
      className,
      id,
      type,
      icon,
      title,
      size,
      description,
      closable = true,
      closeLabel = 'Masquer le message',
      onClick,
    } = this.options;

    // Création de l'élément principal
    this.element.className = className;
    this.element.id = id;
    this.element.classList.add('fr-alert');
    this.closeButton = null;

    if (type) {
      // Classe DSFR correspondant à l'alerte
      this.element.classList.add(`fr-alert--${type}`);
    }

    if (size === 'sm') {
      this.element.classList.add('fr-alert--sm');
    }

    if (type) {
      // Rôle ARIA pour alertes ajoutées dynamiquement (reco DSFR).
      this.element.setAttribute('role', this.getAriaRole(type));
    } else {
      this.element.removeAttribute('role');
    }

    this.element.innerHTML = '';

    if (!type && icon) {
      // Icône DSFR ajoutée seulement si pas de type d'alerte
      this.element.classList.add(icon);
    }

    // Ajout du titre
    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.classList.add('fr-alert__title');
      titleElement.textContent = title;
      this.element.appendChild(titleElement);
    }

    // Ajout de la description
    if (description) {
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = description;
      this.element.appendChild(descriptionElement);
    }

    if (closable) {
      this.closeButton = document.createElement('button');
      this.closeButton.type = 'button';
      this.closeButton.classList.add('fr-btn--close', 'fr-btn');
      this.closeButton.title = closeLabel;
      this.closeButton.textContent = closeLabel;

      if (typeof onClick === 'function') {
        // Fonction de fermeture personnalisée.
        this.closeButton.onclick = (event) => {
          onClick(event, this);
        };
      } else {
        const onclick = function () {
          const alert = this.parentNode;
          alert.parentNode.removeChild(alert)
        }
        // Supression directe de l'alerte dans le DOM.
        this.closeButton.onclick = onclick;
      }

      this.element.appendChild(this.closeButton);
    }
  }

  /**
   * Retourne l'élément principale du contrôle
   * @returns {HTMLElement} Élément principal du contrôle
   */
  getElement() {
    return this.element;
  }

  /**
   * @param {AlertType | undefined} type
   * @returns {'alert'|'status'}
   */
  getAriaRole(type) {
    if (type === Alert.TYPES.ERROR || type === Alert.TYPES.WARNING) {
      return 'alert';
    }
    return 'status';
  }
}

export default Alert;