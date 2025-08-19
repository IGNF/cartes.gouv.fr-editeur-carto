import ol_ext_element from 'ol-ext/util/element'

import { Menu, getUid } from './utils';


// DSFR
import 'dsfrign/dist/core/core.module.min.js';
import 'dsfrign/dist/component/header/header.module.min.js';
import 'dsfrign/dist/component/navigation/navigation.module.min.js';
import 'dsfrign/dist/component/button/button.module.min.js';
import 'dsfrign/dist/component/modal/modal.module.min.js';
import "dsfrign/dist/component/display/display.module.min.js";
import "dsfrign/dist/component/password/password.module.min.js";

import 'dsfrign/dist/dsfr.min.css';
import 'dsfrign/dist/utility/icons/icons.min.css';

import './charte.scss'

/** Header */
class Header {
  constructor() {
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

class Footer {
  constructor() {
    this.element = ol_ext_element.create('FOOTER', {
      id: 'fr-footer',
      className: 'fr-footer',
      role: 'contentinfo',
      parent: document.body
    })
    // Container
    const idContain = getUid('modal')
    const containBt = ol_ext_element.create('BUTTON', {
      id: getUid('button'),
      type: 'button',
      className: 'fr-btn--close fr-btn btn-more-info',
      'aria-label': 'plus d\'informations',
      'title': 'plus d\'informations',
      'aria-expanded': 'false',
      'aria-controls': idContain,
      parent: this.element
    })
    containBt.addEventListener('click', () => {
      const expanded = containBt.getAttribute('aria-expanded') === 'true'
      containBt.setAttribute('aria-expanded', !expanded);
      containBt.setAttribute('aria-label', expanded ? 'plus d\'informations' : 'Fermer')
      containBt.setAttribute('title', expanded ? 'plus d\'informations' : 'Fermer')
    })
    const container = this.container = ol_ext_element.create('DIV', {
      className: 'fr-container',
      id: idContain,
      'aria-labelledby': containBt.id,
      parent: this.element
    })
    const body = ol_ext_element.create('DIV', {
      className: 'fr-footer__body frx-expanded',
      parent: container
    })
    // Brand
    const brand = ol_ext_element.create('A', {
      className: 'router-link-active router-link-exact-active',
      title: 'Retour à l\'accueil',
      'aria-current': 'page',
      href: '/',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-footer__brand fr-enlarge-link',
        parent: body
      })
    })
    ol_ext_element.create('P', {
      className: 'fr-logo',
      html: 'République<br>Française',
      parent: brand
    })

    // Footer content
    const content = ol_ext_element.create('DIV', {
      className: 'fr-footer__content',
      parent: body
    })
    this.description = ol_ext_element.create('P', {
      className: 'fr-footer__content-desc',
      text: 'Lorem ipsum dolor sit amet',
      parent: content
    })
    this.contentLink = ol_ext_element.create('UL', {
      className: 'fr-footer__content-list',
      parent: content
    })

    // Partners
    const partners = ol_ext_element.create('DIV', {
      className: 'fr-footer__partners frx-expanded',
      parent: container
    })
    ol_ext_element.create('H4', {
      className: 'fr-footer__partners-title',
      text: 'Nos partenaires',
      parent: partners
    })
    const logos = ol_ext_element.create('DIV', {
      className: 'fr-footer__partners-logos',
      parent: partners
    })
    this.partnerMainList = ol_ext_element.create('UL', {
      parent: ol_ext_element.create('DIV', {
        className: 'ffr-footer__partners-main',
        parent: logos
      })
    })
    this.partnerList = ol_ext_element.create('UL', {
      parent: ol_ext_element.create('DIV', {
        className: 'fr-footer__partners-sub',
        parent: logos
      })
    })

    // Bottom
    const bottom = ol_ext_element.create('DIV', {
      className: 'fr-footer__bottom',
      parent: container
    })
    // Links
    this.links = ol_ext_element.create('UL', {
      className: 'fr-footer__bottom-list',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-container--fluid',
        parent: bottom
      })
    })
    // Copy
    this.copy = ol_ext_element.create('P', {
      className: 'frx-expanded',
      html: `Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous 
        <a class="fr-link-licence no-content-after" href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" title="licence etalab-2.0 (nouvelle fenêtre)" rel="noopener noreferrer">
        licence etalab-2.0
        </a>`,
      parent: ol_ext_element.create('DIV', {
        className: 'fr-footer__bottom-copy',
        parent: bottom
      })
    })

  }
  /** Add a bottom link
   * @param {string} title
   * @param {string} href
   */
  addLink(title, href) {
    ol_ext_element.create('A', {
      className: 'fr-footer__bottom-link',
      text: ' ' + title + ' ',
      href: href,
      parent: ol_ext_element.create('LI', {
        className: 'fr-footer__bottom-item',
        parent: this.links
      })
    })
  }
  /** Add a bottom button
   * @param {string} title
   * @param {Object} options
   *  @param {string} options.icon
   */
  addButton(title, options) {
    let btnOptions = {
      className: 'fr-footer__bottom-link fr-link--icon-left fr-px-2v' + (options.icon ? ' '+options.icon : ''),
      text: ' ' + title + ' ',
      parent: ol_ext_element.create('LI', {
        className: 'fr-footer__bottom-item',
        parent: this.links
      })
    }
    // Ajoute les attributs supplémentaires au bouton
    for (const attr in options) {
      if (attr !== 'icon') btnOptions[attr] = options[attr];
    }
    ol_ext_element.create('BUTTON', btnOptions)
  }
  /**
   * @param {string} href
   * @param {string} [title] default use href
   */
  addContentLink(href, title) {
    title = title || href.replace(/^http(s)?:\/\/(www.)?/,'').replace(/\//g, '');
    return ol_ext_element.create('A', {
      className: 'fr-footer__content-link',
      target: '_blank',
      text: title,
      href: href,
      id: 'footer-info-' + title.replace(/\./g, '-'),
      parent: ol_ext_element.create('LI', {
        className: 'fr-footer__content-item',
        parent: this.contentLink
      })
    })
  }
  /** Add partner logo
   * @param {string} title
   * @param {string} url
   * @param {string} img image src
   * @param {boolean} [main=false]
   */
  addPartner(title, url, img, main) {
    return ol_ext_element.create('A', {
      className: 'fr-footer__partners-link',
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
      html: ol_ext_element.create('IMG', {
        className: 'fr-footer__logo',
        alt: title,
        src: img
      }),
      parent: ol_ext_element.create('LI', {
        // className: 'fr-footer__content-item',
        parent: main ? this.partnerMainList : this.partnerList
      })
    })
  }
}


/** DSFR charte
 * 
 */
class Charte {
  constructor() {
    this.header = new Header
    this.element = ol_ext_element.create('main', { parent: document.body })
    this.footer = new Footer()
  }
  /** Get en element in the main (or create it)
   * @param {string} role
   * @param {Object} options
   */
  getElement(role, options) {
    options = options || {};
    options['data-role'] = role;
    options.parent = this.element;
    return this.element.querySelector('[data-role="' + role + '"]') || ol_ext_element.create('DIV', options)
  }
  /**
   * @private
   */
  _updateFooter() {
    // Move footer to the header
    this.header.footer.innerHTML = this.footer.container.innerHTML
  }
  /** Get existing or create menu 
   * @param {Objet} options 
   *  @param {string} options.type menu type description|link|option
   *  @param {string} options.label 
   *  @param {string} options.info information for type description
   *  @param {string} options.href information for type link
   *  @param {string} options.icon
   *  @param {string} options.action 
   */
  getHeaderMenu(options) {
    options = options || {}
    // Existing menu
    if (options.action) {
      const menu = this.header.element.querySelector('[data-action="' + options.action + '"]')
      if (menu) return menu
    }
    // Create new one
    options.parent = this.header.tools
    return new Menu(options)
  }
  /** Set service information
   * @param {Object} options
   *  @param {string} [options.service] service name
   *  @param {string} [options.title]
   *  @param {string} [options.href] main page url
   */
  setService(service, href, title) {
    this.header.setService(service, href, title)
  }
  /** Set service description
   * @param {string} desc
   */
  setDescription(desc) {
    this.footer.description.innerHTML = desc
    this._updateFooter()
  }
  /** Add partner logo
   * @param {string} title
   * @param {string} url
   * @param {string} img image src
   * @param {boolean} [main=false]
   */
  addPartner(title, url, img, main) {
    this.footer.addPartner(title, url, img, main)
    this._updateFooter()
  }
  /**
   * @param {string} href
   * @param {string} [title] default use href
   */
  addContentLink(href, title) {
    this.footer.addContentLink(href, title)
    this._updateFooter()
  }
  /** Add a bottom link
   * @param {string} title
   * @param {string} href
   */
  addFooterLink(title, href) {
    this.footer.addLink(title, href)
    this._updateFooter()
  }
  /** Add a bottom button
   * @param {string} title
   * @param {Object} options
   *  @param {string} options.icon
   */
  addFooterButton(title, options) {
    this.footer.addButton(title, options)
    this._updateFooter()
  }

}

// Copy footer > header
// charte.header.footer.querySelector('.fr-header__menu-footer .footer-links').innerHTML = charte.footer.element.innerHTML;

// Export singleton
export default new Charte
