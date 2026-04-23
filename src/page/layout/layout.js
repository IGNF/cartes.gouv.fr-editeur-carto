import story from "../../story";
import Layout from "../../control/Layout/Layout";
import charte from "../../charte/charte";
import Charte from "../../charte/objects/Charte";

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