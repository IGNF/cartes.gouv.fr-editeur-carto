import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';
import getUid from '../../utils/getUid.js';

/** Header */
class Header extends BaseObject {
  constructor() {
    super()
    const header = document.querySelector('header') || ol_ext_element.create('HEADER', {
      role: 'banner',
      className: 'fr-header fr-header--compact',
      parent: document.body
    });
    this.element = header;
    // Wrapper
    const wrapper = ol_ext_element.create('DIV', {
      className: 'fr-container--fluid',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-header__body',
        parent: header
      })
    })
    this.wrapper = wrapper
    const hbody = ol_ext_element.create('DIV', {
      className: 'fr-header__body-row',
      parent: wrapper
    });

    // Title / logo
    const brand = ol_ext_element.create('DIV', {
      className: 'fr-header__brand fr-enlarge-link',
      html: ol_ext_element.create('DIV', {
        className: 'fr-header__brand-top'
      }),
      parent: hbody
    })
    ol_ext_element.create('DIV', {
      className: 'fr-header__logo',
      html: '<p class="fr-logo"></p>',
      parent: brand
    })
    this.title = ol_ext_element.create('A', {
      href: '/',
      html: '<p class="fr-header__service-title"></p>',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-header__service',
        parent: brand
      })
    })

    // Tools
    this.tools = ol_ext_element.create('DIV', {
      className: 'fr-header__tools-links',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-header__tools',
        parent: hbody
      }),
    })
    // Nav button
    const idmodal = getUid('modal')

    this.navButton = ol_ext_element.create('BUTTON', {
      id: getUid('button'),
      className: 'fr-btn--menu fr-btn',
      title: 'Menu',
      type: 'button',
      'data-fr-opened': 'false',
      'aria-controls': idmodal,
      parent: ol_ext_element.create('DIV', {
        className: 'fr-header__navbar',
        parent: brand
      })
    })
    // Modal
    const container = ol_ext_element.create('DIV', {
      className: 'fr-container',
      parent:
        ol_ext_element.create('DIV', {
          className: 'fr-header__menu fr-modal',
          id: idmodal,
          'aria-labelledby': this.navButton.id,
          parent: header,
        })
    })
    // Close box
    ol_ext_element.create('BUTTON', {
      type: 'button',
      title: 'Fermer',
      id: getUid('button'),
      'aria-controls': idmodal,
      className: 'fr-btn--close fr-btn',
      text: 'Fermer',
      parent: container
    })
    this.links = ol_ext_element.create('DIV', {
      className: 'fr-header__menu-links',
      parent: container
    })
    this.footer = ol_ext_element.create('DIV', {
      className: 'fr-header__menu-footer',
      html: '<div class="footer-links"></div>',
      parent: container
    })
  }
  /** Set service information
   * @param {Object} options
   *  @param {string} [options.service] service name
   *  @param {string} [options.title]
   *  @param {string} [options.href] main page url
   */
  setService(options) {
    if (options.service) {
      this.title.querySelector('p').innerHTML = options.service
    }
    ['title', 'href'].forEach(k => {
      if (options[k]) {
        this.title.setAttribute(k, options[k])
      }
    })
  }
}

export default Header;
