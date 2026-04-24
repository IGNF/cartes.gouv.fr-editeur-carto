import story from "../../story.js";
import Layout from "../../control/Layout/Layout.js";
import charte from "../../charte/charte.js";
import Charte from "../../charte/objects/Charte.js";

const layout = new Layout(story, {
  id: "layout-dialog",
  target: document.body.querySelector("main"),
});

charte.on("change:mode", (e) => {
  if (e.target.get(e.key) === Charte.modes.STORYMAP) {
    layout.show();
  } else {
    layout.close();
  }
})