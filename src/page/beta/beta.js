import carte from "../../carte.js";
import Beta from "../../control/Beta/Beta.js";

let beta = new Beta({
  target: document.body.querySelector("main"),
});

carte.addControl('beta', beta)