import BaseObject from 'ol/Object.js';
import ol_ext_element from 'ol-ext/util/element.js';
import getUid from '../../utils/getUid.js';

/** Footer complet avec tous les éléments du DSFR */
class FooterComplet extends BaseObject {
  constructor() {
    super()
    this.element = ol_ext_element.create('FOOTER', {
      id: getUid('footer'),
      className: 'fr-footer',
      role: 'contentinfo',
      parent: document.body
    })

    // Bouton d'expansion (visible uniquement en mode compact)
    const idContain = getUid('footer-container')
    const containBt = ol_ext_element.create('BUTTON', {
      id: getUid('footer-expand-button'),
      type: 'button',
      className: 'fr-icon-arrow-up-s-line fr-btn--tertiary-no-outline fr-btn btn-more-info',
      'aria-label': 'plus d\'informations',
      'title': 'plus d\'informations',
      'aria-expanded': 'false',
      'aria-controls': idContain,
      parent: this.element
    })
    containBt.addEventListener('click', () => {
      const expanded = containBt.getAttribute('aria-expanded') === 'true'
      containBt.setAttribute('aria-expanded', !expanded);
      containBt.classList.toggle('fr-icon-arrow-up-s-line', expanded)
      containBt.classList.toggle('fr-btn--close', !expanded)
      containBt.classList.toggle('fr-btn--icon-right', !expanded)
      containBt.setAttribute('aria-label', expanded ? 'plus d\'informations' : 'Fermer')
      containBt.innerText = "Fermer";
      containBt.setAttribute('title', expanded ? 'plus d\'informations' : 'Fermer')
    })

    // Container
    const container = this.container = ol_ext_element.create('DIV', {
      className: 'fr-container',
      id: idContain,
      'aria-labelledby': containBt.id,
      parent: this.element
    })

    // Body
    const body = ol_ext_element.create('DIV', {
      className: 'fr-footer__body',
      parent: container
    })

    // Brand
    const brand = ol_ext_element.create('A', {
      id: 'footer-brand-link-' + getUid('brand'),
      className: 'router-link-active router-link-exact-active',
      title: 'Retour à l\'accueil',
      'aria-current': 'page',
      href: '/',
      parent: ol_ext_element.create('DIV', {
        className: 'fr-footer__brand fr-enlarge-link',
        parent: body
      })
    })
    this.logo = ol_ext_element.create('P', {
      className: 'fr-logo',
      html: ' République <br> Française',
      parent: brand
    })

    // Footer content
    const content = ol_ext_element.create('DIV', {
      className: 'fr-footer__content',
      parent: body
    })
    this.description = ol_ext_element.create('P', {
      className: 'fr-footer__content-desc',
      parent: content
    })
    this.contentLink = ol_ext_element.create('UL', {
      className: 'fr-footer__content-list',
      parent: content
    })

    // Partners
    const partners = ol_ext_element.create('DIV', {
      className: 'fr-footer__partners',
      parent: container
    })
    ol_ext_element.create('H2', {
      className: 'fr-footer__partners-title',
      text: 'Nos partenaires',
      parent: partners
    })
    const logos = ol_ext_element.create('DIV', {
      className: 'fr-footer__partners-logos',
      parent: partners
    })
    this.partnerMainList = ol_ext_element.create('DIV', {
      className: 'fr-footer__partners-main',
      parent: logos
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
      parent: bottom
    })

    // Copy
    this.copy = ol_ext_element.create('P', {
      html: `Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous 
        <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noopener external" title="Licence etalab - Nouvelle fenêtre">
        licence etalab-2.0
        </a>`,
      parent: ol_ext_element.create('DIV', {
        className: 'fr-footer__bottom-copy',
        parent: bottom
      })
    })
  }

  /**
   * Définit le texte du logo
   * @param {string} html Contenu HTML du logo
   */
  setLogoText(html) {
    this.logo.innerHTML = html
  }

  /**
   * Définit le texte de description
   * @param {string} text Texte de description
   */
  setDescription(text) {
    this.description.textContent = text
  }

  /**
   * Passe le footer en mode compact
   * 
   * @param {boolean} compact Si vrai, passe en mode compact
   */
  setCompact(compact) {
    // Footer
    this.element.classList.toggle("fr-footer--compact", !!compact);
    // Conteneur (fluide ou non)
    this.container.classList.toggle("fr-container--fluid", !!compact);
    this.container.classList.toggle("fr-container", !compact);
  }

  /**
   * Ajoute un lien de contenu
   * @param {string} href URL du lien
   * @param {string} title Texte du lien
   * @param {string} [titleAttr] Attribut title pour l'accessibilité
   */
  addContentLink(href, title, titleAttr) {
    title = title || href.replace(/^http(s)?:\/\/(www.)?/, '').replace(/\//g, '');
    const linkId = 'footer__content-link-' + getUid('content-link')
    return ol_ext_element.create('A', {
      id: linkId,
      className: 'fr-footer__content-link',
      target: '_blank',
      rel: 'noopener external',
      title: titleAttr || title + ' - Nouvelle fenêtre',
      text: title,
      href: href,
      parent: ol_ext_element.create('LI', {
        className: 'fr-footer__content-item',
        parent: this.contentLink
      })
    })
  }

  /** 
   * Ajoute un logo de partenaire
   * @param {string} alt Texte alternatif de l'image
   * @param {string} url URL du lien
   * @param {string} img Source de l'image
   * @param {boolean} [main=false] Si true, ajoute dans les partenaires principaux
   */
  addPartner(alt, url, img, main) {
    const imgElement = ol_ext_element.create('IMG', {
      className: 'fr-footer__logo',
      alt: alt,
      src: img
    })

    if (main) {
      // Partenaire principal : directement dans partnerMainList sans <li>
      return ol_ext_element.create('A', {
        className: 'fr-footer__partners-link',
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        html: imgElement,
        parent: this.partnerMainList
      })
    } else {
      // Partenaire secondaire : dans partnerList avec <li>
      return ol_ext_element.create('A', {
        className: 'fr-footer__partners-link',
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        html: imgElement,
        parent: ol_ext_element.create('LI', {
          parent: this.partnerList
        })
      })
    }
  }

  /** 
   * Ajoute un lien dans la section du bas
   * @param {string} title Texte du lien
   * @param {string} href URL du lien
   */
  addLink(title, href) {
    const linkId = 'footer__bottom-link-' + getUid('bottom-link')
    ol_ext_element.create('A', {
      id: linkId,
      className: 'fr-footer__bottom-link',
      text: title,
      href: href,
      parent: ol_ext_element.create('LI', {
        className: 'fr-footer__bottom-item',
        parent: this.links
      })
    })
  }

  /** 
   * Ajoute un bouton dans la section du bas
   * @param {string} title Texte du bouton
   * @param {Object} options Options du bouton
   * @param {string} [options.icon] Classe d'icône DSFR
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
   * Supprime tous les liens de contenu
   */
  clearContentLinks() {
    this.contentLink.innerHTML = ''
  }

  /**
   * Supprime tous les partenaires
   */
  clearPartners() {
    this.partnerList.innerHTML = ''
  }

  /**
   * Supprime tous les liens du bas
   */
  clearLinks() {
    this.links.innerHTML = ''
  }
}

export default FooterComplet;
