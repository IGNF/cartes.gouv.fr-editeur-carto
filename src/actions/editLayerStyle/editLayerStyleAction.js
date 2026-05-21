import Action from "../Action.js";
import ol_ext_element from "ol-ext/util/element.js";
import "./editLayerStyle.scss";

/**
 * @type {import('../../control/Dialog/AbstractDialog.js').default}
 * Dialog utilisé par l'action
 */
let dialog;

function onAddConditionalStyleClick() {
  console.log("Ajouter un style conditionnel");
}

function createContent() {
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

  ol_ext_element.create("div", {
    className: "layer-styles-container",
    parent: root,
  });

  return root;
}

const content = createContent();

/**
 * Fonction à l'ouverture du dialog.
 *
 * @param {Event} e Événement générique openlayer
 * @param {import('../../control/Dialog/AbstractDialog.js').default} e.target
 * Dialog utilisé par l'action
 */
function onOpen(e) {
  console.log(e);
  dialog = e.target;
}

const editLayerStyleAction = new Action({
  id: "edit-layer-style",
  title: "",
  content: content,
  icon: "fr-icon-brush-line",
  size: "md",
  onOpen: onOpen,
});

export default editLayerStyleAction;
