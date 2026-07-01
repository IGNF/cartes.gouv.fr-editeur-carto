/**
 * @file Formulaire pour le popup d'un objet
 */
import FlatStyleForm from "geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js";
import carte from "../../carte.js";

import "./popupForm.scss";

// TODO: let currentFeature = null;
let currentCoord = null;

// Get current feature and coordinate from carte popup
carte.on('layer:featureInfo', e => {
  // currentFeature = e.feature
  currentCoord = e.coordinate
})

/**
 * @typedef {Object} PopupFromOptions Options pour le formulaire de style d'un objet
 * @property {Boolean} [hasbutton] Indique si le formulaire a un bouton de validation.
 * @property {Boolean} [preview = false] Faux par défaut. Si vrai, affiche la preview. L'affichage de la preview est contrôlé par la méthode `showPreview(bool)`.
 * @property {Boolean} [selectGeomType = false] Faux par défaut. Si vrai, affiche le sélecteur pour changer le type d'objet à modifier. L'affichage de la sélection est contrôlé par la méthode `showSelectGeomType(bool)`.
 * @property {import('geopf-extensions-openlayers/src/packages/Controls/StyleDialog/FlatStyleForm.js').GeomType} [type] Si donné, utilise la méthode setGeom(type) sur le formulaire pour modifier directement le type.
 * @property {Boolean} [generalType = true] Vrai par défaut. Si vrai, le type de géométrie n'influe pas sur le formulaire et seul 3 inputs sont ajoutés. Sinon, les propriétés flat-style sont précédés du type de géométrie et ne sont affichés que si le type de géométrie est donné.
 */


class PopupForm extends FlatStyleForm {
  /**
   * @param {PopupFromOptions} options Options du constructeur
   */
  constructor(options = {}) {
    super(options);
    this._addCustomInputs(options);
  }

  /**
   * @param {PopupFromOptions} options Options du constructeur
   * @override
   */
  _initialize(options) {
    super._initialize(options);
  }

  /**
   * Méthode permettant d'ajouter des inputs directement dans une classe
   * étendue.
   * @param {PopupFromOptions} options Options du constructeur
   * @abstract
   * @protected
   */
  _addCustomInputs(/* options */) {
    this._addInput({
      label: "Titre",
      property: "popup-titre",
      type: "text"
    });
    this._addInput({
      label: "Description",
      property: "popup-desc",
      type: "textarea"
    });
    this._addInput({
      label: "Image",
      labelInfo: "URL",
      labelError: "L'URL doit commencer par http:// ou https://",
      property: "popup-img",
      type: "url"
    });
    this._addInput({
      label: "Lien",
      labelInfo: "Nom",
      property: "popup-link",
      type: "text"
    });
    this._addInput({
      label: "",
      labelInfo: "URL",
      labelError: "L'URL doit commencer par http:// ou https://",
      property: "popup-url",
      type: "url"
    });
    let tout = null;
    ["popup-titre", "popup-desc", "popup-link"].forEach(key => {
      this.inputs[key].addEventListener("input", e => {
        if (this.feature) {
          this.setPopupContent(this.feature, key, e.target.value);
          clearTimeout(tout);
          tout = setTimeout(() => {
            this.feature.showPopup(carte.popup, currentCoord);
          }, 200);
        }
      });
    });
  }

  /** Update feature popup content
   * @param {import('ol/Feature.js').default} f Feature to update
   * @param {String} key Key to update
   * @param {String} value Value to set
   * @private
   * 
   */
  setPopupContent(f, key, value) {
    const content = f.getPopupContent() || {};
    content[key.split('-')[1]] = value;
    content.active = false;
    ['titre', 'desc', 'img', 'link', 'url', 'coord'].forEach(k => {
      if (content[k]) {
        content.active = true;
      }
    });
    f.setPopupContent(content);
  }

  /** Add input
   * @param {Object} options Options de l'input
   * @private
   */
  _addInput(options) {
    const type = options.type;
    options.type = options.type.replace(/^(url|text)$/, "input");
    const input = this.addInput(options);
    if (options.type === "input") {
      input.type = type;
      if (options.labelInfo) {
        const labelInfo = document.createElement("span");
        labelInfo.className = "fr-hint-text";
        labelInfo.innerText = options.labelInfo;
        input.parentNode.querySelector("label").appendChild(labelInfo);
      }
      if (options.labelError) {
        const labelError = document.createElement("div");
        labelError.className = "fr-messages-group";
        labelError.ariaLive = "assertive";
        input.ariaDescribedby = labelError.id = input.id + "-error";
        input.parentNode.appendChild(labelError);
        const labelErrorTxt = document.createElement("p");
        labelErrorTxt.className = "fr-message fr-message--error";
        labelErrorTxt.innerText = options.labelError;
        labelError.appendChild(labelErrorTxt);
      }
      if (type === "url") {
        input.pattern="https?://.*"
      }
    }
    return input;
  }

  /**
   * Récupère le contenu global du formulaire
   * @returns {HTMLElement} L'élément conteneur du formulaire (avec la grille et le bouton)
   */
  getContent () {
    return this.container;
  }

  /**
   * Définit le contenu du formulaire à partir d'une feature
   * @param {import('ol/Feature.js').default
   */
  setFeature(feature) {
    this.feature = feature;
    const options = feature?.getPopupContent() || {};
    ['titre', 'desc', 'img', 'link', 'url'].forEach(key => {
      this.inputs['popup-' + key].value = options[key] || '';
    });
  }
}

// Création du formulaire de popup
const popupForm = new PopupForm();

export default popupForm;
export { PopupForm };