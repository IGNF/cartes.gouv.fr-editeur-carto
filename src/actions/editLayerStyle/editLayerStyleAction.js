import Action from "../Action.js";
import ol_ext_element from "ol-ext/util/element.js";
import LayerStyleContainer from "../../control/LayerStyle/LayerStyleContainer.js";
import "./editLayerStyle.scss";
import EditStyle from "../../control/LayerStyle/EditStyle.js";
import symbolLibAction from "../symbolLib/symbolLibAction.js";
import styleLibDialog from "../../dialogs/styleLibDialog.js";
import { createDefaultStyle } from "ol/style/flat.js";
import { ignStyleToFlatStyle } from "../../control/StyleDialog/styleToFlatStyle.js";
import StyleObj from "../../control/LayerStyle/StyleObj.js";


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
  editStyle.on(["rollback-style", "apply-style"], () => {
    setMainContentVisibility(true);
  });
  // Écouteur d'événement à la gestion de la librairie de symboles
  function onLibSymbolEvent(e) {
    const type = editStyle.getStyleForm().styleObj.get('type');
    let styleObj = null;
    if (e.type === "lib:addsymbol") {
      const styles = createDefaultStyle() || {};
      [editStyle.getStyleForm(), editStyle.getLabelForm()].forEach(frm => {
        const st = frm.getFormFlatStyle();
        Object.keys(st).forEach((key) => {
          styles[key] = st[key];
        });
      });
      styleObj = new StyleObj({
        flatStyle: styles,
        type: type,
      });
    }
    symbolLibAction.open(styleLibDialog, { 
      styleObj: styleObj,
      typeGeom: type,
      onSelect: (symbol) => {
        // Get style from forms
        const style = ignStyleToFlatStyle(symbol.getIgnStyle());
        openStyle(editStyle.getLayer(), new StyleObj({
          flatStyle: style,
          type: symbol.getType(),
        }));
      },
    });
  }
  editStyle.getStyleForm().on(["lib:addsymbol", "lib:getsymbol"], onLibSymbolEvent);
  editStyle.getLabelForm().on(["lib:addsymbol", "lib:getsymbol"], onLibSymbolEvent);

}

/**
 * Ouvre un nouveau dialogue avec une modification du style
 * @param {import('ol/layer/BaseVector').default|import('mcutils/layer/VectorStyle.js').default} layer Couche à modifier
 * @param {import("../../control/LayerStyle/StyleObj.js").default} styleObj Objet de style
 */
function openStyle(layer, styleObj) {
  editStyle.setStyleObj(styleObj);
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
