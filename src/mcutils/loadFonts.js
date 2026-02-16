/** @module font/loadFonts
 * @description Function to check font load
 * @internal
 */
import WebFont from 'webfontloader';

/* Load ol-ext font definitions */
import './addRemixIconFont.js';

/** Chargement des fonts de Ma carte
 * @param {function|undefined} onLoadFn function called when a font is loaded
 */
function loadFonts(onLoadFn) {
  WebFont.load({
    custom: {
      families: ['remix'],
      testStrings: { 'remix': '\uec79' },
    },
    classes: false,
    // Chargement des classes
    fontactive: (f) => {
      console.info(f)
      setTimeout(function () {
        if (onLoadFn) onLoadFn({ type: 'loadfont', font: f });
      });
    },
    fontloading: (f) => {
      console.info(f)
    },
    // oops
    fontinactive: (f) => {
      console.warn("Can't load font: " + f);
    }
  });
}

export default loadFonts
