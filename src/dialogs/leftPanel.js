import Dialog from "geopf-extensions-openlayers/src/packages/Controls/Toggle/Dialog.js";
import { carte } from "../story";

const leftPanel = new Dialog({
  id : "layer-style-dialog",
  position : "left",
  icon : "fr-icon-brush-line",
});

export default leftPanel;