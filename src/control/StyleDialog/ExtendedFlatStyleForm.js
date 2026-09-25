/**
 * @file Formulaire pour le style d'un objet
 */
import FlatStyleForm from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import StyleObj from '../LayerStyle/StyleObj.js';
import element from 'ol-ext/util/element.js';

import "./ExtendedFlatStyleForm.scss";
import { flatToIgnStyle, ignStyleToFlatStyle } from './styleToFlatStyle.js';
import getUid from '../../utils/getUid.js';
import SymbolLib from 'mcutils/style/SymbolLib.js';

/**
 * @typedef {Object} ExtendedFlatStyleFormOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [hasreset] Indique si le formulaire a un bouton de reset.
 * @property {Boolean} [noSymbolLib] Indique si le formulaire n'a pas de bouton pour ouvrir la bibliothèque de symboles.
 * @property {Boolean} [preview = false] Si vrai, affiche la preview. L'affichage de la preview est contrôlé par la méthode `showPreview(bool)`. 
 * @property {Boolean} [selectGeomType = false] Si vrai, affiche le sélecteur pour changer le type d'objet à modifier. L'affichage de la sélection est contrôlé par la méthode `showSelectGeomType(bool)`.
 * @property {import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} [type] Si donné, utilise la méthode setGeom(type) sur le formulaire pour modifier directement le type.
 */

class ExtendedFlatStyleForm extends FlatStyleForm {

  /**
   * @param {ExtendedFlatStyleFormOptions} options Options du constructeur
   */
  constructor(options = {}) {
    super(options);
    this._initialize(options);

    // Header avec sélecteur et preview
    const container = this.header = document.createElement("div");
    container.className = "style-form__header";

    const titleElem = document.createElement('div');
    titleElem.className = 'style-form-title';
    container.appendChild(titleElem);
    // Title
    const span = document.createElement('span');
    span.className = 'fr-hint-text';
    titleElem.appendChild(span);
    // Boutons du titre
    const btnContainer = document.createElement('div');
    btnContainer.className = 'style-btn-container';
    titleElem.appendChild(btnContainer);

    const select = this.selectGeomType = this._addSelectGeomType(options.type);
    container.appendChild(select);
    this.showSelectGeomType(options.selectGeomType);

    const preview = this.preview = this._addPreview();
    container.appendChild(preview);
    this.showPreview(options.preview);

    // Place le header avant le formulaire
    this.getElement().before(container);

    this.styleObj = new StyleObj({
      flatStyle: this.flatStyle,
    })

    // Restaure style
    if (options.hasreset) {
      this.addTitleButton({
        title: 'Revenir au style par défaut', 
        icon: 'fr-icon-arrow-go-back-line',
        onClick: () => {
          this.dispatchEvent({ type: "reset" });
        }
      });
    }
    // TODO selection de style depuis la bibliothèque
    const onselect = (symbol) => {
      const style = ignStyleToFlatStyle(symbol.getIgnStyle());
      this.setFlatStyle(style);
      this.styleObj.setFlatStyle(style);
      this.dispatchEvent({ 
        type: "style",
        ignStyle: symbol.getIgnStyle(),
        flatStyle: style,
        typeGeom: symbol.getType()
      });
      this.updatePreview();
    }
    if (!options.noSymbolLib) {
      // Bouton pour ajouter le style actuel à la bibliothèque
      this.addTitleButton({
        title: 'Ajouter à la bibliothèque', 
        icon: 'addToSymbolLib fr-icon-add-line',
        haspopup: true,
        onClick: (e) => {
          const inputGroup = document.createElement('div');
          inputGroup.className = 'fr-input-group';
          e.element.appendChild(inputGroup);

          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.id = 'style-name-input-'+getUid();
          nameInput.className = 'fr-input';
          nameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              validateButton.click();
            }
            if (event.key === 'Escape') {
              e.hide?.();
            }
          });
          
          const inputLabel = document.createElement('label');
          inputLabel.setAttribute('for', nameInput.id);
          inputLabel.className = 'fr-label';
          inputLabel.innerText = 'Nom';
          inputGroup.appendChild(inputLabel);

          inputGroup.appendChild(nameInput);
          nameInput.focus();
          // Validation => send event
          const validateButton = document.createElement('button'); 
          validateButton.innerText = 'Enregistrer';
          validateButton.className = 'fr-btn';
          validateButton.addEventListener('click', () => {
            if (nameInput.value) {
              e.hide?.();
              // Add the symbol to the library
              const currentSymbol = new SymbolLib({
                type: this.styleObj.get('type'),
                name: nameInput.value,
                style: flatToIgnStyle(this.styleObj.getFlatStyle())
              });
              carte.getSymbolLib().push(currentSymbol);

              // Dispatch envent
              this.dispatchEvent({
                type: "lib:addsymbol",
                name: nameInput.value,
                styleObj: this.styleObj,
              });
            }
          });
          e.element.appendChild(validateButton);
        }
      });

      // Bouton pour ouvrir la bibliothèque de symboles
      this.addTitleButton({
        title: 'Bibliothèque de style',
        icon: 'fromSymbolLib fr-icon-book-2-line',
        haspopup: true,
        onClick: () => {
          const symbolLib = this.symbolLib || carte.getSymbolLib();
          return;
          this.dispatchEvent({
            type: "lib:getsymbol",
            styleObj: this.styleObj,
          });
        }
      });
    }

    // Alerte pour le style au calque
    const divAlert = document.createElement("div");
    divAlert.className = "fr-alert fr-alert--warning fr-alert--small";
    this.getContent().appendChild(divAlert);

    // Ajoute les inputs personnalisés
    this._addCustomInputs(options);

    // Type du formulaire
    this.setGeom(options.type);
    this._initEvents(options);
  }

  /**
   * Ajoute un titre dans le formulaire.
   * @param {string} title 
   */
  setTitle(title) {
    const titleElem = this.header.querySelector('.style-form-title span');
    titleElem.innerText = title;
  }

  /**
   * Ajoute un bouton dans le titre du formulaire.
   * @param {*} options 
   *  @param {string} options.title title of the button
   *  @param {string} options.icon icon of the button
   *  @param {boolean} options.haspopup whether the button has a popup
   *  @param {function} options.onClick click handler for the button
   * @returns 
   */
  addTitleButton(options) {
    const btnContainer = this.header.querySelector('.style-btn-container');
    if (!btnContainer) {
      return;
    }
    const popupContainer = document.createElement('div');
    popupContainer.className = 'style-popup';
    btnContainer.appendChild(popupContainer);
    // Création du bouton
    const btn = document.createElement('button');
    btn.className = (options.icon||'') + ' fr-btn fr-btn--sm gpf-btn--tertiary fr-btn--tertiary-no-outline';
    btn.title = options.title;
    btn.id = 'style-popup-btn-' + getUid();
    popupContainer.appendChild(btn);
    // Has popup
    if (options.haspopup !== undefined) {
      // Create popup
      const popup = document.createElement('div');
      popup.id = 'style-popup-' + getUid();
      popup.role = 'dialog';
      // Set ARIA attributes for accessibility
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-pressed', false);
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', popup.id);

      function hideonclick(event) {
        if (event && event.target.closest && event.target.closest('.style-popup') === popupContainer) {
          return;
        }
        document.removeEventListener("click", hideonclick);
        window.removeEventListener("resize", hideonclick);
        btn.setAttribute('aria-pressed', false);
        btn.setAttribute('aria-expanded', false);
      }
      popupContainer.appendChild(popup);
      // Title for the popup
      const popupTitle = document.createElement('span');
      popupTitle.className = (options.icon||'') + ' style-popup-title';
      popupTitle.innerText = options.title;
      popup.appendChild(popupTitle);
      // container for the popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'style-popup-content';
      popup.appendChild(popupContent);
      // Click on the button to toggle the popup
      btn.addEventListener("click", (event) => {
        popupContent.innerHTML = '';
        // Pressed ?
        const isPressed = btn.getAttribute('aria-pressed') === 'false';
        btn.setAttribute('aria-pressed', isPressed);
        btn.setAttribute('aria-expanded', isPressed);
        if (isPressed) {
          document.addEventListener("click", hideonclick);
          window.addEventListener("resize", hideonclick);
          var rect = btn.getBoundingClientRect();
          popup.style.top = rect.top + "px";
          popup.style.left = rect.right + "px";
          if (typeof options.onClick === "function") {
            options.onClick({
              event: event,
              isPressed: isPressed,
              element: popupContent,
              hide: hideonclick
            });
          }
        } else {
          hideonclick();
        }
      });
    } else {
      if (typeof options.onClick === "function") {
        btn.addEventListener("click", (event) => {
          options.onClick(event);
        });
      }
    }
    return btn;
  }

  /** Get form footer
   * @return {HTMLElement} Footer element
   */
  getFooter() {
    return this.footer;
  }

  /** Get form header
   * @return {HTMLElement} Header element
   */
  getHeader() {
    return this.header;
  }

  setGeom(featureOrGeomName) {
    super.setGeom(featureOrGeomName);

    delete this.getContent().dataset.conditionStyle;

    // Interdire le changement de style si le style est géré par la couche (style conditionnel, statistique, etc.)
    if (featureOrGeomName) {
      // Is feature ?
      const feature = featureOrGeomName.length ? featureOrGeomName[0] : featureOrGeomName;
      // Vérifie si le style est géré par la couche
      if (feature && feature.getLayer) {
        // Style conditionnel
        if (feature.getLayer().getConditionStyle().length > 0) {
          this.showError("Le style de cette couche est paramétré par des conditions.");
        } else if (feature.getLayer().get("type") === "Statistique") {
          // Style statistique
          this.showError("Le style de cette couche est paramétré par un style statistique.");
          // TODO : bouton pour convertir un
          //  couche statistique en couche simple
        } else {
          // TODO
        }
      } 
    }
  }

  /** Show error message
   * @param {String} message Message to show
   */
  showError(message) {
    this.getContent().dataset.conditionStyle = '';
    this.getContent().querySelector(".style-form-container .fr-alert").innerHTML =  `<p>
      Le formulaire de style ne peut pas être utilisé pour modifier le style de cette couche.
      <br/>` + message + "</p>";
  }

  /**
   * @param {ExtendedFlatStyleFormOptions} options Options du constructeur
   */
  _initialize(options) {
    super._initialize(options);

    options.preview ??= false;
    this.set("showPreview", options.preview);
    options.selectGeomType ??= false;
    this.set("showSelectGeomType", options.selectGeomType);
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @abstract
   * @protected
   */
  _addCustomInputs() {

  }

  /**
   * Gère le lien entre le formulaire de style et l'objet styleObj
   * @param {ExtendedFlatStyleFormOptions} options Options du constructeur
   */
  _initEvents(options) {
    super._initEvents(options);

    this.on("style", (e) => {
      this.styleObj.setFlatStyleProperty(e.property, e.value);
      // this.updatePreview();
    })

    this.styleObj.on("change:image", (e) => {
      const image = e.target.get(e.key);
      this.preview.lastChild.replaceWith(image);
    })
  }

  /**
   * @returns {StyleObj}
   */
  get styleObj() {
    return this.get("styleObj");
  }

  /**
   * @param {StyleObj} styleObj Objet styleObj
   */
  set styleObj(styleObj) {
    if (!(styleObj instanceof StyleObj)) {
      throw new SyntaxError("styleObj doit être de type StyleObj.")
    }
    styleObj.small = false;
    this.set("styleObj", styleObj);
    this.setFlatStyle(styleObj.getFlatStyle());
    styleObj.get("type") && this.setGeom(styleObj.get("type"));
  }

  /**
   * Met à jour la preview
   */
  updatePreview() {
    if (this.isPreviewShown()) {
      // Met à jour la preview
      const image = this.styleObj?.getImage({ small: false });
      this.preview.lastChild.replaceWith(image);
    }
  }

  /**
   * @param {Object} flatStyle - Le style flat utilisé pour initialiser les inputs
   * @override
   */
  setFlatStyle(flatStyle) {
    super.setFlatStyle(flatStyle);

    const styleo = this.styleObj.get('flatStyle')
    Object.keys(styleo).forEach(key => {
      styleo[key] = flatStyle[key];
    });
    
    if (this.isPreviewShown()) {
      // Modifie le styleObj
      this.styleObj.setFlatStyle(flatStyle, true);
      this.updatePreview();
    }
  }

  /**
   * Contrôle l'affichage du sélecteur de géométrie.
   * Pour savoir s'il est affiché, il est possible d'appeler la méthode {@link ExtendedFlatStyleForm.isSelectGeomTypeShown `isSelectGeomTypeShown`}.
   * @param {Boolean} [show = false] Si vrai, affiche le sélecteur. 
   */
  showSelectGeomType(show = false) {
    this.set("showSelectGeomType", show);
    this.selectGeomType.classList.toggle("fr-hidden", !show)
  }

  /**
   * Indique si la sélection de géométrie est visible
   * @returns {Boolean} Vrai si la sélection de géométrie est visible
   */
  isSelectGeomTypeShown() {
    return this.get("showSelectGeomType");
  }

  /**
   * Contrôle l'affichage de la preview.
   * Pour savoir si elle est affichée, il est possible d'appeler la méthode {@link ExtendedFlatStyleForm.isPreviewShown `isPreviewShown`}.
   * @param {Boolean} [show = false] Si vrai, affiche la preview. 
   */
  showPreview(show = false) {
    this.set("showPreview", show);
    this.preview.classList.toggle("fr-hidden", !show)
  }

  /**
   * Indique si la preview est visible
   * @returns {Boolean} Vrai si la preview est visible
   */
  isPreviewShown() {
    return this.get("showPreview");
  }

  /**
   * Récupère le style flat du formulaire
   * @returns {Object} Objet représentant le flat style
   */
  getFormFlatStyle() {
    return this.styleObj.getFlatStyle();
  }

  /**
   * Ajoute un sélecteur de géométrie au formulaire de style.
   * @param {import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} type Géométrie à sélectionner.
   * Par défaut, n'en sélectionne pas.
   * @returns {HTMLElement} Élément HTML à ajouter
   */
  _addSelectGeomType(type) {
    const selectGroup = document.createElement("div");
    selectGroup.className = "style-form__select-geom fr-select-group";

    const label = document.createElement("label");
    label.className = "fr-label";
    label.htmlFor = "select-geom-type";
    label.textContent = "Symbolisation";

    const select = document.createElement("select");
    select.className = "fr-select";
    select.id = "select-geom-type";
    select.name = "select-geom-type";

    // Transforme le type en option valable
    let mappedType;
    switch (type) {
      case 'Point':
      case 'MultiPoint':
        mappedType = 'Point';
        break;
      case 'LineString':
      case 'MultiLineString':
        mappedType = 'LineString';
        break;
      case 'Polygon':
      case 'MultiPolygon':
        mappedType = 'Polygon';
        break;
      default:
        mappedType = '';
        break;
    }

    const geomTypes = [
      { value: "Point", text: "Point" },
      { value: "LineString", text: "Ligne" },
      { value: "Polygon", text: "Surface" },
    ];

    geomTypes.forEach(geom => {
      const option = document.createElement("option");
      option.value = geom.value;
      option.textContent = geom.text;
      if ((mappedType || "Point") === geom.value) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener("change", evt => {
      this.setGeom(evt.target.value);
      this.updatePreview();
    });

    selectGroup.append(label, select);
    return selectGroup
  }

  /**
   * Ajoute une preview au formulaire de style
   * @returns {HTMLElement} Élément HTML à ajouter
   */
  _addPreview() {
    const preview = document.createElement("div");
    preview.className = "style-form__preview";

    const label = document.createElement("label");
    label.className = "fr-label";
    label.textContent = "Aperçu";
    preview.appendChild(label);

    let image = document.createElement("canvas");
    if ((this.styleObj instanceof StyleObj)) {
      image = this.styleObj.getImage({ small: false });
    } else {
      image.width = 72;
      image.height = 72;
    }

    preview.appendChild(image);

    return preview;
  }
}

export default ExtendedFlatStyleForm;