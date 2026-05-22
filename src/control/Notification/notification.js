import Notification from 'ol-ext/control/Notification.js'
import "./notification.scss";

class NotificationExtended extends Notification {
  constructor(options) {
    options = options || {};
    options.className = (options.className ? options.className + ' ' : '') + 'gpf-notification';
    // Call parent constructor
    super(options);
    this.element.classList.remove('ol-control');
    // Default duration for notifications
    this.set('duration', options.duration || 6000);

    // Prevent hide on mouse enter and resume on mouse leave
    this.element.addEventListener("mouseenter", () => {
      if (this._listener) {
        clearTimeout(this._listener);
        this._listener = null;
      }
    });
    this.element.addEventListener("mouseleave", () => {
      this._listener = setTimeout(() => {
        this.element.classList.add('ol-collapsed');
        this._listener = null;
      }, 3000);
    });
  }

  /**
   * Display a notification on the map with specific type and optional cancel function  
   * @param {string} type 
   * @param {string} what 
   * @param {function} [cancelFn] do something when cancel button is clicked
   * @param {Number} [duration] duration in ms, if -1 never hide, default duration
   */
  _show(type, what, cancelFn, duration) {
    // Contenu toujours affiché
    const divContent = document.createElement('div');
    divContent.className = "info-container";

    // Icône
    const spanIcon = document.createElement('span');
    spanIcon.ariaHidden = true;
    switch (type) {
      case 'success':
      case 'error':
      case 'warning': {
        spanIcon.className = 'fr-icon-' + type + '-fill';
        divContent.classList.add(`notification--${type}`);
        break;
      }
      case 'info':
      default: {
        spanIcon.className = 'fr-icon-info-fill';
        divContent.classList.add(`notification--info`);
        break;
      }
    }


    // Contenu texte
    const content = document.createElement('span');
    content.textContent = what;

    divContent.appendChild(spanIcon);
    divContent.appendChild(content);

    // Affiche toujours à minima cela
    this.show(divContent, duration || this.get('duration'));

    // Boutons d'actions
    const btnGroup = document.createElement('div');
    btnGroup.className = "buttons-group";

    // Bouton annuler
    if (cancelFn) {
      const btn = document.createElement('button');
      btn.textContent = 'Annuler';
      btn.type = 'button';
      btn.className = 'gpf-btn fr-btn gpf-btn--tertiary fr-btn--tertiary';
      btnGroup.appendChild(btn);
      btn.addEventListener('click', cancelFn);
    }
    // Bouton de fermeture
    const close = document.createElement('button');
    close.textContent = 'close';
    close.type = 'button';
    close.className = 'gpf-btn fr-btn fr-btn--tertiary-no-outline fr-icon-close-line gpf-notification-close';
    btnGroup.appendChild(close);
    close.addEventListener('click', () => this.hide());
    notification.contentElement.appendChild(btnGroup)
  }

  info(what, cancelFn, duration) {
    this._show('info', what, cancelFn, duration || this.get('duration'));
  }

  warning(what, cancelFn, duration) {
    this._show('warning', what, cancelFn, duration || this.get('duration'));
  }

  error(what, cancelFn, duration) {
    this._show('error', what, cancelFn, duration || this.get('duration'));
  }
};

const notification = new NotificationExtended();

export default notification;