import ol_ext_element from 'ol-ext/util/element'


let currentId = 0;

/** Get element Uid
 * @param {string} type
 * @param {*} obj
 */
function getUid(type, obj) {
  let id = (type || 'default') + '-' + (++currentId)
  if (obj) {
    if (obj._uid) {
      return obj._uid
    }
    if (obj.getAttribute && obj.getAttribute('id')) {
      return obj.getAttribute('id')
    }
    if (parent.id) {
      return parent.id
    }
    if (obj.setAttribute) {
      obj.setAttribute('id', id)
    } else {
      obj._uid = id;
    }
  }
  return id
}

function htmlToNode(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const nNodes = template.content.childNodes.length;
  if (nNodes !== 1) {
    throw new Error(
      `html parameter must represent a single node; got ${nNodes}. ` +
      'Note that leading or trailing spaces around an element in your ' +
      'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
      'the element; call .trim() on your input to avoid this.'
    );
  }
  return template.content.firstChild;
}

/** Menu */
class Menu {
  /**
   * @param {Objet} options 
   *  @param {string} options.type menu type description|link|option
   *  @param {string} options.label 
   *  @param {string} options.info information for type description
   *  @param {string} options.href information for type link
   *  @param {string} options.icon
   *  @param {string} options.action 
   */
  constructor(options) {
    const nav = this.element = ol_ext_element.create('DIV', {
      className: 'fr-nav__item',
      parent: ol_ext_element.create('NAV', {
        role: 'navigation',
        className: 'fr-access fr-nav',
        id: getUid('access'),
        parent: options.parent
      })
    })
    this._action = options.action;
    if (options.action) {
      nav.dataset.action = options.action
    }

    const idMenu = getUid('access')

    // Button
    ol_ext_element.create('BUTTON', {
      text: options.text,
      title: options.title || options.text,
      className: 'fr-access__btn fr-nav__btn fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary-no-outline ' + options.icon,
      'aria-expanded': false,
      'aria-controls': idMenu,
      type: 'button',
      parent: nav
    })

    // Menu
    const menu = ol_ext_element.create('DIV', {
      className: 'fr-collapse fr-access__menu fr-menu',
      parent: nav,
      id: idMenu
    })
    this._menuList = ol_ext_element.create('UL', {
      className: 'fr-menu__list',
      parent: menu
    })
  }
  /** Get Menu
   * @param {string|Element} action
   * @private
   */
  _getMenu(action) {
    let li = action;
    if (typeof (action) === 'string') {
      li = this._menuList.querySelector('li[data-action="' + action + '"]');
    }
    return {
      parent: this.element,
      element: li,
      type: li.dataset.type,
      link: li.querySelector('a')
    }
  }
  /** Get all menu in the page for an action
   * @param {string} action
   * @returns {Array<Element>}
   */
  getMenu(action) {
    const parent = document.querySelectorAll('nav[role="navigation"] [data-action="' + this._action + '"]')
    const info = []
    parent.forEach(p => {
      const li = p.querySelector('li[data-action="' + action + '"]');
      const m = this._getMenu(li)
      m.parent = p;
      info.push(m)
    })
    return info
  }
  /** SetMenu info
   * @private
   */
  _setMenu(action, options) {
    let m = action
    if (typeof (action) === 'string') {
      m = this._getMenu(action)
    }
    if (!m) return;
    // Set data
    if (options.data) {
      Object.keys(options.data).forEach(d => {
        console.log(d)
        if (d === 'parent') {
          Object.keys(options.data.parent).forEach(dp => {
            console.log(m.parent)
            m.parent.dataset[dp] = options.data.parent[dp]
          })
        } else {
          m.element.dataset[d] = options.data[d]
        }
      })
    }
    // Set menu info
    switch (m.type) {
      case 'description': {
        if (options.label) {
          m.element.querySelector('.fr-description__label').innerText = options.label
        }
        if (options.info) {
          m.element.querySelector('.fr-description__info').innerText = options.info
        }
        break;
      }
      case 'link':
      case 'option': {
        const a = m.element.querySelector('a');
        ['title', 'href'].forEach(k => {
          if (options[k]) a[k] = options[k]
        })
        if (options.label) {
          a.innerText = options.label
        }
        break;
      }
    }
  }
  /** SetMenu info
   * @param {string} action
   * @param {Object} options
   *  @param {string} options.title
   *  @param {string} options.href
   *  @param {string} options.label
   *  @param {string} options.info
   *  @param {Object} options.data
   */
  setMenu(action, options) {
    this.getMenu(action).forEach(m => this._setMenu(m, options))
  }
  /** Add a new menu
   * @param { MenuOptions|Array<MenuOptions> }
   */
  addMenu(options) {
    if (Array.isArray(options)) {
      options.forEach(o => this.addMenu(o));
      return;
    }
    const li = ol_ext_element.create('LI', {
      className: 'fr-menu__item',
      'data-type': options.type,
      parent: this._menuList
    })
    if (options.action) {
      li.dataset.action = options.action
    }
    switch (options.type) {
      case 'description': {
        const desc = ol_ext_element.create('DIV', {
          className: 'fr-description',
          id: getUid('description'),
          parent: li
        })
        ol_ext_element.create('DIV', {
          className: 'fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey',
          text: options.label,
          parent: desc
        })
        ol_ext_element.create('DIV', {
          className: 'fr-description__info fr-text--xs fr-text-mention--grey',
          text: options.info,
          parent: desc
        })
        break;
      }
      case 'link': {
        ol_ext_element.create('A', {
          id: getUid('access__link'),
          className: (options.icon || '') + ' fr-link--icon-left fr-access__link fr-nav__link fr-access__link fr-nav__link',
          title: options.title || '',
          text: options.label || 'no label',
          href: options.href,
          parent: li
        })
        break;
      }
      case 'option': {
        li.classList.add('fr-menu__option')
        const opt = ol_ext_element.create('DIV', {
          className: 'fr-option',
          parent: li
        })
        ol_ext_element.create('A', {
          id: getUid('access__link'),
          className: (options.icon || '') + ' fr-option__btn fr-btn fr-btn--sm fr-btn--icon-left fr-btn--tertiary',
          title: options.title || '',
          text: options.label || 'no label',
          href: options.href,
          parent: opt
        })
        break;
      }
    }
  }
}



export { Menu, getUid, htmlToNode }