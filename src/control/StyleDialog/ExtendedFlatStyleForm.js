/**
 * @file Formulaire pour le style d'un objet
 */
import FlatStyleForm from 'geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js';
import StyleObj from '../LayerStyle/StyleObj.js';
import "./ExtendedFlatStyleForm.scss";

/**
 * @typedef {Object} ExtendedFlatStyleFormOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [hasreset] Indique si le formulaire a un bouton de reset.
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
    const footer = this.footer = document.createElement("div");
    footer.className = "style-form__footer";
    this.getContent().appendChild(footer);
    if (options.hasreset) {
      const btn = document.createElement("button");
      btn.innerHTML = "Revenir au style par défaut";
      btn.className = "fr-btn reset fr-icon-corner-up-left-fill fr-btn--icon-left fr-btn--tertiary";
      btn.type = "button";
      btn.addEventListener("click", e => this.dispatchEvent({ type: "reset" }));
      footer.appendChild(btn);
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
      let error = false;
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
    styleObj.type && this.setGeom(styleObj.type);
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

    if (this.isPreviewShown()) {
      // Modifie le styleObj
      this.styleObj.setFlatStyle(this.flatStyle, true);
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