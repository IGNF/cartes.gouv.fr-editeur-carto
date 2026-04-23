import carte from "../../carte.js";
import Beta from "../../control/Beta/Beta.js";
import charte from "../../charte/charte.js";
import Charte from "../../charte/objects/Charte.js";


// Deux badges pour éviter qu'ils changent de place
const betaMap = new Beta({ });

const betaLayout = new Beta({
  target: document.body.querySelector("main"),
});


charte.on("change:mode", (e) => {
  if (e.target.get(e.key) === Charte.modes.STORYMAP) {
    carte.removeControl('betaMap');
    carte.addControl('betaLayout', betaLayout);
  } else {
    carte.removeControl('betaLayout');
    carte.addControl('betaMap', betaMap);
  }
})

carte.addControl('betaMap', betaMap);