import BaseObject from "ol/Object.js";
import StyleObj from "./StyleObj.js";
import StyleContainer from "./StyleContainer.js";
import BaseVector from "ol/layer/BaseVector.js";
import Feature from 'ol/Feature.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { unByKey } from 'ol/Observable';
import VectorStyle from "mcutils/layer/VectorStyle.js";
import { defaultIgnStyle } from "mcutils/style/ignStyleFn.js";
import { flatToIGNKeyValue, flatToIgnStyle, ignStyleToFlatStyle } from "../StyleDialog/styleToFlatStyle.js";
import { Collection } from "ol";

import BaseEvent from "ol/events/Event.js";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID.js";
import { TabNav } from "geopf-extensions-openlayers/src/index.js";
import "./EditStyle.scss";
import { LabelForm } from "../StyleDialog/labelForm.js";
import TabNavItem from "geopf-extensions-openlayers/src/packages/Controls/Toggle/TabNavItem.js";
import { StyleForm } from "../StyleDialog/styleForm.js";

/**
 * @typedef {Object} EditStyleOptions
 * @property {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers à styliser
 * @property {StyleObj} styleObj Style à modifier
 * @property {HTMLElement|string} [target] Élément HTML ou id auquel ajouter le conteneur
 * @property {Boolean} [visible] Si faux, rend le conteneur invisible
 * @property {String} [className] Classe CSS racine du conteneur
 */

/**
 * @enum {string}
 */
const EditStyleEventType = {
  /**
   * Envoyé au clic sur le bouton revenir en arrière
   * ou lors du clic sur le bouton appliquer.
   * @event EditStyleEvent#rollback-style
   * @api
   */
  ROLLBACK: 'rollback-style',
  /**
   * Envoyé au clic sur le bouton appliquer.
   * @event EditStyleEvent#apply-style
   * @api
   */
  APPLY: 'apply-style',
};

/**
 * @classdesc
 * Les événements envoyés par des instances de {@link StyleContainer} 
 * sont des instances de ce type.
 */
export class EditStyleEvent extends BaseEvent {

  /**
   * @param {EditStyleEventType} type Type d'événement.
   * @param {StyleObj} styleObj Style à modifier
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche OpenLayers à styliser
   */
  constructor(type, styleObj, layer) {
    super(type);

    /**
     * Style géré par ce conteneur.
     * @type {StyleObj}
     * @api
     */
    this.styleObj = styleObj;

    /**
     * Couche OpenLayers à styliser.
     * @type {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default>}
     * @api
     */
    this.layer = layer;
  }
}

/**
 * Représente le conteneur d'édition d'un style.
 */
class EditStyle extends BaseObject {
  /**
   * @param {EditStyleOptions} options
   */
  constructor(options) {
    options ??= {};
    super(options);

    this._initialize(options);
    this._initContainer(options);
    this._initEvents(options);

    this.setStyleObj(options.styleObj);
    this.setLayer(options.layer);

    // Ajotue 
    if (options.target) {
      const target = options.target instanceof HTMLElement
        ? options.target
        : document.getElementById(options.target);
      target?.appendChild(this.getElement())
    }
  }

  /**
   * Initialise les valeurs du contrôle.
   * @protected
   * @param {EditStyleOptions} options Options du constructeur
   */
  _initialize(options) {
    /** 
     * @type {Array<import("ol/events.js").EventsKey>}
     * Tableau d'écouteurs d'événements (pour les enlever plus facilement)
     */
    this.styleObjKey = [];
    this._uid = SelectorID.generate();

    /** @type {Collection<import("../StyleDialog/ExtendedFlatStyleForm.js").default>} */
    this.forms = new Collection();

    // Formulaire de style
    this.styleForm = new StyleForm({
      preview: true,
      selectGeomType: true,
    });
    this.forms.push(this.styleForm);

    // Formulaire d'étiquette
    this.labelForm = new LabelForm({
      generalType: false,
    });
    this.forms.push(this.labelForm);
  }

  /**
   * Initialise le DOM du contrôle.
   * @protected
   * @param {EditStyleOptions} options Options du constructeur
   */
  _initContainer(options) {
    const container = this.element = document.createElement("div");
    container.className = options.className ?? "";
    container.classList.add("edit-style__container");

    // Header
    const header = this.header = this._createHeaderElement(options);
    container.appendChild(header);

    // Contenu principal
    const content = this._createContentElement(options);
    container.appendChild(content);

    // Garde des éléments en mémoire
    this.styleName = header.querySelector(".style-title__name");

    options.visible === false && this.setVisible(false);

    return container;
  }

  /**
   * Initialise les événements sur le contrôle.
   * @protected
   * @param {EditStyleOptions} options Options du constructeur
   */
  _initEvents(options) {
    this.styleForm.on("style", (e) => {
      // console.log({property: e.property, value: e.value});
    })

    // TODO : appliquer le changement de géom pour les autres formulaires
  }

  /**
   * Créé le header
   * @param {EditStyleOptions} options Options du constructeur
   * @returns {HTMLElement} header
   */
  _createHeaderElement(options) {
    const header = document.createElement("div");
    header.className = "edit-style__header";

    // Bouton retour en arrière
    const saveStyleBtn = document.createElement("button");
    saveStyleBtn.className = "save-style-btn fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-arrow-left-line";
    saveStyleBtn.addEventListener("click", this.rollbackStyle.bind(this));
    saveStyleBtn.textContent = saveStyleBtn.title = "Enregistrer le style";

    // Preview
    const preview = this._createPreview(options);
    preview.className = "style-title__preview";

    // Nom
    const name = document.createElement("span");
    name.className = "style-title__name fr-text--sm";

    // Bouton appliquer
    const applyBtn = document.createElement("button");
    applyBtn.className = "apply-btn fr-btn fr-btn--sm";
    applyBtn.addEventListener("click", this.applyStyle.bind(this));
    applyBtn.textContent = "Appliquer";

    header.appendChild(saveStyleBtn);
    header.appendChild(preview);
    header.appendChild(name);
    header.appendChild(applyBtn);

    return header;
  }

  /**
   * Créé le contenu
   * @returns {HTMLElement} contenu
   */
  _createContentElement() {
    const content = document.createElement("div");
    content.className = "edit-style__content";

    // Contenu du tabnav
    const tabNavContent = document.createElement("div");
    tabNavContent.className = "edit-style__tabnav-content";

    const tabNav = this._createTabNavElement(tabNavContent);

    content.appendChild(tabNav.getElement());
    content.appendChild(tabNavContent);


    return content;
  }

  /**
   * Créé la navigation tertiaire
   * 
   * @param {HTMLElement} contentContainer Conteneur du contenu lié aux onglets
   * @returns {TabNav} Navigation tertiaire
   */
  _createTabNavElement(contentContainer) {
    // Navigation tertiaire
    const tabnav = this.tabnav = new TabNav({
      items: [{
        label: "Style",
        content: this.styleForm.getContent(),
      },
      {
        label: "Texte",
        content: this.labelForm.getContent(),
      },
      {
        label: "Conditions",
        content: this._createConditionsContent(),
      }],
      contentContainer: contentContainer,
    });

    return tabnav;
  }

  /**
   * Retourne le formulaire pour l'étiquette de l'objet.
   * @returns {StyleForm} Formulaire pour l'étiquette
   */
  getStyleForm() {
    return this.styleForm;
  }

  /**
   * Retourne le formulaire pour l'étiquette de l'objet.
   * @returns {LabelForm} Formulaire pour l'étiquette
   */
  getLabelForm() {
    return this.labelForm;
  }

  /**
   * Créé le contenu de l'édition de conditions.
   * Ce dernier n'est pas créé ni affiché pour les styles par défaut
   * 
   * @param {EditStyleOptions} options Options du constructeur
   * @returns {HTMLElement} Contenu de l'édition de condition
   */
  _createConditionsContent() {
    let div = document.createElement("div")

    if (!this.getStyleObj()?.isDefault) {
      // AJOUTER CONDITION
      div.textContent = "Ajout de condition";
    } else {
      div.className = "fr-hidden";
    }

    return div;
  }


  /**
   * Créé la preview du style
   * @param {EditStyleOptions} options Options du constructeur
   * @returns {HTMLElement}
   */
  _createPreview(options) {
    // TODO : ajouter la preview (vraie preview)
    return document.createElement("div");
  }


  /**
   * @param {StyleObj} styleObj
   */
  setStyleObj(styleObj) {
    // Enlève les écouteurs d'événements déjà en place
    this.styleObjKey.forEach(key => unByKey(key));
    if (styleObj instanceof StyleObj) {
      this.set("styleObj", styleObj);
      this.styleName.textContent = styleObj.name;
      this.setDefault(styleObj.isDefault);

      // Modifie les formulaires
      this.forms.forEach(form => {
        form.setGeom(styleObj.type);
        form.setFlatStyle(styleObj.getFlatStyle());
      })

      // N'affiche le sélecteur que sur la partie style
      this.styleForm.showSelectGeomType(!styleObj.isDefault);

      // Affiche le premier onglet
      this.tabnav.selectFirst();
    } else {
      this.set("styleObj", null);
    }
  }

  /**
   * Paramètre l'affichage pour un style par défaut / conditionnel
   * 
   * @param {Boolean} bool Si vrai, cache ou désactive certains éléments tel que
   * le choix de la géométrie et les conditions. Sinon, les affiche
   */
  setDefault(bool) {
    /** @type {TabNavItem} */
    const conditions = this.tabnav.items.getArray().at(-1);
    const isCondition = (conditions.getButton().textContent === "Conditions");
    if (bool) {
      // Cache le bouton de la navigation tertiaire
      isCondition && conditions.getElement().classList.add("fr-hidden")
    } else {
      isCondition && conditions.getElement().classList.remove("fr-hidden")
    }
  }

  /**
   * @returns {StyleObj}
   */
  getStyleObj() {
    return this.get("styleObj");
  }

  /**
   * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer
   */
  setLayer(layer) {
    if (layer instanceof BaseVector || layer instanceof VectorStyle) {
      this.set("layer", layer);
    }
  }

  /**
   * @returns {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default|null}
   */
  getLayer() {
    return this.get("layer") || null;
  }

  /**
   * Sauvegarde / modifie le style
   * 
   * @fires EditStyleEvent#rollback-style
   */
  rollbackStyle() {
    // TODO : NE PAS SAUVEGARDER LE STYLE
    this.dispatchEvent(new EditStyleEvent(EditStyleEventType.ROLLBACK, this.getStyleObj(), this.getLayer()));
  }

  /**
   * Applique le style à la couche
   * 
   * @fires EditStyleEvent#save-style
   */
  applyStyle() {
    // TODO : APPLIQUER LE STYLE À LA COUCHE (SANS ENREGISTRER ?)
    this.dispatchEvent(new EditStyleEvent(EditStyleEventType.APPLY, this.getStyleObj(), this.getLayer()));
    // Met à jour le styleObj
    // TODO : AJOUTER LES AUTRES FORMULAIRES
    this.getStyleObj().setFlatStyle(this.styleForm.getStyleObj().getFlatStyle());

    const ignStyle = flatToIgnStyle(this.getStyleObj().getFlatStyle());
    Object.entries(ignStyle).forEach(([key, value]) => this.getLayer().setIgnStyle(key, value));

    this.getLayer().getSource()?.changed();
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  setVisible(visible) {
    this.set("visible", !!visible);
    this.getElement().classList.toggle("fr-hidden", !visible);
  }
}

export default EditStyle;
