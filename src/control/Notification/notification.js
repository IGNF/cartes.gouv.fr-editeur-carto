import Notification from 'ol-ext/control/Notification.js'
import "./notification.css";

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
    switch (type) {
      case 'success': 
      case 'error': 
      case 'warning': {
        this.element.querySelector('div').className  = 'fr-icon-' + type + '-fill';
        break;
      }
      case 'info':
      default: {
        this.element.querySelector('div').className  = 'fr-icon-info-fill';
        break;
      }

    }
    // Always show
    const span = document.createElement('span');
    span.textContent = what;
    this.show(span, duration || this.get('duration'));

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
    close.className = 'gpf-btn fr-btn fr-btn--tertiary-no-outline fr-icon-close-line gpf-notification-close';
    notification.contentElement.appendChild(close);
    close.addEventListener('click', () => this.hide());
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