import carte from "../../carte.js";
import Beta from "../../control/Beta/Beta.js";
import charte from "../../charte/charte.js";
import Charte from "../../charte/objects/Charte.js";
import "./beta.scss";


// Deux badges pour éviter qu'ils changent de place
const betaMap = new Beta({
  className : "beta-map"
});

const betaLayout = new Beta({
  target: document.body.querySelector("main"),
});


charte.on("change:mode", (e) => {
  if (e.target.get(e.key) === Charte.modes.STORYMAP) {
    carte.removeControl('betaMap');
    carte.addControl('betaLayout', betaLayout);
  } else {
    // setTimeout pour empêcher d'avoir le badge qui bouge
    setTimeout(() => {
      carte.removeControl('betaLayout');
      carte.addControl('betaMap', betaMap);
    }, 300);
  }
})

carte.addControl('betaMap', betaMap);