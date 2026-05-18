import story from "../../story.js";
import Layout from "../../control/Layout/Layout.js";
import charte from "../../charte/charte.js";
import Charte from "../../charte/objects/Charte.js";

const layout = new Layout(story, {
  id: "layout-dialog",
  target: document.body.querySelector("main"),
});

// Bouge l'élément avant la carte pour plus de cohérence
// Vis à vis du tab
const target = story.get("target");
if (target instanceof HTMLElement) {
  target.parentNode.insertBefore(layout.getElement(), target);
}

charte.on("change:mode", (e) => {
  if (e.target.get(e.key) === Charte.modes.STORYMAP) {
    layout.show();
  } else {
    layout.close();
  }
})