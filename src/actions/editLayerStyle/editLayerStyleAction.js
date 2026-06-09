import Action from "../Action.js";
import ol_ext_element from "ol-ext/util/element.js";
import LayerStyleContainer from "../../control/LayerStyle/LayerStyleContainer.js";
import "./editLayerStyle.scss";
import EditStyle from "../../control/LayerStyle/EditStyle.js";


/// INSTANCES UTILISÉS DANS DIFFÉRENTES FONCTIONS ///
/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action
 */
let dialog;
/** 
 * @type {LayerStyleContainer}
 * Conteneur des styles de la couche
 */
let layerContainer;
/** 
 * @type {EditStyle}
 * Édition d'un style
 */
let editStyle;

/**
 * Fonction appelée lors du clic sur le bouton d'ajout de style conditionnel
 */
function onAddConditionalStyleClick() {
  layerContainer.addConditionalStyle();
}

/**
 * Créé le contenu principal du dialogue
 * @returns {HTMLElement}
 */
function createMainContent() {
  const root = ol_ext_element.create("div", {
    className: "edit-layer-style-content",
  });

  const header = ol_ext_element.create("div", {
    className: "edit-layer-style-content__header",
    parent: root,
  });

  ol_ext_element.create("button", {
    className: "fr-btn fr-btn--sm fr-icon-add-line fr-btn--icon-left fr-btn--tertiary-no-outline",
    type: "button",
    text: "Ajouter un style conditionnel",
    parent: header,
    on: {
      click: onAddConditionalStyleClick,
    },
  });

  layerContainer = new LayerStyleContainer({
  });
  root.appendChild(layerContainer.getElement());

  return root;
}


/**
 * Créé le contenu d'édition du dialogue
 * @returns {HTMLElement}
 * @param {import("../../control/LayerStyle/EditStyle.js").EditStyleOptions} options
 */
function createEditStyleContent(options) {
  const editStyle = new EditStyle(options);

  return editStyle;
}

/**
 * Gère la visibilité du contenu.
 * @param {Boolean} visible Si vrai, affiche le contenu principal et cache l'éditeur de style. Sinon, fais l'inverse.
 */
function setMainContentVisibility(visible) {
  dialog?.querySelector(".edit-layer-style-content")?.classList.toggle("fr-hidden", !visible);
  editStyle?.setVisible(!visible);
}

/**
 * Fonction à l'ouverture du dialog.
 *
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  dialog = e.target;
  setMainContentVisibility(true);

  // Créé le conteneur d'édition de style
  editStyle = createEditStyleContent({
    visible: false,
    layer: editLayerStyleAction.layer,
    target: dialog.getDialogContent(),
  });

  // Ajoute / modifie du contenu
  dialog.setDialogTitle(editLayerStyleAction.layer?.get('title'));

  // Set layer
  layerContainer.setLayer(editLayerStyleAction.layer);
  
  // Écouteurs d'événements
  layerContainer.on("open-style", (/** @type {import("../../control/LayerStyle/StyleContainer.js").StyleContainerEvent} */ e) => {
    setMainContentVisibility(false);
    openStyle(e.layer, e.styleObj);
  });

  // Écouteur d'événement à la sauvegarde du style
  editStyle.on("rollback-style", (/** @type {import("../../control/LayerStyle/EditStyle.js").EditStyleEvent} */ e) => {
    setMainContentVisibility(true);
    console.log(e);
  });
}

/**
 * Ouvre un nouveau dialogue avec une modification du style
 * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche à modifier
 * @param {import("../../control/LayerStyle/StyleObj.js").default} styleObj Objet de style
 */
function openStyle(layer, styleObj) {
  editStyle.setStyleObj(styleObj);
  // console.log(layer, styleObj);
}

const content = createMainContent();

const editLayerStyleAction = new Action({
  id: "edit-layer-style",
  content: content,
  icon: "fr-icon-brush-line",
  size: "md",
  onOpen: onOpen,
});

export default editLayerStyleAction;
