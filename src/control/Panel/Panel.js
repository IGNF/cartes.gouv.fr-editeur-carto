import Utils from "geopf-extensions-openlayers/src/packages/Utils/Helper.js";
import contentHTML from './panel.html?raw';
import ol_ext_element from 'ol-ext/util/element.js';
import getUid from "../../utils/getUid.js";
import './panel.scss';
import Dialog from '../Dialog/Dialog.js';


/**
 * Objet représentant un lien de la navigation tertiaire
 *  
 * @typedef {Object} TabNavItem
 * @property {string} label - Label du bouton.
 * @property {string} content - Contenu lié au bouton.
 * @property {string} [title] - Titre du bouton.
 * @property {string|Element} [icon] - Icône du bouton.
 * @property {Panel~tabHandler} [onOpen] - Fonction à l'ouverture de l'onglet.
 * @property {Panel~tabHandler} [onClose] - Fonction à la fermeture de l'onglet.
 */

/**
 * Fonction à l'ouverture ou fermeture d'un onglet.
 * Les paramètres sont les mêmes, mais les fonctions sont
 * déclenchées à des moments différents.
 * 
 * @callback Panel~tabHandler
 * @param {HTMLButtonElement} tab Bouton de l'onglet
 * @param {Element} content Contenu de l'onglet
 */


/**
 * Panneau d'action diverses.
 */
class Panel extends Dialog {
  constructor(options) {
    super(options)
  }

  /**
   * Initie les sélecteurs CSS utiles dans le reste
   */
  initialize() {
    this.dialogClass = 'ignf-panel'

    super.initialize()

    // Override les valeurs initiales
    let options = {
      html: contentHTML,
    }

    Utils.assign(this.options, options);

    // Navigation tertiaire
    const tabClass = '.fr-tabnav'
    this.selectors.NAVIGATION = tabClass;
    this.selectors.NAVIGATION_LIST = `${tabClass} ${tabClass}__list`;
    this.selectors.NAVIGATION_ITEM = `${tabClass} ${tabClass}__item`;
    const link = this.selectors.NAVIGATION_LINK = `${tabClass} ${tabClass}__link`;
    this.selectors.CURRENT_LINK = `${link}[aria-selected="true"]`;

    this.selectors.OPEN_TAB = 'panel:tab:open'
    this.selectors.CLOSE_TAB = 'panel:tab:close'
  }

  /**
   * Créé le dialog en instanciant aussi les 
   * 
   * @param {Object} options Options de création du panneau
   */
  _createDialog(options) {

    super._createDialog(options);

    this.navigation = this.querySelector(this.selectors.NAVIGATION)

    // Ajoute les événements à l'ouverture / fermeture des onglets
    let self = this;
    this.on(this.selectors.OPEN_TAB, self._tabHandler);
    this.on(this.selectors.CLOSE_TAB, self._tabHandler);


    if (options.position) {
      this.setPosition(options.position);
    }
  }

  setContent(options) {
    super.setContent(options);

    this.addNavItems(options.items);

    this.navigation.classList.toggle('fr-hidden', !this.hasNavItem());
  }

  addNavItems(items) {
    if (Array.isArray(items)) {
      let navList = this.querySelector(this.selectors.NAVIGATION_LIST);
      navList.replaceChildren();
      items.forEach(item => {
        this.addNavItem(item);
      })
    } else {
      this.addNavItem(items);
    }
  }

  /**
   * 
   * @param {TabNavItem} item Lien à ajouter 
   */
  addNavItem(item) {
    const navList = this.querySelector(this.selectors.NAVIGATION_LIST);
    if (!item) {
      navList.replaceChildren();
      return;
    }

    // Création des ids
    const btnId = getUid('tabNavLink');
    const contentId = getUid('tabNavContent');

    // Création de la puce
    const li = ol_ext_element.create('li', {
      className: 'fr-nav__item fr-tabnav__item',
      role: 'presentation',
    });

    // Création du bouton
    const buttonOptions = {
      id: btnId,
      role: 'tab',
      'aria-controls': contentId,
      'aria-selected': false,
      html: item.label,
    };

    // Icône du bouton
    let iconClass = '';
    if (item.icon) {
      iconClass = `${item.icon} fr-btn--icon-left`;
    }
    buttonOptions.className = `fr-nav__link fr-tabnav__link ${iconClass}`;
    // Titre du bouton
    if (item.title) {
      buttonOptions.title = item.title;
    }

    // Ajout du bouton à la puce
    const button = ol_ext_element.create('button', buttonOptions);
    li.appendChild(button);
    navList.appendChild(li);

    let self = this;
    let clickFn = this._clickItem;
    button.addEventListener('click', (e) => clickFn(e, self))

    button.onTabOpen = item.onOpen;
    button.onTabClose = item.onClose;

    // Création du contenu lié à l'onglet
    const div = ol_ext_element.create('div', {
      id: contentId,
      'aria-labelledby': btnId,
      role: 'tabpanel',
      className: 'fr-tabnav__panel fr-hidden',
      html: item.content,
    });

    this.dialogContent.appendChild(div);
  }

  hasNavItem() {
    return this.querySelectorAll(this.selectors.NAVIGATION_ITEM).length;
  }

  getCurrentLink() {
    return this.querySelector(this.selectors.CURRENT_LINK);
  }

  /**
   * 
   * @param {HTMLButtonElement} link Bouton à activer
   */
  setCurrentLink(link) {
    const currentLink = this.getCurrentLink();
    // Ne fait rien si l'élément est déjà ouvert
    if (currentLink === link) return;

    if (currentLink) {
      // Déselctionne l'élément et cache son contenu
      currentLink.ariaSelected = false;

      const currentContentId = currentLink.getAttribute('aria-controls');
      const currentContent = this.querySelector(`#${currentContentId}`);
      currentContent.classList.add('fr-hidden');
      this.dispatchEvent({
        type: this.selectors.CLOSE_TAB,
        tab: currentLink,
        content: currentContent,
      })
    }

    // Sélectionne l'élément
    link.ariaSelected = true;
    // Affiche le contenu
    const contentId = link.getAttribute('aria-controls');
    const content = this.querySelector(`#${contentId}`);
    content.classList.remove('fr-hidden');
    this.dispatchEvent({
      type: this.selectors.OPEN_TAB,
      tab: link,
      content: content,
    })
  }

  /**
   * 
   * @param {PointerEvent} e 
   * @param {Panel} self 
   */
  _clickItem(e, self) {
    if (self.getCurrentLink() !== e.target) {
      self.setCurrentLink(e.target);
    }
  }

  _tabHandler(e) {
    const dialog = e.target;
    let tab = e.tab;
    let content = e.content;
    let type = e.type;

    let onOpen = tab.onTabOpen;
    let onClose = tab.onTabClose;

    switch (type) {
      case dialog.selectors.OPEN_TAB:
        if (typeof onOpen === 'function') {
          onOpen(tab, content)
        }
        break;
      case dialog.selectors.CLOSE_TAB:
        if (typeof onClose === 'function') {
          onClose(tab, content)
        }
        break;
    }
  }

  setPosition(position) {
    if (position === 'left') {
      this.dialog.classList.add('ignf-panel__left');
      this.dialog.classList.remove('ignf-panel__right');
    } else if (position === 'right') {
      this.dialog.classList.add('ignf-panel__right');
      this.dialog.classList.remove('ignf-panel__left');
    }
  }

  _open() {
    super._open();
    // Focus sur le premier item
    if (this.hasNavItem()) {
      this.setCurrentLink(this.querySelector(this.selectors.NAVIGATION_LINK))
    }
  }
}

export default Panel;
