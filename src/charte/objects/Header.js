import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';
import getUid from '../../utils/getUid.js';

/** Header */
class Header extends BaseObject {
  constructor() {
    super()
    const header = document.querySelector('header') || ol_ext_element.create('HEADER', {
      role: 'banner',
      className: 'fr-header',
      parent: document.body
    });
    this.element = header;
    // Wrapper
    const wrapper = ol_ext_element.create('DIV', {
      className: 'fr-container',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-header__body',
        parent: header
      })
    })
    this.container = wrapper
    const hbody = ol_ext_element.create('DIV', {
      className: 'fr-header__body-row',
      parent: wrapper
    });

    // Title / logo
    const brand = this.brand = ol_ext_element.create('DIV', {
      className: 'fr-header__brand fr-enlarge-link',
      parent: hbody
    })

    const brandTop = ol_ext_element.create('DIV', {
      className: 'fr-header__brand-top',
      parent: brand
    });
    this.logoContainer = ol_ext_element.create('DIV', {
      className: 'fr-header__logo',
      html: '<p class="fr-logo"> République <br> française </p></p>',
      parent: brandTop
    })

    const headerService = this.headerService = ol_ext_element.create('DIV', {
      className: 'fr-header__service',
      parent: brand
    })
    this.title = ol_ext_element.create('A', {
      href: '/',
      html: '<p class="fr-header__service-title"></p>',
      parent: headerService
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
    const navbar = this.navbar = ol_ext_element.create('DIV', {
      className: 'fr-header__navbar',
      parent: brandTop,
    })
    const navButton = ol_ext_element.create('BUTTON', {
      id: getUid('button'),
      className: 'fr-btn--menu fr-btn',
      title: 'Menu',
      type: 'button',
      'data-fr-opened': 'false',
      'aria-controls': idmodal,
      parent: navbar,
    })
    // Modal
    const container = ol_ext_element.create('DIV', {
      className: 'fr-container',
      parent:
        ol_ext_element.create('DIV', {
          className: 'fr-header__menu fr-modal',
          id: idmodal,
          'aria-labelledby': navButton.id,
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
    this.footer = ol_ext_element.create('footer', {
      className: 'fr-footer',
      parent: container
    })
  }

  /**
   * Passe le header en mode compact
   * 
   * @param {boolean} compact Si vrai, passe en mode compact 
   */
  setCompact(compact) {
    // Déplace le header en fonction du mode
    if (compact) {
      this.navbar.before(this.headerService);
    } else {
      this.brand.before(this.headerService);
    }
    // Header
    this.element.classList.toggle("fr-header--compact", !!compact);
    // Conteneur (fluide ou non)
    this.container.classList.toggle("fr-container--fluid", !!compact);
    this.container.classList.toggle("fr-container", !compact);
  }
  /** Set service information
   * @param {ServiceOptions} options
   */
  setService(options) {
    if (options.service) {
      this.title.querySelector('p').innerHTML = options.service;
    }

    if (options.baseline) {
      this.headerService.querySelector("fr-header__service-tagline")?.remove;
      const baseline = ol_ext_element.create("p", {
        text: options.baseline,
        className: 'fr-header__service-tagline'
      });
      this.headerService.appendChild(baseline);
    }

    if (options.badge) {
      this.setBadge(options.badge);
    }

    if (options.operator) {
      this.setOperator(options.operator);
    }

    ['title', 'href'].forEach(k => {
      if (options[k]) {
        this.title.setAttribute(k, options[k]);
      }
    });
  }

  /**
   * Ajoute / remplace le badge d'entête.
   * 
   * @see {@link https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/badge} Composant badge
   * @see {@link https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/badge/code-du-badge#variantes-d-accentuation} Couleurs utilisables
   * 
   * @param {BadgeOptions} options Options du badge
   */
  setBadge(options) {
    this.title.querySelector('p > span')?.remove();
    if (options.text) {
      const badge = ol_ext_element.create('span', {
        className: `fr-badge fr-badge--sm ${options.icon && options.icon + ' fr-badge--icon-left'} ${options.colorClass || ""}`,
        text: options.text,
      });
      this.title.querySelector('p').appendChild(badge);
    }
  }

  /**
   * Ajoute / remplace le logo opérateur.
   * 
   * @param {OperatorLogo} operator Logo opérateur
   */
  setOperator(operator) {
    this.logoContainer.parentElement.querySelector('.fr-header--operator')?.remove();
    if (operator.logo) {
      // Conteneur de l'image
      const container = ol_ext_element.create('div', {
        className: `fr-header__operator`,
      });
      // Source de l'image
      const img = ol_ext_element.create('img', {
        className: `fr-responsive-img`,
        src: operator.logo,
        alt: '',
        parent: container,
      });
      this.logoContainer.after(container);
      // Gère le passage en mode sombre (si le logo doit changer)
      if (operator.darkLogo) {
        document.documentElement.addEventListener("dsfr.theme", (e) => {
          if (e.detail?.theme === "dark") {
            img.src = operator.darkLogo;
          } else {
            img.src = operator.logo;
          }
        })
      }
    }
  }
}

export default Header;
