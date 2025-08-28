import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';
import getUid from '../../utils/getUid.js';

/** Footer */
class Footer extends BaseObject {
  constructor() {
    super()
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
      // className: 'fr-btn--close fr-btn btn-more-info',
      className: 'fr-icon-arrow-down-s-line fr-btn--tertiary-no-outline fr-btn btn-more-info',
      'aria-label': 'plus d\'informations',
      'title': 'plus d\'informations',
      'aria-expanded': 'false',
      'aria-controls': idContain,
      parent: this.element
    })
    containBt.addEventListener('click', () => {
      const expanded = containBt.getAttribute('aria-expanded') === 'true'
      containBt.setAttribute('aria-expanded', !expanded);
      containBt.classList.toggle('fr-icon-arrow-down-s-line', expanded)
      containBt.classList.toggle('fr-btn--tertiary-no-outline', expanded)
      containBt.classList.toggle('fr-btn--close', !expanded)
      containBt.setAttribute('aria-label', expanded ? 'plus d\'informations' : 'Fermer')
      containBt.setAttribute('title', expanded ? 'plus d\'informations' : 'Fermer')
    })
    const container = this.container = ol_ext_element.create('DIV', {
      className: 'fr-container--fluid',
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
      className: 'fr-footer__bottom-link fr-link--icon-left fr-px-2v' + (options.icon ? ' ' + options.icon : ''),
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
    title = title || href.replace(/^http(s)?:\/\/(www.)?/, '').replace(/\//g, '');
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

export default Footer;