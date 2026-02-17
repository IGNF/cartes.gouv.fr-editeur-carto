import getUid from "../../utils/getUid.js";
import "./CustomSelect.scss";
import DefaultInputStyle from "./DefaultInputStyle.js";
import { isElementInView, isScrollable, maintainScrollVisibility } from "../../utils/utils.js";

/**
 * @typedef {Object} InputConfig
 * @property {HTMLElement} input L'élément input HTML
 * @property {string} label Le label de l'input
 * @property {string} property La propriété flat style correspondante
 */

/**
 * @typedef {Object} SelectConfig
 * @property {HTMLSelectElement} select L'élément select HTML
 * @property {string} label Le label du select
 * @property {string} property La propriété flat style correspondante
 * @property {Object<string, string>} options Les options du select (valeur: libellé)
 */

/**
 * @typedef {Object} InputStyleConfig
 * @property {string} label Le label de l'input
 * @property {string} property La propriété flat style correspondante
 * @property {Object<string, string>} options Les options de la sélection (valeur: libellé)
 */

/**
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/} Pour voir l'inspiration
 */
class CustomSelect extends DefaultInputStyle {

  /**
   * Constructeur du contrôle StyleForm
   * @param {InputStyleConfig} options Options du contrôle
   */
  constructor(options = {}) {
    super(options);
  }

  _initialize(options) {
    super._initialize(options);
    options.options ||= {};
    this.type = options.type || "";
    this.baseOptionId = getUid("input-style__option");
    this.open = false;

    this.selectActions = {
      Close: 0,
      CloseSelect: 1,
      First: 2,
      Last: 3,
      Down: 4,
      Open: 5,
      PageDown: 6,
      PageUp: 7,
      Up: 8,
      Select: 9,
      Type: 10,
      Left: 11,
      Right: 12,
      BeginRow: 13,
      EndRow: 14,
    };

    this.pageSize = 6;

    this.isDragging = false;
    this.startY;
    this.startBottom;

    this.dragFct = this.drag.bind(this);
    this.stopDraggingFct = this.stopDragging.bind(this);

    this.choices = Object.entries(options.options);
    this.options = options.options;
  }


  _initContainer(options) {
    super._initContainer(options);
    this.element.classList.add("input-style-select");

    const optionsContainerId = getUid("option-container");

    const btnId = getUid("input-style__container");
    this.label.htmlFor = btnId;

    const value = Object.keys(options.options)[0];

    // this.inputContainer.remove();
    // this.inputContainer = document.createElement('button');
    this.inputContainer.id = btnId
    this.inputContainer.className = 'input-style__container';
    this.inputContainer.ariaExpanded = false;
    this.inputContainer.role = "combobox";
    this.inputContainer.ariaHasPopup = "listbox";
    this.inputContainer.setAttribute("aria-activedescendant", "");
    this.inputContainer.setAttribute("aria-labelledby", this.label.id);
    this.inputContainer.setAttribute("aria-controls", optionsContainerId);

    this.inputContainer.dataset.type = this.type;
    this.inputContainer.dataset.value = value;
    this.inputContainer.style.setProperty("--bg-color", value);
    this.inputContainer.ariaSelected = true;

    this.element.appendChild(this.inputContainer);

    this.choice = document.createElement('span');
    this.choice.className = 'input-style__option-value';
    this.inputContainer.appendChild(this.choice);

    this.optionsContainer = document.createElement("div");
    this.optionsContainer.id = optionsContainerId;
    this.optionsContainer.tabIndex = -1;
    this.optionsContainer.role = "listbox";
    this.optionsContainer.className = "input-style__options-container";
    this.element.appendChild(this.optionsContainer);

    this.dragDiv = document.createElement("div");
    this.dragDiv.className = "input-style__options-container-drag";
    this.dragHandle = document.createElement("div");
    this.dragHandle.className = "input-style__options-container-drag-handle"
    this.dragDiv.appendChild(this.dragHandle);
    this.optionsContainer.appendChild(this.dragDiv);
    this.optionsContent = document.createElement("div");
    this.optionsContent.className = "input-style__options-container-content";
    this.optionsContent.tabIndex = -1;
    this.optionsContainer.appendChild(this.optionsContent);

    let i = 0;
    for (const [key, value] of this.choices) {
      const option = this.addChoice(key, value, i);
      i++;
      this.optionsContent.appendChild(option);
    }
  }

  setDisabled(bool) {
    super.setDisabled(bool);
    if (bool) {
      this.inputContainer.tabIndex = -1;
      this.inputContainer.ariaDisabled = true;
    } else {
      this.inputContainer.tabIndex = 0;
      this.inputContainer.ariaDisabled = false;
    }
  }

  _initEvents(options) {
    super._initEvents(options);

    this.label.addEventListener("click", () => {
      !this.get("disabled") && this.inputContainer.focus({ focusVisible: true });
    })

    this.inputContainer.addEventListener('blur', this.onComboBlur.bind(this));
    this.optionsContainer.addEventListener('focusout', this.onComboBlur.bind(this));

    this.inputContainer.addEventListener("click", () => {
      !this.get("disabled") && this.collapse(this.inputContainer.ariaExpanded === "true");
    })
    this.optionsContainer.addEventListener('mousedown', this.onComboClick.bind(this));
    this.inputContainer.addEventListener("keydown", this.onComboKeyDown.bind(this));

    this.input.addEventListener("change", (e) => {
      if (e.target.value !== undefined) {
        // Trouve l'index
        let index = this.choices.findIndex((arr) => arr[0] === e.target.value);
        // Cas où la valeur n'est pas trouvé : premier élément
        index = index === -1 ? 0 : index;
        this.selectOption(index, true);
      }
    })

    this.dragDiv.addEventListener("mousedown", this.startDragging.bind(this));
    // Pour le mobile
    this.dragDiv.addEventListener("touchstart", this.startDragging.bind(this));
  }

  /**
   * Commence à dragger la modale
   * @param {MouseEvent|TouchEvent} e Événement à gérer
   */
  startDragging(e) {
    e.preventDefault();
    this.isDragging = true;
    if (e.type === "mousedown") {
      this.startY = e.clientY;
    } else if (e.type === "touchstart") {
      // Pour le mobile
      this.startY = e.touches[0].clientY;
    }

    this.startHeight = parseInt(getComputedStyle(this.optionsContent).height);

    document.addEventListener("mousemove", this.dragFct);
    document.addEventListener("mouseup", this.stopDraggingFct);
    document.addEventListener("touchmove", this.dragFct);
    document.addEventListener("touchstop", this.stopDraggingFct);
  }

  /**
   * Bouge la modale
   * @param {MouseEvent} e Événement à gérer
   */
  drag(e) {
    if (!this.isDragging) {
      return
    };
    let clientY;
    if (e.type === "mousemove") {
      clientY = e.clientY;
    } else if (e.type === "touchmove") {
      // Pour le mobile
      clientY = e.touches[0].clientY;
    }
    const deltaY = clientY - this.startY;
    // Prends la plus petite valeur entre la valeur initiale et le delta actuel;
    const height = Math.min(this.initialHeight, Math.max(this.startHeight - deltaY, 0))
    if (height < 50) {
      this.stopDragging()
      setTimeout(() => this.collapse(true), 300);
    }
    else {
      this.optionsContent.style.height = height + "px";
    }
  }

  /**
   * Arrête de bouger la modale
   * @param {MouseEvent} e Événement à gérer
   */
  stopDragging() {
    this.isDragging = false;
    document.removeEventListener("mousemove", this.dragFct);
    document.removeEventListener("mouseup", this.stopDraggingFct);
    // Pour le mobile
    document.removeEventListener("touchmove", this.dragFct);
    document.removeEventListener("touchstop", this.stopDraggingFct);
  }

  /**
   * Renvoie une action en fonction de l'événement de clavier.
   * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/} Pour plus d'info
   * @param {KeyboardEvent} event Événement à gérer
   * @param {Boolean} menuOpen Vrai si le menu est ouvert
   * @returns {Number} Nombre correspondant à l'action
   */
  getActionFromKey(event, menuOpen) {
    const { key, altKey, ctrlKey, metaKey } = event;
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ']; // all keys that will do the default open action
    // handle opening when closed
    if (!menuOpen && openKeys.includes(key)) {
      return this.selectActions.Open;
    }

    // home and end move the selected option when open or closed
    if (key === 'Home' && ctrlKey) {
      return this.selectActions.First;
    }
    if (key === 'Home') {
      // Pour le cas "grid"
      return this.selectActions.BeginRow;
    }
    if (key === 'End' && ctrlKey) {
      return this.selectActions.Last;
    }
    if (key === 'End') {
      // Pour le cas "grid"
      return this.selectActions.EndRow;
    }

    // handle typing characters when open or closed
    if (
      key === 'Backspace' ||
      key === 'Clear' ||
      (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
    ) {
      return this.selectActions.Type;
    }

    // handle keys when open
    if (menuOpen) {
      if (key === 'ArrowUp' && altKey) {
        return this.selectActions.CloseSelect;
      } else if (key === 'ArrowDown' && !altKey) {
        return this.selectActions.Down;
      } else if (key === 'ArrowUp') {
        return this.selectActions.Up;
      } else if (key === 'ArrowLeft') {
        // Pour le cas "grid"
        return this.selectActions.Left;
      } else if (key === 'ArrowRight') {
        // Pour le cas "grid"
        return this.selectActions.Right;
      } else if (key === 'PageUp') {
        return this.selectActions.PageUp;
      } else if (key === 'PageDown') {
        return this.selectActions.PageDown;
      } else if (key === 'Escape') {
        return this.selectActions.Close;
      } else if (key === 'Enter' || key === ' ') {
        return this.selectActions.CloseSelect;
      }
    }
  }

  /**
   * Gère l'événement `click` sur la liste de choix / le bouton select
   * @param {FocusEvent} event Événement à gérer
   */
  onComboClick(event) {
    // Pas d'action si relatedTarget est dans la liste des options
    if (this.open && event.target === this.optionsContainer) {
      this.collapse(true);
    }
  }

  /**
   * Gère l'événement `blur` ou `focusout` sur la liste de choix / le bouton select
   * @param {FocusEvent} event Événement à gérer
   */
  onComboBlur(event) {
    // Pas d'action si relatedTarget est dans la liste des options ou sur le bouton
    if (this.optionsContainer.contains(event.relatedTarget) || this.inputContainer.contains(event.relatedTarget)) {
      return;
    }

    // Choisis l'option actuelle et ferme la modale
    if (this.open) {
      this.selectOption(this.activeIndex);
      this.collapse(true);
    }
  }

  /**
   * Fonction gérant les événements clavier pour la liste
   * @param {KeyboardEvent} event Événement de clavier à gérer
   */
  onComboKeyDown(event) {
    const { key } = event;
    const max = this.choices.length - 1;
    const action = this.getActionFromKey(event, this.open);

    if (this.get("disabled")) {
      return
    }

    switch (action) {
      case this.selectActions.Last:
      case this.selectActions.First:
      case this.selectActions.BeginRow:
      case this.selectActions.EndRow:
        this.collapse(false);
      // intentional fallthrough
      case this.selectActions.Down:
      case this.selectActions.Up:
      case this.selectActions.PageUp:
      case this.selectActions.PageDown:
      case this.selectActions.Left:
      case this.selectActions.Right:
        event.preventDefault();
        return this.onOptionChange(
          this.getUpdatedIndex(this.activeIndex, max, action)
        );
      case this.selectActions.CloseSelect:
        event.preventDefault();
        this.selectOption(this.activeIndex);
      // intentional fallthrough
      case this.selectActions.Close:
        event.preventDefault();
        return this.collapse(true);
      case this.selectActions.Type:
        return this.onComboType(key);
      case this.selectActions.Open:
        event.preventDefault();
        return this.collapse(false);
    }
  }
  /**
   * Ferme le panneau de sélection
   * @param {Boolean} bool Vrai si on doit fermer le panneau
   */
  collapse(bool) {
    // Enlève la hauteur mise en mode mobile
    this.optionsContent.style.removeProperty("height");

    const activeID = bool ? '' : `${this.baseOptionId}-${this.activeIndex}`;
    this.open = !bool;
    this.inputContainer.setAttribute("aria-activedescendant", activeID);
    this.inputContainer.setAttribute('aria-expanded', `${this.open}`);

    this.initialHeight = this.open && parseInt(getComputedStyle(this.optionsContent).height);

    // Mets l'option en état "current"
    activeID && this.optionsContent.querySelector(activeID)?.setAttribute("aria-selected", true);
  }

  /**
   * Indique si le panneau des options est ouvert.
   * @returns {Boolean} Vrai si le panneau est fermé. Faux sinon.
   */
  isCollapsed() {
    return this.inputContainer.ariaExpanded === "false";
  }

  /**
   * Change l'indice de sélection en fonction de l'action en cours
   * @param {Number} currentIndex Indice courrant
   * @param {Number} maxIndex Indice max
   * @param {Number} action Type d'action
   * @returns {Number} nouvel indice
   */
  getUpdatedIndex(currentIndex, maxIndex, action) {
    switch (action) {
      case this.selectActions.First:
      case this.selectActions.BeginRow:
        return 0;
      case this.selectActions.Last:
      case this.selectActions.EndRow:
        return maxIndex;
      case this.selectActions.Up:
        return Math.max(0, currentIndex - 1);
      case this.selectActions.Down:
        return Math.min(maxIndex, currentIndex + 1);
      case this.selectActions.PageUp:
        return Math.max(0, currentIndex - this.pageSize);
      case this.selectActions.PageDown:
        return Math.min(maxIndex, currentIndex + this.pageSize);
      default:
        return currentIndex;
    }
  }

  selectOption(index, silent = false) {
    this.activeIndex = index;

    // Màj aria-selected
    const options = this.optionsContent.querySelectorAll('[role=option]');
    [...options].forEach((optionEl) => {
      optionEl.setAttribute('aria-selected', 'false');
    });
    options[index].setAttribute('aria-selected', 'true');
    const option = this.choices[index];

    // Mets la valeur dans le choix
    this.inputContainer.dataset.value = option[0];
    this.inputContainer.style.setProperty("--bg-color", option[0]);
    this.inputContainer.ariaLabel = option[1];
    this.input.value = option[0];
    if (this.type === "icon") {
      this.choice.className = "input-style__option-value";
      if (option[0].trim().length) {
        this.choice.classList.add(option[0]);
      }
    }

    if (!silent) {
      this.input.dispatchEvent(new Event("change"));
    }
  }


  /**
   * Mets l'élément en "aria-selected = true" et déselectionne l'élément courant.
   * @param {Element} elem Élément à sélectionner
   */
  setCurrentOption(elem) {
    const current = this.getCurrentOption();
    if (current) {
      current.ariaSelected = false;
    }
    if (elem) {
      this.inputContainer.setAttribute("aria-activedescendant", elem.id);
      elem.ariaSelected = true;
      // this.setValue(elem.dataset.value, elem.dataset.label)
    }
  }

  /**
   * Retourne l'élément sélectionné dans les options
   * @returns {Element | null} Item sélectionné
   */
  getCurrentOption() {
    return this.optionsContent.querySelector("[aria-selected=true]");
  }

  onOptionChange(index) {
    // update state
    this.activeIndex = index;

    // update aria-activedescendant
    this.inputContainer.setAttribute('aria-activedescendant', `${this.baseOptionId}-${index}`);

    // update active option styles
    const options = this.optionsContent.querySelectorAll("[role=option]");
    [...options].forEach((optionEl) => {
      optionEl.ariaSelected = false;
    });
    options[index].ariaSelected = true;

    // ensure the new option is in view
    if (isScrollable(this.optionsContent)) {
      maintainScrollVisibility(options[index], this.optionsContent);
    }

    // ensure the new option is visible on screen
    if (!isElementInView(options[index])) {
      options[index].scrollIntoView({ behavior: 'smooth', block: "nearest" });
    }
  }

  onOptionClick(index) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.collapse(true);
  }

  /**
   * Gère la réaction en cas d'écriture dans l'interface (pour l'instant ne fait rien)
   * @param {String} key Touche clavier
   */
  onComboType(key) {
    console.log(key)
  }
  /**
   * Créé une option avec une valeur et un label
   * @param {String} value Valeur du choix (dépend de la propriété)
   * @param {String} label Libellé à afficher
   * @param {Number} index Indice de l'élément (utile pour les raccourcis claviers)
   */
  addChoice(value, label, index) {
    const option = document.createElement("button");
    option.role = "option";
    option.id = `${this.baseOptionId}-${index}`;
    option.ariaSelected = false;
    option.dataset.type = this.type;
    option.dataset.value = value;
    option.tabIndex = -1;
    option.style.setProperty("--bg-color", value);

    if (value === this.choice.dataset.value) {
      option.ariaSelected = value === this.choice.dataset.value ? true : false;
      this.activeIndex = index;
    }
    const choice = document.createElement('span');
    choice.className = 'input-style__option-value';
    choice.ariaHidden = true;
    if (this.type === "icon" && value.trim().length) {
      choice.classList.add(value);
    }

    const lab = document.createElement('label');
    lab.id = `${this.baseOptionId}-${index}__label`;
    lab.className = 'input-style__option-label';
    lab.innerText = label;

    // Mets le label dans l'attribut "labelled by" de l'option
    option.setAttribute("aria-labelled-by", lab.id);

    option.addEventListener('click', (event) => {
      event.stopPropagation();
      this.onOptionClick(index);
    });

    option.appendChild(choice);
    option.appendChild(lab);
    return option;
  }
}

export default CustomSelect; 