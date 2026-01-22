import Notification from 'ol-ext/control/Notification'
import "./notification.css";

class NotificationExtended extends Notification {
  constructor(options) {
    options = options || {};
    options.className = (options.className ? options.className + ' ' : '') + 'gpf-notification';
    super(options);
    this.element.classList.remove('ol-control');
  }

  _show(type, what, cancelFn, duration) {
    switch (type) {
      case 'success': {
        this.element.querySelector('div').className  = 'fr-icon-success-fill';
        break;
      }
      case 'error': {
        this.element.querySelector('div').className  = 'fr-icon-error-fill';
        break;
      }
      case 'warning': {
        this.element.querySelector('div').className  = 'fr-icon-warning-fill';
        break;
      }
      case 'info':
      default: {
        this.element.querySelector('div').className  = 'fr-icon-info-fill';
        break;
      }

    }
    // Always show
    this.show(what, duration);
    // Cancel button
    if (cancelFn) {
      const btn = document.createElement('button');
      btn.textContent = 'Annuler';
      btn.type = 'button';
      btn.className = 'gpf-btn fr-btn gpf-btn--tertiary fr-btn--tertiary';
      notification.contentElement.appendChild(btn);
      btn.addEventListener('click', cancelFn);
    }
    // Close button
    const close = document.createElement('button');
    close.textContent = 'close';

    close.type = 'button';
    close.className = 'gpf-btn fr-btn gpf-btn--tertiary fr-btn--tertiary fr-icon-close-line gpf-notification-close';
    notification.contentElement.appendChild(close);
    close.addEventListener('click', () => this.hide());
  }

  info(what, cancelFn, duration) {
    this._show('info', what, cancelFn, duration);
  }

  warning(what, cancelFn, duration) {
    this._show('warning', what, cancelFn, duration);
  }

  error(what, cancelFn, duration) {
    this._show('error', what, cancelFn, duration);
  }
};

const notification = new NotificationExtended();

export default notification;